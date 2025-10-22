export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Cosmos",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    // {
    //   label: "About Us",
    //   href: "/about-us",
    // },
    // {
    //   label: "Contact Us",
    //   href: "/contact-us",
    // },
    {
      label: "login",
      href: "/login",
    },
  ],
  navMenuItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Blog",
      href: "/blog",
    },
    {
      label: "About",
      href: "/about",
    },
    {
      label: "login",
      href: "/login",
    },
  ],
  // links: {
  //   github: "https://github.com/nextui-org/nextui",
  //   twitter: "https://twitter.com/getnextui",
  //   docs: "https://nextui.org",
  //   discord: "https://discord.gg/9b6yyZKmH4",
  //   sponsor: "https://patreon.com/jrgarciadev",
  // },
};
