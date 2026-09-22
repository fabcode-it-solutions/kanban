import { NextResponse } from "next/server";
import { z } from "zod/v4";
import { findUserByEmail, createUser } from "@/models/user.model";

const RegisterSchema = z.object({
  email: z.email("Invalid email format"),
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[a-z]/, "Must contain a lowercase letter")
    .regex(/[0-9]/, "Must contain a number"),
});

export async function POST(req: Request) {
  try {
    if (!req.headers.get("content-type")?.includes("application/json")) {
      return NextResponse.json(
        { error: "Use application/json" },
        { status: 415 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const validation = RegisterSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed ",
          details: z.treeifyError(validation.error),
        },
        { status: 400 }
      );
    }

    const { name, email, password } = validation.data;

    const existing = await findUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: "Account with this email already exists" },
        { status: 409 }
      );
    }

    const user = await createUser({ name, email, password });

    return NextResponse.json(
      {
        success: true,
        data: user,
        message: "Registration successful. Please wait for admin approval.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Unexpected error", message: "Please try again later" },
      { status: 500 }
    );
  }
}
