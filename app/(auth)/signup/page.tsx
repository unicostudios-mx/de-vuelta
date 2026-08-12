import { SignupForm } from "@/components/signup-form";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <main className="mx-auto flex min-h-[calc(100vh-73px)] max-w-sm flex-col justify-center px-6 py-10">
      <h1 className="mb-8 text-2xl font-bold text-foreground">Crea tu cuenta</h1>
      <SignupForm next={next} />
    </main>
  );
}
