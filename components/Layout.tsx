import {
  Container,
  VStack,
  Text,
  Flex,
  Box,
  HStack,
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
  Icon,
  MenuGroup,
  useColorMode,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { PropsWithChildren } from "react";
import { FiMenu } from "react-icons/fi";
import { FaSun } from "react-icons/fa";
import { CiCloudMoon } from "react-icons/ci";

function Navigation({
  link,
  children,
  isExternal,
  download,
}: {
  link: string;
  children: string;
  isExternal?: boolean;
  download?: string;
}) {
  const router = useRouter();
  const isActive =
    link === "/" ? router.asPath === link : router.asPath.includes(link);

    const isDownloadLink = !!download;

    if (isExternal || isDownloadLink) {
      // For external or download links, render an <a> tag directly
      return (
        <a 
          href={link} 
          target={isExternal ? "_blank" : "_self"} 
          rel={isExternal ? "noopener noreferrer" : undefined}
          download={download}
        >
          <Text
            fontSize="lg"
            color={isActive ? "black" : "gray.500"}
            _hover={{ color: "black" }}
          >
            {children}
          </Text>
        </a>
      );
    } else {
      // For internal links, use Next.js Link component
      return (
        <Link href={link} passHref>
          <Text
            as="a" // Specify the Text component to render as an <a> tag
            fontSize="lg"
            color={isActive ? "black" : "gray.500"}
            _hover={{ color: "black" }}
          >
            {children}
          </Text>
        </Link>
      );
    }
  }

function Layout({ children }: PropsWithChildren) {
  return (
    <Container
      position="relative"
      mt={{ base: 16, md: 20 }}
      pb={{ base: 8, md: "10em" }}
      gap={{ md: 10 }}
    >
      <Flex
        position="absolute"
        right="100%"
        mr="160px"
        display={{ base: "none", lg: "flex" }}
      >
        <VStack position="fixed" align="flex-start" spacing={10}>
          <VStack align="flex-start">
            <Text fontWeight="bold" fontSize="x-small">
              NAVIGATION
            </Text>
            <Navigation link="/">Home</Navigation>
            <Navigation link="SamuelMatlockResume.pdf" isExternal>Résumé</Navigation>
            <Navigation link="/writing">Writing</Navigation>
          </VStack>
          <VStack align="flex-start">
            <Text fontWeight="bold" fontSize="x-small">
              FAVORITES
            </Text>
            <Navigation link="/books">Books</Navigation>
            <Navigation link="/music">Music</Navigation>
            <Navigation link="/movies">Movies</Navigation>
          </VStack>
          <VStack align="flex-start">
            <Text fontWeight="bold" fontSize="x-small">
              FIND ME ON
            </Text>
            <Navigation link="https://twitter.com/samuelmatlock" isExternal>
              Twitter
            </Navigation>
            <Navigation link="https://github.com/samuelmatlock" isExternal>
              GitHub
            </Navigation>
            <Navigation link="https://linkedin.com/in/samuelmatlock" isExternal>
              LinkedIn
            </Navigation>
          </VStack>
        </VStack>
      </Flex>
      <Container width={{ md: "container.md" }} position="relative">
        <Box
          width="100%"
          bg="white"
          height={20}
          position="fixed"
          top={0}
          zIndex={100}
          display={{ base: "none", lg: "block" }}
        />
        <Flex
          justify="space-between"
          position="fixed"
          top={0}
          display={{ base: "flex", lg: "none" }}
          height={12}
          zIndex={50}
          left={0}
          width="100%"
          align="center"
          borderBottom="1px solid"
          borderBottomColor="gray.200"
          bg="white"
        >
          <Container px={8}>
            <Flex justify="space-between" justifyContent="flex-end" width="100%">
            <Menu>
                <MenuButton
                  as={IconButton}
                  aria-label="Options"
                  icon={<Icon as={FiMenu} boxSize={5} />}
                  variant="outline"
                  size="sm"
                />
                <MenuList>
                  <MenuGroup title="NAVIGATION">
                    <VStack align="flex-start" px={4} spacing={3} mb={4}>
                      <Navigation link="/">Home</Navigation>
                      <Navigation link="SamuelMatlockResume.pdf" isExternal>Résumé</Navigation>
                      <Navigation link="/writing">Writing</Navigation>
                    </VStack>
                  </MenuGroup>
                  <MenuGroup title="FAVORITES">
                    <VStack align="flex-start" px={4} spacing={3} mb={4}>
                      <Navigation link="/books">Books</Navigation>
                      <Navigation link="/music">Music</Navigation>
                      <Navigation link="/movies">Movies</Navigation>
                    </VStack>
                  </MenuGroup>
                  <MenuGroup title="FIND ME ON">
                    <VStack align="flex-start" px={4} spacing={3} mb={2}>
                      <Navigation
                        link="https://twitter.com/samuelmatlock"
                        isExternal
                      >
                        Twitter
                      </Navigation>
                      <Navigation link="https://github.com/samuelmatlock" isExternal>
                        GitHub
                      </Navigation>
                      <Navigation link="https://linkedin.com/in/samuelmatlock" isExternal>
                        LinkedIn
                      </Navigation>
                    </VStack>
                  </MenuGroup>
                </MenuList>
              </Menu>
            </Flex>
          </Container>
        </Flex>
        {children}
      </Container>
    </Container>
  );
}

export default Layout;
