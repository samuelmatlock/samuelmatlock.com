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
import { Music, getAllMusic, getAllSlugs, getMusic } from "../../lib/music";
import { Musicshelf } from "../../components/Musicshelf";
import { Content } from "../../lib/mdx";
import { NextSeo } from "next-seo";

interface MusicProps {
  musics: Music[];
  music?: Content<Music>;
}

const Musics: NextPageWithLayout<MusicProps> = ({ musics, music }) => {
  if (music) {
    return (
      <>
        <NextSeo
          title={music.metadata.title}
          description={`${music.metadata.artist} · ${music.metadata.rating}/10`}
          openGraph={{
            title: music.metadata.title,
            description: `${music.metadata.artist} · ${music.metadata.rating}/10`,
          }}
        />
        <Stack spacing={4}>
          <VStack align="flex-start" spacing={1}>
            <Heading size="lg">{music.metadata.title}</Heading>
            <Text fontSize="sm" color="gray.500">
              {music.metadata.artist} · {music.metadata.rating}/10
            </Text>
          </VStack>
          <Prose>
            <MDXRemote compiledSource={music.source} scope={{}} frontmatter={{}} />
          </Prose>
        </Stack>
      </>
    );
  }

  return (
    <>
      <NextSeo title="Music | Samuel Matlock" />
      <Stack spacing={0}>
        {musics
          .slice()
          .sort((a, b) => b.rating - a.rating)
          .map((music, index) => (
            <Stack key={music.title}>
              {index > 0 && <Divider borderColor="gray.100" />}
              <Flex py={5} gap={5} align="flex-start">
                <Image
                  src={music.coverImage}
                  alt={music.title}
                  height={{ base: "90px", md: "110px" }}
                  flexShrink={0}
                />
                <VStack align="flex-start" spacing={1}>
                  <Link href={music.slug}>
                    <Text fontWeight="medium" _hover={{ color: "gray.500" }}>
                      {music.title}
                    </Text>
                  </Link>
                  <Text fontSize="sm" color="gray.400">
                    {music.artist} · {music.rating}/10
                  </Text>
                  {music.content && (
                    <Text fontSize="sm" color="gray.600" lineHeight="1.65" pt={1}>
                      {music.content}
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

export default Musics;

Musics.getLayout = (page: JSX.Element) => (
  <Layout>
    <Flex direction="column" gap={8}>
      <Musicshelf music={page.props.musics} />
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
    return { redirect: { destination: "/music" } };
  }

  const musics = getAllMusic();

  if (!params || !params.slug || params.slug.length === 0) {
    return { props: { musics } };
  }

  const music = await getMusic(params.slug[0] as string);
  if (!music) {
    return { redirect: { destination: "/music" } };
  }

  return { props: { musics, music } };
}
