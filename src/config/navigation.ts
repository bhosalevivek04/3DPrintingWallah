import { NavigationConfig } from "@/types/navigation";

export const navigationConfig: NavigationConfig = {
  mainNav: [
    {
      title: "Home",
      href: "/",
      description: "Return to NewtronLabs homepage",
    },
    {
      title: "Shop",
      href: "/shop",
      description: "Browse ready-to-order and personalised 3D printed products",
    },
    {
      title: "Custom 3D Printing",
      href: "/custom/3d-printing",
      description: "Upload your file or describe your idea — we'll print it",
    },
    {
      title: "How It Works",
      href: "/how-it-works",
      description: "Three simple steps from idea to delivery",
    },
    {
      title: "About",
      href: "/about",
      description: "Our story and our workshop",
    },
  ],
  footerNav: {
    shop: [
      { title: "All Products", href: "/shop" },
      { title: "Ready-to-order", href: "/shop?category=ready" },
      { title: "Personalised Products", href: "/shop?category=personalised" },
      { title: "New Arrivals", href: "/shop?sort=newest" },
    ],
    services: [
      { title: "Custom 3D Printing", href: "/custom/3d-printing" },
      { title: "Track Your Order", href: "/track-order" },
      { title: "How It Works", href: "/how-it-works" },
      { title: "File Guidelines", href: "/how-it-works#file-guidelines" },
    ],
    company: [
      { title: "About Us", href: "/about" },
      { title: "Contact", href: "/contact" },
      { title: "Privacy Policy", href: "/privacy" },
      { title: "Shipping Policy", href: "/shipping" },
    ],
  },
};
