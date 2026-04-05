import { serialize } from "next-mdx-remote/serialize";
import { MaybeContent } from "./mdx";
import path from "path";
import fs from "fs";

export interface Book {
  title: string;
  author: string;
  date: string;
  rating: number;
  coverImage: string;
  spineColor: string;
  textColor: string;
  slug: string;
  content: string;
}

export function getAllBooks(): Book[] {
  return JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "content", "books.json"), "utf8")
  );
}

export function getAllSlugs(): { params: { slug: string[] } }[] {
  return getAllBooks().map((book) => ({
    params: { slug: [book.slug.split("/").pop()!] },
  }));
}

export async function getBook(slug: string): Promise<MaybeContent<Book>> {
  const book = getAllBooks().find((b) => b.slug === `/books/${slug}`);
  if (!book) return undefined;

  const source = await serialize(book.content || "", {
    mdxOptions: { development: false },
  });

  return {
    metadata: book,
    source: source.compiledSource,
  };
}
