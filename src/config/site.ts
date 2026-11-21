export const siteConfig = {
  name: "3D Printing Wallah",
  shortName: "3DPW",
  tagline: "Ideas into objects. Made with 3D Printing Wallah.",
  description:
    "3D Printing Wallah creates custom 3D-printed products and brings your ideas to life. Find an everyday object, make it personal, or start something of your own.",
  url: "https://3dprintingwallah.com",
  ogImage: "https://3dprintingwallah.com/og.jpg",
  announcement: "Ideas into objects. Made with 3D Printing Wallah.",
  links: {
    shop: "/shop",
    customPrinting: "/custom/3d-printing",
    howItWorks: "/how-it-works",
    about: "/about",
    trackOrder: "/track-order",
    contact: "/contact",
    faq: "#faq",
  },
  contact: {
    email: "support@newtronlabs.in",
    contactText: "Contact 3D Printing Wallah ↗",
    instagram: "Instagram ↗",
    linkedin: "LinkedIn ↗",
  },
  copyright: "© 3D Printing Wallah. Made for ideas worth making.",
} as const;

export type SiteConfig = typeof siteConfig;
