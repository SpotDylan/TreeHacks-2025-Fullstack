export const metadata = {
  title: "Aegis",
  description: "Building biochemical agent delivery systems",
};

import PageIllustration from "@/components/page-illustration";
import Hero from "@/components/hero-home";
import Workflows from "@/components/workflows";
import Features from "@/components/features";
import Pricing from "@/components/pricing-home";
import SplitCarousel from "@/components/split-carousel";
import Founders from "@/components/founders";
import Cta from "@/components/cta";

export default function Home() {
  return (
    <>
      <PageIllustration />
      <Hero />
      <Workflows />
      <Features />
      <SplitCarousel />
      <Founders />
      {/* <Pricing />
      <Cta /> */}
    </>
  );
}
