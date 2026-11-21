import React from "react";
import { HeroSection } from "@/components/home/hero-section";
import { ReadyToOrderSection } from "@/components/home/ready-to-order-section";
import { PersonalisedSection } from "@/components/home/personalised-section";
import { CustomPrintingSection } from "@/components/home/custom-printing-section";
import { HowItWorksSection } from "@/components/home/how-it-works-section";
import { WhyChooseSection } from "@/components/home/why-choose-section";
import { SampleCreationsSection } from "@/components/home/sample-creations-section";
import { FAQSection } from "@/components/home/faq-section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "3D Printing Wallah — Ideas into objects. Made with 3D Printing Wallah.",
  description:
    "3D Printing Wallah creates custom 3D-printed products and brings your ideas to life. Find an everyday object, make it personal, or start something of your own.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ReadyToOrderSection />
      <PersonalisedSection />
      <CustomPrintingSection />
      <HowItWorksSection />
      <WhyChooseSection />
      <SampleCreationsSection />
      <FAQSection />
    </>
  );
}
