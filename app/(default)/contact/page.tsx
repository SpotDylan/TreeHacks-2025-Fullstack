export const metadata = {
  title: "Aegis",
  description: "Building biochemical agent delivery systems",
};

import PageIllustration from "@/components/page-illustration";
import FooterSeparator from "@/components/footer-separator";

export default function Contact() {
  return (
    <>
      <PageIllustration multiple />
      <section>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="py-12 md:py-20">
            {/* Section header */}
            <div className="pb-12 text-center">
              <h1 
                className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text pb-5 font-nacelle text-4xl font-semibold text-transparent md:text-5xl"
                data-aos="fade-up"
              >
                Contact us
              </h1>
              <div className="mx-auto max-w-3xl">
                <p className="text-xl text-indigo-200/65" data-aos="fade-up" data-aos-delay={200}>
                  Meet our team! Feel free to reach out to any of us with questions about Aegis or our work.
                </p>
              </div>
            </div>
            {/* Team grid */}
            <div className="mx-auto grid max-w-sm gap-8 sm:max-w-4xl sm:grid-cols-2 lg:max-w-5xl lg:grid-cols-4">
              {/* Team member 1 */}
              <div className="flex flex-col items-center" data-aos="fade-up" data-aos-delay={400}>
                <div className="mb-4 h-40 w-40 overflow-hidden rounded-full">
                  <img
                    src="/images/treehacks_anshA_pfp.jpeg"
                    alt="Team member"
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-200">Ansh Agrawal</h3>
                <p className="mb-4 text-center text-sm text-indigo-200/65">University of Toronto</p>
                <a
                  href="mailto:ansh.agrawal@utoronto.ca"
                  className="inline-flex items-center text-sm text-indigo-500 hover:text-indigo-400"
                >
                  Contact
                  <svg className="ml-2 h-3 w-3 fill-current" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.602 11l-.875-.864L9.33 6.534H0v-1.25h9.33L5.727 1.693l.875-.875L11.5 5.719z" />
                  </svg>
                </a>
              </div>
              {/* Team member 2 */}
              <div className="flex flex-col items-center" data-aos="fade-up" data-aos-delay={600}>
                <div className="mb-4 h-40 w-40 overflow-hidden rounded-full">
                  <img
                    src="/images/treehacks_dylan_pfp.jpeg"
                    alt="Team member"
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-200">Dylan Nguyen</h3>
                <p className="mb-4 text-center text-sm text-indigo-200/65">Massachusetts Institute of Technology</p>
                <a
                  href="mailto:dynguyen@mit.edu"
                  className="inline-flex items-center text-sm text-indigo-500 hover:text-indigo-400"
                >
                  Contact
                  <svg className="ml-2 h-3 w-3 fill-current" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.602 11l-.875-.864L9.33 6.534H0v-1.25h9.33L5.727 1.693l.875-.875L11.5 5.719z" />
                  </svg>
                </a>
              </div>
              {/* Team member 3 */}
              <div className="flex flex-col items-center" data-aos="fade-up" data-aos-delay={800}>
                <div className="mb-4 h-40 w-40 overflow-hidden rounded-full">
                  <img
                    src="/images/treehacks_rithvik_pfp.jpeg"
                    alt="Team member"
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-200">Rithvik Gabri</h3>
                <p className="mb-4 text-center text-sm text-indigo-200/65">Stanford University</p>
                <a
                  href="mailto:rithvik@stanford.edu"
                  className="inline-flex items-center text-sm text-indigo-500 hover:text-indigo-400"
                >
                  Contact
                  <svg className="ml-2 h-3 w-3 fill-current" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.602 11l-.875-.864L9.33 6.534H0v-1.25h9.33L5.727 1.693l.875-.875L11.5 5.719z" />
                  </svg>
                </a>
              </div>
              {/* Team member 4 */}
              <div className="flex flex-col items-center" data-aos="fade-up" data-aos-delay={1000}>
                <div className="mb-4 h-40 w-40 overflow-hidden rounded-full">
                  <img
                    src="/images/treehacks_anshS_pfp.jpeg"
                    alt="Team member"
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-200">Ansh Sheth</h3>
                <p className="mb-4 text-center text-sm text-indigo-200/65">Stanford University</p>
                <a
                  href="mailto:anshs@stanford.edu"
                  className="inline-flex items-center text-sm text-indigo-500 hover:text-indigo-400"
                >
                  Contact
                  <svg className="ml-2 h-3 w-3 fill-current" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.602 11l-.875-.864L9.33 6.534H0v-1.25h9.33L5.727 1.693l.875-.875L11.5 5.719z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <FooterSeparator />
    </>
  );
}
