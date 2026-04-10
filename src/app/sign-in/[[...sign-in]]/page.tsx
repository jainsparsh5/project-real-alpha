import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="min-h-screen grid place-items-center px-6 py-12">
      <SignIn forceRedirectUrl="/" />
    </main>
  );
}
