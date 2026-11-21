export interface HeroCarouselSlide {
  id: string;
  name: string;
  category: string;
  description: string;
  caption: string;
  meta: string;
  image: string;
  alt: string;
  href: string;
}

export const heroCarouselSlides: HeroCarouselSlide[] = [
  {
    id: "workshop-collection",
    name: "Studio Workshop Collection",
    category: "Desk & Home Decor",
    description: "Everyday objects, made layer by layer in our workshop.",
    caption: "Everyday objects, made layer by layer.",
    meta: "Concept render",
    image: "/images/hero-workshop.webp",
    alt: "Studio workshop collection featuring 3D printed blue ribbed planter and desktop accessories",
    href: "/shop",
  },
  {
    id: "ribbed-planter",
    name: "Ribbed Geometric Planter",
    category: "Home Decor & Collectibles",
    description: "Sculptural fluted vessel designed for greenery and desktops.",
    caption: "Textured fluted ribs with architectural precision.",
    meta: "Matte Cobalt Blue",
    image: "/images/product-ribbed-planter.webp",
    alt: "3D printed cobalt blue ribbed planter pot with live succulent",
    href: "/shop",
  },
  {
    id: "modular-desk-tray",
    name: "Modular Desk Organiser",
    category: "Desk Accessories",
    description: "A refined, tactile organiser for everyday creative tools.",
    caption: "Minimalist modular storage with chamfered slots.",
    meta: "Warm Sandstone",
    image: "/images/product-desk-tray.webp",
    alt: "Modular desk tray in natural warm beige finish holding stationery",
    href: "/shop",
  },
  {
    id: "personalised-desk-plate",
    name: "Personalised Name Plate",
    category: "Custom Collectibles",
    description: "Your name, custom typography, and bespoke finish.",
    caption: "Tactile embossed lettering tailored to your desk.",
    meta: "Custom 3D Lettering",
    image: "/images/personalised-desk-plate.webp",
    alt: "Personalised 3D printed name plate in custom display typography",
    href: "/shop?category=personalised",
  },
  {
    id: "everyday-cable-clips",
    name: "Geometric Cable Clips",
    category: "Desk Accessories",
    description: "Curved minimalist shapes to keep your workspace neat.",
    caption: "Flexible geometry fits standard USB-C cables.",
    meta: "Sage Green • Pack of 3",
    image: "/images/product-cable-clips.webp",
    alt: "Set of sage green geometric 3D printed cable clips holding cords neatly",
    href: "/shop",
  },
];
