import {
  Flex,
  Heading,
  Image,
  Stack,
  VStack,
  Text,
  Divider,
  Link,
} from "@chakra-ui/react";
import { GetStaticPropsContext, NextPageWithLayout } from "next";
import Layout from "../../components/Layout";
import { Prose } from "@nikolovlazar/chakra-ui-prose";
import { MDXRemote } from "next-mdx-remote";
import { Movie, getAllMovies, getAllSlugs, getMovie } from "../../lib/movies";
import { Movieshelf } from "../../components/Movieshelf";
import { Content } from "../../lib/mdx";
import { NextSeo } from "next-seo";

interface MoviesProps {
  movies: Movie[];
  movie?: Content<Movie>;
}

const Movies: NextPageWithLayout<MoviesProps> = ({ movies, movie }) => {
  if (movie) {
    return (
      <>
        <NextSeo
          title={movie.metadata.title}
          description={`${movie.metadata.director} · ${movie.metadata.rating}/10`}
          openGraph={{
            title: movie.metadata.title,
            description: `${movie.metadata.director} · ${movie.metadata.rating}/10`,
          }}
        />
        <Stack spacing={4}>
          <VStack align="flex-start" spacing={1}>
            <Heading size="lg">{movie.metadata.title}</Heading>
            <Text fontSize="sm" color="gray.500">
              {movie.metadata.director} · {movie.metadata.rating}/10
            </Text>
          </VStack>
          <Prose>
            <MDXRemote compiledSource={movie.source} scope={{}} frontmatter={{}} />
          </Prose>
        </Stack>
      </>
    );
  }

  return (
    <>
      <NextSeo title="Movies | Samuel Matlock" />
      <Stack spacing={0}>
        {movies
          .slice()
          .sort((a, b) => b.rating - a.rating)
          .map((movie, index) => (
            <Stack key={movie.title}>
              {index > 0 && <Divider borderColor="gray.100" />}
              <Flex py={5} gap={5} align="flex-start">
                <Image
                  src={movie.coverImage}
                  alt={movie.title}
                  height={{ base: "90px", md: "110px" }}
                  flexShrink={0}
                />
                <VStack align="flex-start" spacing={1}>
                  <Link href={movie.slug}>
                    <Text fontWeight="medium" _hover={{ color: "gray.500" }}>
                      {movie.title}
                    </Text>
                  </Link>
                  <Text fontSize="sm" color="gray.400">
                    {movie.director} · {movie.rating}/10
                  </Text>
                  {movie.content && (
                    <Text fontSize="sm" color="gray.600" lineHeight="1.65" pt={1}>
                      {movie.content}
                    </Text>
                  )}
                </VStack>
              </Flex>
            </Stack>
          ))}
      </Stack>
    </>
  );
};

export default Movies;

Movies.getLayout = (page: JSX.Element) => (
  <Layout>
    <Flex direction="column" gap={8}>
      <Movieshelf movies={page.props.movies} />
      <Divider borderColor="gray.100" />
      {page}
    </Flex>
  </Layout>
);

export async function getStaticPaths() {
  const paths = getAllSlugs();
  return {
    paths: [{ params: { slug: undefined } }, ...paths],
    fallback: false,
  };
}

export async function getStaticProps({ params }: GetStaticPropsContext) {
  if (params && params.slug && params.slug.length > 1) {
    return { redirect: { destination: "/movies" } };
  }

  const movies = getAllMovies();

  if (!params || !params.slug || params.slug.length === 0) {
    return { props: { movies } };
  }

  const movie = await getMovie(params.slug[0] as string);
  if (!movie) {
    return { redirect: { destination: "/movies" } };
  }

  return { props: { movies, movie } };
}
