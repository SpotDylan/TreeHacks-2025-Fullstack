import PageIllustration from "@/components/page-illustration";

export const metadata = {
  title: "Aegis",
  description: "Building biochemical agent delivery systems",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative flex grow flex-col">
      <PageIllustration multiple />

      {children}
    </main>
  );
}
