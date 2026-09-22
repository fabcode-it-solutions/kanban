"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { registerUser } from "@/redux/slices/authSlice";
import { registerSchema } from "@/libs/validation/registerSchema";
import Link from "next/link";

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const { loading, error, user } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = registerSchema.safeParse(formData);

    if (!result.success) {
      const errors = result.error.errors.map((err) => err.message);
      setValidationErrors(errors);
      return;
    }

    setValidationErrors([]);
    dispatch(registerUser(formData));
  };

  return (
    <div className="flex w-full bg-white h-screen">
      {/* Left: Video Side */}
      <div className="flex-1   relative">
        <video
          className="absolute z-[99] overflow-hidden h-full w-full inset-0  object-cover"
          autoPlay

          muted
          loop
        >
          <source src="/video/herobg.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black bg-opacity-40" />
      </div>

      {/* Right: Form Side */}
      <div className=" flex-1 flex w-full items-center justify-center ">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md p-8 space-y-2"
        >
          <h2 className="text-4xl font-medium text-center  pb-5 " >New User ?</h2>
          <h2 className="text-3xl text-gray-400 font-bold text-center">Register</h2>

        <div className="">
  <label htmlFor="name" className="text-sm font-medium text-gray-700">Name</label>
  <input
    id="name"
    type="text"
    name="name"
    placeholder="Your name"
    value={formData.name}
    onChange={handleChange}
    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 placeholder-gray-400"
    required
  />
</div>
 {/* Email Field */}
  <div className="">
    <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
    <input
      id="email"
      type="email"
      name="email"
      placeholder="Your email"
      value={formData.email}
      onChange={handleChange}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 placeholder-gray-400"
      required
    />
  </div>

  {/* Password Field */}
  <div className="">
    <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
    <input
      id="password"
      type="password"
      name="password"
      placeholder="Your password"
      value={formData.password}
      onChange={handleChange}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 placeholder-gray-400"
      required
    />
  </div>

        <button
    type="submit"
    disabled={loading}
    className="w-full px-4 py-3 bg-green-600 mt-6 text-white rounded-lg shadow hover:bg-green-700 transition duration-200"
  >
    {loading ? "Registering..." : "Register"}
  </button>

          {validationErrors.length > 0 && (
            <ul className="text-red-500 text-sm list-disc px-4">
              {validationErrors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          )}

          {error && <p className="text-red-500 text-center">{error}</p>}

          {user && (
            <p className="text-green-500 text-center">
              Registered! Wait for admin approval.
            </p>
          )}
<p className="text-center" >already have an account?</p>
          <Link  href={'/auth/login'} className=" text-gray-700 text-xl flex w-full justify-center underline font-medium" >Login</Link>
        </form>
      </div>
    </div>
  );
}
