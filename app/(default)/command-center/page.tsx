import PageIllustration from "@/components/page-illustration";
import MapComponent from "./map";
import EventCarousel from "./event-carousel";

export const metadata = {
  title: "Aegis",
  description: "Building biochemical agent delivery systems",
};

export default function CommandCenter() {
  return (
    <>
      <PageIllustration multiple />
      <section>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Hero content */}
          <div className="py-12 md:py-20">
            {/* Section header */}
            <div className="pb-12 text-center">
              <h1 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text pb-5 font-nacelle text-4xl font-semibold text-transparent md:text-5xl">
                Aegis Command Center
              </h1>
            </div>
            {/* Add your command center content here */}
            <div className="space-y-8">
              <div className="ml-4 max-w-2xl">
                <MapComponent />
              </div>
              <div className="w-full">
                <EventCarousel />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
