export const metadata = {
  title: "Aegis",
  description: "Building biochemical agent delivery systems",
};

import PageIllustration from "@/components/page-illustration";
import Hero from "@/components/hero-pricing";
import Faqs from "@/components/faqs";
import Testimonials from "@/components/testimonials";
import Cta from "@/components/cta";

export default function Pricing() {
  return (
    <>
      <PageIllustration />
      <Hero />
      <Faqs />
      <Testimonials />
      <Cta />
    </>
  );
}
