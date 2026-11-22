import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "3D Printing Wallah",
    short_name: "3DPW",
    description: "Custom 3D printing and precision crafted everyday objects.",
    start_url: "/",
    display: "standalone",
    background_color: "#fafaf9",
    theme_color: "#1c1917",
    icons: [
      {
        src: "/images/Logo.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
