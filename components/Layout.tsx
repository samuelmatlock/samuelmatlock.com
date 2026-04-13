import {
  Container,
  VStack,
  Text,
  Flex,
  Box,
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  Icon,
  MenuGroup,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { PropsWithChildren } from "react";
import { FiMenu } from "react-icons/fi";
import { GeometricBackground } from "./GeometricBackground";

function NavLabel({ children }: { children: string }) {
  return (
    <Text
      fontSize="xs"
      fontWeight="semibold"
      letterSpacing="widest"
      color="gray.300"
      mb={1}
    >
      {children}
    </Text>
  );
}

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
  const textProps = {
    fontSize: "sm",
    color: isActive ? "gray.900" : "gray.600",
    fontWeight: isActive ? "medium" : "normal",
    _hover: { color: "gray.900" },
    transition: "color 0.15s",
  };

  if (isExternal || isDownloadLink) {
    return (
      <a
        href={link}
        target={isExternal ? "_blank" : "_self"}
        rel={isExternal ? "noopener noreferrer" : undefined}
        download={download}
      >
        <Text {...textProps}>{children}</Text>
      </a>
    );
  }

  return (
    <Link href={link}>
      <Text {...textProps}>{children}</Text>
    </Link>
  );
}

function Layout({ children }: PropsWithChildren) {
  return (
    <>
    <GeometricBackground />
    <Container
      position="relative"
      zIndex={1}
      mt={{ base: 14, md: 16 }}
      pb={{ base: 12, md: "8em" }}
    >
      {/* Desktop sidebar */}
      <Flex
        position="absolute"
        right="100%"
        mr="140px"
        display={{ base: "none", lg: "flex" }}
      >
        <VStack position="fixed" top={16} align="flex-start" spacing={7} bg="white" borderRadius="xl" px={5} py={5} border="1px solid" borderColor="gray.100">
          <VStack align="flex-start" spacing={0}>
            <NavLabel>NAVIGATION</NavLabel>
            <Navigation link="/">Home</Navigation>
            <Navigation link="SamuelMatlockResume.pdf" isExternal>Résumé</Navigation>
            {/* <Navigation link="/writing">Writing</Navigation> */}
          </VStack>
          <VStack align="flex-start" spacing={0}>
            <NavLabel>FAVORITES</NavLabel>
            <Navigation link="/books">Books</Navigation>
            <Navigation link="/music">Music</Navigation>
            <Navigation link="/movies">Movies</Navigation>
          </VStack>
          <VStack align="flex-start" spacing={0}>
            <NavLabel>FIND ME ON</NavLabel>
            <Navigation link="https://twitter.com/samuelmatlock" isExternal>
              Twitter
            </Navigation>
            {/* <Navigation link="https://github.com/samuelmatlock" isExternal>
              GitHub
            </Navigation> */}
            <Navigation link="https://linkedin.com/in/samuelmatlock" isExternal>
              LinkedIn
            </Navigation>
          </VStack>
        </VStack>
      </Flex>

      <Container width={{ md: "container.md" }} position="relative">
        {/* Desktop top bar */}
        <Box
          width="100%"
          height={16}
          position="fixed"
          top={0}
          zIndex={100}
          display={{ base: "none", lg: "block" }}
        />

        {/* Mobile top bar */}
        <Flex
          justify="flex-end"
          position="fixed"
          top={0}
          display={{ base: "flex", lg: "none" }}
          height={12}
          zIndex={50}
          left={0}
          width="100%"
          align="center"
          borderBottom="1px solid"
          borderBottomColor="gray.100"
          bg="white"
          px={6}
        >
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Navigation"
              icon={<Icon as={FiMenu} boxSize={4} />}
              variant="ghost"
              size="sm"
            />
            <MenuList>
              <MenuGroup title="NAVIGATION">
                <VStack align="flex-start" px={4} spacing={1} mb={3}>
                  <Navigation link="/">Home</Navigation>
                  <Navigation link="SamuelMatlockResume.pdf" isExternal>Résumé</Navigation>
                  {/* <Navigation link="/writing">Writing</Navigation> */}
                </VStack>
              </MenuGroup>
              <MenuGroup title="FAVORITES">
                <VStack align="flex-start" px={4} spacing={1} mb={3}>
                  <Navigation link="/books">Books</Navigation>
                  <Navigation link="/music">Music</Navigation>
                  <Navigation link="/movies">Movies</Navigation>
                </VStack>
              </MenuGroup>
              <MenuGroup title="FIND ME ON">
                <VStack align="flex-start" px={4} spacing={1} mb={2}>
                  <Navigation link="https://twitter.com/samuelmatlock" isExternal>
                    Twitter
                  </Navigation>
                  {/* <Navigation link="https://github.com/samuelmatlock" isExternal>
                    GitHub
                  </Navigation> */}
                  <Navigation link="https://linkedin.com/in/samuelmatlock" isExternal>
                    LinkedIn
                  </Navigation>
                </VStack>
              </MenuGroup>
            </MenuList>
          </Menu>
        </Flex>

        {children}
      </Container>
    </Container>
    </>
  );
}

export default Layout;
