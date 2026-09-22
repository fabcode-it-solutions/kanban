// src/app/register/page.tsx
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      {/* <h1 className="text-2xl font-bold mb-4">Register</h1> */}
      <RegisterForm />
    </main>
  );
}
