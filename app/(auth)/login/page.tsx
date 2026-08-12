import { LoginForm } from "@/components/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <main className="mx-auto flex min-h-[calc(100vh-73px)] max-w-sm flex-col justify-center px-6 py-10">
      <h1 className="mb-8 text-2xl font-bold text-foreground">Inicia sesión</h1>
      <LoginForm next={next} />
    </main>
  );
}
