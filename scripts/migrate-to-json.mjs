import { serialize } from "next-mdx-remote/serialize";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cwd = path.join(__dirname, "..");

function extractBody(fileContents) {
  const parts = fileContents.split(/^---\s*$/m);
  // parts[0] = empty, parts[1] = frontmatter, parts[2+] = body
  if (parts.length >= 3) {
    return parts.slice(2).join("---").trim();
  }
  return "";
}

async function migrate(type, extraFields) {
  const basePath = path.join(cwd, "content", type);
  const files = fs.readdirSync(basePath).filter((f) => f.endsWith(".mdx"));

  const items = await Promise.all(
    files.map(async (fileName) => {
      const slug = fileName.replace(".mdx", "");
      const contentPath = path.join(basePath, fileName);
      const fileContents = fs.readFileSync(contentPath, "utf8");

      // Strip ## My Notes and everything after
      const bodyRaw = extractBody(fileContents).split("## My Notes")[0].trim();

      const source = await serialize(fileContents, {
        parseFrontmatter: true,
        mdxOptions: { development: false },
      });

      return {
        ...source.frontmatter,
        slug: `/${type}/${slug}`,
        content: bodyRaw,
      };
    })
  );

  // Sort books by date, others have no date so keep file order
  if (type === "books") {
    items.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  const outPath = path.join(cwd, "content", `${type}.json`);
  fs.writeFileSync(outPath, JSON.stringify(items, null, 2));
  console.log(`✓ Migrated ${items.length} ${type} → content/${type}.json`);
}

async function main() {
  await migrate("books");
  await migrate("movies");
  await migrate("music");
  console.log("\nDone. You can now delete content/books/*.mdx, content/movies/*.mdx, content/music/*.mdx");
}

main().catch(console.error);
