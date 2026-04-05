import { serialize } from "next-mdx-remote/serialize";
import { MaybeContent } from "./mdx";
import path from "path";
import fs from "fs";

export interface Movie {
  title: string;
  director: string;
  rating: number;
  coverImage: string;
  spineColor: string;
  textColor: string;
  slug: string;
  content: string;
}

export function getAllMovies(): Movie[] {
  return JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "content", "movies.json"), "utf8")
  );
}

export function getAllSlugs(): { params: { slug: string[] } }[] {
  return getAllMovies().map((movie) => ({
    params: { slug: [movie.slug.split("/").pop()!] },
  }));
}

export async function getMovie(slug: string): Promise<MaybeContent<Movie>> {
  const movie = getAllMovies().find((m) => m.slug === `/movies/${slug}`);
  if (!movie) return undefined;

  const source = await serialize(movie.content || "", {
    mdxOptions: { development: false },
  });

  return {
    metadata: movie,
    source: source.compiledSource,
  };
}
