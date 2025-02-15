"use client";

import Image from "next/image";

const founders = [
  {
    name: "Ansh Agrawal",
    school: "University of Toronto",
    image: "/images/treehacks_anshA_pfp.jpeg",
    linkedin: "https://www.linkedin.com/in/ansh-agrawal1/",
  },
  {
    name: "Dylan Nguyen",
    school: "MIT",
    image: "/images/treehacks_dylan_pfp.jpeg",
    linkedin: "https://www.linkedin.com/in/dylan-nguyenn/",
  },
  {
    name: "Ansh Sheth",
    school: "Stanford University",
    image: "/images/treehacks_anshS_pfp.jpeg",
    linkedin: "https://www.linkedin.com/in/ansh-sheth-684b8a215/",
  },
  {
    name: "Rithvik Gabri",
    school: "Stanford University",
    image: "/images/treehacks_rithvik_pfp.jpeg",
    linkedin: "https://www.linkedin.com/in/rithvikgabri/",
  },
];

export default function Founders() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="border-t py-12 [border-image:linear-gradient(to_right,transparent,--theme(--color-slate-400/.25),transparent)1] md:py-20">
          {/* Section header */}
          <div className="mx-auto max-w-3xl pb-12 text-center md:pb-20">
            <div className="inline-flex items-center gap-3 pb-3 before:h-px before:w-8 before:bg-linear-to-r before:from-transparent before:to-indigo-200/50 after:h-px after:w-8 after:bg-linear-to-l after:from-transparent after:to-indigo-200/50">
              <span className="inline-flex bg-linear-to-r from-indigo-500 to-indigo-200 bg-clip-text text-transparent">
                Our Team
              </span>
            </div>
            <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text pb-4 font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
              Meet the Creators
            </h2>
            <p className="text-indigo-200/65">
              A team of individuals passionate about revolutionizing military technology and enhancing operational safety.
            </p>
          </div>

          {/* Team members */}
          <div className="mx-auto grid max-w-sm grid-cols-1 gap-6 sm:max-w-none sm:grid-cols-2 md:grid-cols-4 md:gap-8">
            {founders.map((founder) => (
              <div
                key={founder.name}
                className="relative flex flex-col items-center"
              >
                <div className="relative mb-4 aspect-square w-40 overflow-hidden rounded-full">
                  <Image
                    className="object-cover"
                    src={founder.image}
                    alt={founder.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="text-center">
                  <a 
                    href={founder.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <h4 className="mb-1 font-nacelle text-xl font-semibold text-gray-200 group-hover:text-indigo-400 transition-colors">
                      {founder.name}
                    </h4>
                  </a>
                  <div className="text-sm text-indigo-200/65">{founder.school}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
