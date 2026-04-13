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
import { Book } from "../lib/books";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useRouter } from "next/router";

interface BookshelfProps {
  books: Book[];
}

const SCROLL_SPEED = 2.5;

export function Bookshelf({ books }: BookshelfProps) {
  const router = useRouter();
  const [bookIndex, setBookIndex] = React.useState(-1);
  const [scroll, setScroll] = React.useState(0);
  const [booksInViewport, setBooksInViewport] = React.useState(0);

  const bookshelfRef = React.useRef<HTMLDivElement>(null);
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

  const width = 41.5;
  const height = 270;
  const spineWidth = `${width}px`;
  const coverWidth = `${width * 4}px`;
  const bookWidth = `${width * 5}px`;
  const bookHeight = `${height}px`;
  const minScroll = 0;

  const maxScroll = React.useMemo(() => {
    return (
      (width + 12) * (books.length - booksInViewport) +
      (bookIndex > -1 ? width * 4 : 0) +
      5
    );
  }, [bookIndex, books.length, booksInViewport]);

  // Keep maxScrollRef in sync for RAF loop
  React.useEffect(() => { maxScrollRef.current = maxScroll; }, [maxScroll]);

  const applyScroll = React.useCallback((val: number) => {
    const clamped = Math.max(minScroll, Math.min(maxScrollRef.current, val));
    scrollValRef.current = clamped;
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(-${clamped}px)`;
    }
    return clamped;
  }, []);

  const stopRaf = React.useCallback(() => {
    dirRef.current = 0;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    // Sync React state for chevron visibility
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
    if (router.query.slug && router.query.slug.length > 0 && bookIndex === -1) {
      const idx = books.findIndex((b) =>
        b.slug.toLowerCase().includes((router.query.slug as string[])[0].toLowerCase())
      );
      setBookIndex(idx);
    }
  }, []);

  React.useEffect(() => {
    if (bookIndex > -1) {
      const target = (bookIndex - (booksInViewport - 4.5) / 2) * (width + 11);
      applyScroll(target);
      setScroll(target);
    }
  }, [bookIndex, booksInViewport, applyScroll]);

  React.useEffect(() => {
    if (viewportDimensions) {
      const numberOfBooks = viewportDimensions.contentBox.width / (width + 11);
      setBooksInViewport(numberOfBooks);
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
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="8" result="noise" />
            <feDiffuseLighting in="noise" lightingColor="white" surfaceScale="1" result="diffLight">
              <feDistantLight azimuth="45" elevation="35" />
            </feDiffuseLighting>
          </filter>
        </defs>
      </svg>

      <Box bg="white" border="1px solid" borderColor="gray.200" borderRadius="xl" px={5} py={5}>
        <Box position="relative" ref={bookshelfRef}>
          <Box
            position="absolute"
            left={{ base: "-28px", md: "-36px" }}
            height="100%"
            display={scroll > minScroll ? "block" : "none"}
          >
            <Center
              ref={scrollLeftRef}
              borderRadius="md"
              height="100%"
              width="28px"
              _hover={{ bg: "gray.100" }}
              borderRightRadius={{ base: 0, md: undefined }}
            >
              <Icon as={FaChevronLeft} boxSize={3} />
            </Center>
          </Box>

          <HStack alignItems="center" gap={1} overflowX="hidden" cursor="grab" ref={viewportRef}>
            {/* Single wrapper — transform applied here, not on each item */}
            <div
              ref={trackRef}
              style={{ display: "flex", gap: "4px", flexShrink: 0, willChange: "transform" }}
            >
              {books.map((book, index) => (
                <button
                  key={book.title}
                  onClick={() => {
                    if (index === bookIndex) {
                      setBookIndex(-1);
                      router.push(`/books`);
                    } else {
                      setBookIndex(index);
                      router.push(book.slug);
                    }
                  }}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    outline: "none",
                    flexShrink: 0,
                    width: bookIndex === index ? bookWidth : spineWidth,
                    perspective: "1000px",
                    WebkitPerspective: "1000px",
                    gap: "0px",
                    transition: "width 500ms ease",
                  }}
                >
                  <Flex
                    alignItems="flex-start"
                    justifyContent="center"
                    width={spineWidth}
                    height={bookHeight}
                    flexShrink={0}
                    transformOrigin="right"
                    backgroundColor={book.spineColor}
                    color={book.textColor}
                    transform={`rotateY(${bookIndex === index ? "-60deg" : "0deg"})`}
                    transition="all 500ms ease"
                    willChange="auto"
                    filter="brightness(0.8) contrast(2)"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <span style={{ pointerEvents: "none", position: "fixed", top: 0, left: 0, zIndex: 50, height: bookHeight, width: spineWidth, opacity: 0.4, filter: "url(#paper)" }} />
                    <Heading
                      mt="12px"
                      as="h2"
                      fontSize="xs"
                      fontFamily={`"DM Sans", sans-serif`}
                      style={{ writingMode: "vertical-rl" }}
                      userSelect="none"
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                      overflow="hidden"
                      maxHeight={`${height - 24}px`}
                    >
                      {book.title}
                    </Heading>
                  </Flex>
                  <Box
                    position="relative"
                    flexShrink={0}
                    overflow="hidden"
                    transformOrigin="left"
                    transform={`rotateY(${bookIndex === index ? "30deg" : "88.8deg"})`}
                    transition="all 500ms ease"
                    willChange="auto"
                    filter="brightness(0.8) contrast(2)"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <span style={{ pointerEvents: "none", position: "fixed", top: 0, right: 0, zIndex: 50, height: bookHeight, width: coverWidth, opacity: 0.4, filter: "url(#paper)" }} />
                    <span style={{ pointerEvents: "none", position: "absolute", top: 0, left: 0, zIndex: 50, height: bookHeight, width: coverWidth, background: `linear-gradient(to right, rgba(255,255,255,0) 2px, rgba(255,255,255,0.5) 3px, rgba(255,255,255,0.25) 4px, rgba(255,255,255,0.25) 6px, transparent 7px, transparent 9px, rgba(255,255,255,0.25) 9px, transparent 12px)` }} />
                    <Image src={book.coverImage} alt={book.title} width={coverWidth} height={bookHeight} style={{ transition: "all 500ms ease", willChange: "auto" }} />
                  </Box>
                </button>
              ))}
            </div>
          </HStack>

          <Box
            position="absolute"
            right={{ base: "-28px", md: "-36px" }}
            pl="10px"
            height="100%"
            top={0}
            display={scroll < maxScroll ? "block" : "none"}
          >
            <Center
              borderLeftRadius={{ base: 0, md: undefined }}
              ref={scrollRightRef}
              height="100%"
              borderRadius="md"
              width="28px"
              _hover={{ bg: "gray.100" }}
            >
              <Icon as={FaChevronRight} boxSize={3} />
            </Center>
          </Box>
        </Box>
      </Box>
    </>
  );
}
