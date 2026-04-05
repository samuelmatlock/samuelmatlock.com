import { serialize } from "next-mdx-remote/serialize";
import { MaybeContent } from "./mdx";
import path from "path";
import fs from "fs";

export interface Music {
  title: string;
  artist: string;
  rating: number;
  coverImage: string;
  spineColor: string;
  textColor: string;
  slug: string;
  content: string;
}

export function getAllMusic(): Music[] {
  return JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "content", "music.json"), "utf8")
  );
}

export function getAllSlugs(): { params: { slug: string[] } }[] {
  return getAllMusic().map((album) => ({
    params: { slug: [album.slug.split("/").pop()!] },
  }));
}

export async function getMusic(slug: string): Promise<MaybeContent<Music>> {
  const album = getAllMusic().find((m) => m.slug === `/music/${slug}`);
  if (!album) return undefined;

  const source = await serialize(album.content || "", {
    mdxOptions: { development: false },
  });

  return {
    metadata: album,
    source: source.compiledSource,
  };
}
