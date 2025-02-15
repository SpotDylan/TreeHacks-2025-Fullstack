"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function SignOut() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const signOut = async () => {
      await supabase.auth.signOut();
      router.push("/signin");
      router.refresh();
    };

    signOut();
  }, [router, supabase.auth]);

  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          <div className="animate-fade-up pb-12 text-center opacity-0 [--animation-delay:200ms]">
            <h1 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
              Signing you out...
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}
