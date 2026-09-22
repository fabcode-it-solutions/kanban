"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { getSession } from "next-auth/react";
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    if (res?.error) {
      setError("Invalid credentials");
      return;
    }

    const session = await getSession();
    const userRoles = session?.user?.roles;
    if (userRoles?.includes("admin")) {
      router.push('/admin');;
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-20 space-y-4">
      <input
        type="email"
        name="email"
        placeholder="Email"
        className="w-full p-2 border rounded"
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        className="w-full p-2 border rounded"
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required
      />
      <button
        type="submit"
        className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Login
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}
