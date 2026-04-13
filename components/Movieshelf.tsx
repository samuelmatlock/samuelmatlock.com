import {
  Box,
  Icon,
  HStack,
  Flex,
  Heading,
  Image,
  Center,
  useDimensions,
  useBreakpointValue,
} from "@chakra-ui/react";
import React from "react";
import { Movie } from "../lib/movies";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useRouter } from "next/router";

interface MovieshelfProps {
  movies: Movie[];
}

const SCROLL_SPEED = 2.5;

export function Movieshelf({ movies }: MovieshelfProps) {
  const router = useRouter();
  const [movieIndex, setMovieIndex] = React.useState(-1);
  const [scroll, setScroll] = React.useState(0);
  const [moviesInViewport, setMoviesInViewport] = React.useState(0);

  const movieshelfRef = React.useRef<HTMLDivElement>(null);
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const scrollRightRef = React.useRef<HTMLDivElement>(null);
  const scrollLeftRef = React.useRef<HTMLDivElement>(null);
  const viewportDimensions = useDimensions(viewportRef, true);
  const scrollValRef = React.useRef(0);
  const dirRef = React.useRef(0);
  const rafRef = React.useRef<number>();
  const maxScrollRef = React.useRef(0);

  const scrollEvents = useBreakpointValue({
    base: { start: "touchstart", stop: "touchend" },
    sm: { start: "mouseenter", stop: "mouseleave" },
  });

  const width = 25;
  const height = 270;
  const spineWidth = `${width}px`;
  const coverWidth = `${width * 7}px`;
  const movieWidth = `${width * 7}px`;
  const movieHeight = `${height}px`;
  const minScroll = 0;

  const maxScroll = React.useMemo(() => {
    return (
      (width + 12) * (movies.length - moviesInViewport) +
      (movieIndex > -1 ? width * 4 : 0) +
      5
    );
  }, [movieIndex, movies.length, moviesInViewport]);

  React.useEffect(() => { maxScrollRef.current = maxScroll; }, [maxScroll]);

  const applyScroll = React.useCallback((val: number) => {
    const clamped = Math.max(minScroll, Math.min(maxScrollRef.current, val));
    scrollValRef.current = clamped;
    if (trackRef.current) trackRef.current.style.transform = `translateX(-${clamped}px)`;
    return clamped;
  }, []);

  const stopRaf = React.useCallback(() => {
    dirRef.current = 0;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setScroll(scrollValRef.current);
  }, []);

  const startRaf = React.useCallback((dir: number) => {
    dirRef.current = dir;
    const tick = () => {
      if (dirRef.current === 0) return;
      applyScroll(scrollValRef.current + dirRef.current * SCROLL_SPEED);
      rafRef.current = requestAnimationFrame(tick);
    };
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
  }, [applyScroll]);

  React.useEffect(() => {
    if (router.query.slug && router.query.slug.length > 0 && movieIndex === -1) {
      const idx = movies.findIndex((b) =>
        b.slug.toLowerCase().includes((router.query.slug as string[])[0].toLowerCase())
      );
      setMovieIndex(idx);
    }
  }, []);

  React.useEffect(() => {
    if (movieIndex > -1) {
      const target = (movieIndex - (moviesInViewport - 4.5) / 2) * (width + 11);
      applyScroll(target);
      setScroll(target);
    }
  }, [movieIndex, moviesInViewport, applyScroll]);

  React.useEffect(() => {
    if (viewportDimensions) {
      const numberOfMovies = viewportDimensions.contentBox.width / (width + 11);
      setMoviesInViewport(numberOfMovies);
    }
  }, [viewportDimensions]);

  React.useEffect(() => {
    if (!scrollEvents) return;
    const currentScrollEvents = { ...scrollEvents };
    const right = scrollRightRef.current!;
    const left = scrollLeftRef.current!;

    const onRight = () => startRaf(1);
    const onLeft = () => startRaf(-1);
    const onStop = () => stopRaf();

    right.addEventListener(currentScrollEvents.start, onRight);
    right.addEventListener(currentScrollEvents.stop, onStop);
    left.addEventListener(currentScrollEvents.start, onLeft);
    left.addEventListener(currentScrollEvents.stop, onStop);

    return () => {
      stopRaf();
      right.removeEventListener(currentScrollEvents.start, onRight);
      right.removeEventListener(currentScrollEvents.stop, onStop);
      left.removeEventListener(currentScrollEvents.start, onLeft);
      left.removeEventListener(currentScrollEvents.stop, onStop);
    };
  }, [scrollEvents, startRaf, stopRaf]);

  return (
    <>
      <svg style={{ position: "absolute", inset: 0, visibility: "hidden" }}>
        <defs>
          <filter id="paper" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0" numOctaves="8" result="noise" />
            <feDiffuseLighting in="noise" lightingColor="white" surfaceScale="1" result="diffLight">
              <feDistantLight azimuth="45" elevation="35" />
            </feDiffuseLighting>
          </filter>
        </defs>
      </svg>

      <Box bg="white" border="1px solid" borderColor="gray.200" borderRadius="xl" px={5} py={5}>
        <Box position="relative" ref={movieshelfRef}>
          <Box
            position="absolute"
            left={{ base: "-28px", md: "-36px" }}
            height="100%"
            display={scroll > minScroll ? "block" : "none"}
          >
            <Center ref={scrollLeftRef} borderRadius="md" height="100%" width="28px" _hover={{ bg: "gray.100" }} borderRightRadius={{ base: 0, md: undefined }}>
              <Icon as={FaChevronLeft} boxSize={3} />
            </Center>
          </Box>

          <HStack alignItems="center" gap={1} overflowX="hidden" cursor="grab" ref={viewportRef}>
            <div ref={trackRef} style={{ display: "flex", gap: "4px", flexShrink: 0, willChange: "transform" }}>
              {movies.map((movie, index) => (
                <button
                  key={movie.title}
                  onClick={() => {
                    if (index === movieIndex) { setMovieIndex(-1); router.push(`/movies`); }
                    else { setMovieIndex(index); router.push(movie.slug); }
                  }}
                  style={{
                    display: "flex", flexDirection: "row", alignItems: "center",
                    justifyContent: "flex-start", outline: "none", flexShrink: 0,
                    width: movieIndex === index ? movieWidth : spineWidth,
                    perspective: "1000px", WebkitPerspective: "1000px",
                    gap: "0px", transition: "width 500ms ease",
                  }}
                >
                  <Flex alignItems="flex-start" justifyContent="center" width={spineWidth} height={movieHeight} flexShrink={0} transformOrigin="right" backgroundColor={movie.spineColor} color={movie.textColor} transform={`rotateY(${movieIndex === index ? "-60deg" : "0deg"})`} transition="all 500ms ease" willChange="auto" filter="brightness(0.8) contrast(2)" style={{ transformStyle: "preserve-3d" }}>
                    <span style={{ pointerEvents: "none", position: "fixed", top: 0, left: 0, zIndex: 50, height: movieHeight, width: spineWidth, opacity: 0.4, filter: "url(#paper)" }} />
                    <Heading mt="12px" as="h2" fontSize="xs" fontFamily={`"DM Sans", sans-serif`} style={{ writingMode: "vertical-rl" }} userSelect="none" textOverflow="ellipsis" whiteSpace="nowrap" overflow="hidden" maxHeight={`${height - 24}px`}>{movie.title}</Heading>
                  </Flex>
                  <Box position="relative" flexShrink={0} overflow="hidden" transformOrigin="left" transform={`rotateY(${movieIndex === index ? "30deg" : "88.8deg"})`} transition="all 500ms ease" willChange="auto" filter="brightness(0.8) contrast(2)" style={{ transformStyle: "preserve-3d" }}>
                    <span style={{ pointerEvents: "none", position: "fixed", top: 0, right: 0, zIndex: 50, height: movieHeight, width: coverWidth, opacity: 0.4, filter: "url(#paper)" }} />
                    <span style={{ pointerEvents: "none", position: "absolute", top: 0, left: 0, zIndex: 50, height: movieHeight, width: coverWidth, background: `linear-gradient(to right, rgba(255,255,255,0) 2px, rgba(255,255,255,0.5) 3px, rgba(255,255,255,0.25) 4px, rgba(255,255,255,0.25) 6px, transparent 7px, transparent 9px, rgba(255,255,255,0.25) 9px, transparent 12px)` }} />
                    <Image src={movie.coverImage} alt={movie.title} width={coverWidth} height={movieHeight} style={{ transition: "all 500ms ease", willChange: "auto" }} />
                  </Box>
                </button>
              ))}
            </div>
          </HStack>

          <Box position="absolute" right={{ base: "-28px", md: "-36px" }} pl="10px" height="100%" top={0} display={scroll < maxScroll ? "block" : "none"}>
            <Center borderLeftRadius={{ base: 0, md: undefined }} ref={scrollRightRef} height="100%" borderRadius="md" width="28px" _hover={{ bg: "gray.100" }}>
              <Icon as={FaChevronRight} boxSize={3} />
            </Center>
          </Box>
        </Box>
      </Box>
    </>
  );
}
