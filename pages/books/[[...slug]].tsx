import {
  Flex,
  Heading,
  Image,
  Stack,
  VStack,
  Text,
  Divider,
} from "@chakra-ui/react";
import { GetStaticPropsContext, NextPageWithLayout } from "next";
import Layout from "../../components/Layout";
import { Prose } from "@nikolovlazar/chakra-ui-prose";
import { MDXRemote } from "next-mdx-remote";
import { Book, getAllBooks, getBook } from "../../lib/books";
import { Bookshelf } from "../../components/Bookshelf";
import { Content } from "../../lib/mdx";

interface BooksProps {
  books: Book[];
  book?: Content<Book>;
}

const Books: NextPageWithLayout<BooksProps> = ({ books, book }) => {
  if (book) {
    return (
      <Stack spacing={3}>
        <Flex direction="row" align="flex-start" gap={6}>
          <VStack align="flex-start" flexGrow={1}>
            <Heading size="xl">{book.metadata.title}</Heading>
            <Text color="gray.400" fontSize="xl">
              By: {book.metadata.author} - Read: {book.metadata.date} - Rating:{" "}
              {book.metadata.rating}/10
            </Text>
          </VStack>
        </Flex>
        <Prose>
          <MDXRemote compiledSource={book.source} />
        </Prose>
      </Stack>
    );
  }

  return (
    <Stack spacing={5}>
      {books
        .slice()
        .sort((a, b) => b.rating - a.rating)
        .map((book, index) => (
          <Stack key={book.title} scrollMarginTop={20}>
            <Stack>
              {index > 0 && <Divider mb={3} width="100%" />}
              <Flex direction="row" align="flex-start" gap={6}>
                <Image
                  border="1px solid"
                  borderColor="gray.200"
                  src={book.coverImage}
                  alt={book.title}
                  height={{ base: "100px", sm: "140px", md: "160px" }}
                />
                <VStack align="flex-start" flexGrow={1}>
                  <Heading size="md">{book.title}</Heading>
                  <Text color="#999" size="md">
                    {book.author}
                  </Text>
                  <Text color="#666">
                    Read: {book.date} • Rating: {book.rating}/10
                  </Text>
                  <Prose>
                    <MDXRemote compiledSource={book.summary} />
                  </Prose>
                </VStack>
              </Flex>
            </Stack>
          </Stack>
        ))}
    </Stack>
  );
};

export default Books;

Books.getLayout = (page: JSX.Element) => (
  <Layout>
    <Flex direction="column" gap={8}>
      <Bookshelf books={page.props.books} />
      <Divider />
      {page}
    </Flex>
  </Layout>
);

export async function getServerSideProps({ params }: GetStaticPropsContext) {
  if (params && params.slug && params.slug.length > 1) {
    return {
      redirect: {
        destination: "/books",
      },
    };
  }

  const books = await getAllBooks();

  if (!params || !params.slug || params.slug.length === 0) {
    return {
      props: {
        books,
      },
    };
  }

  const book = await getBook(params.slug[0] as string);
  if (!book) {
    return {
      redirect: {
        destination: "/books",
      },
    };
  }

  return {
    props: { books, book },
  };
}