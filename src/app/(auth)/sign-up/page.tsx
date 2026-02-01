"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { register } from "@/server/auth/actions/register.action"; // Your server action
import { Loader2 } from "lucide-react";

// 1. Define your validation schema
const RegisterSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterFormValues = z.infer<typeof RegisterSchema>;

const Page = () => {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  // 2. Setup React Hook Form
  const {
    register: formRegister, // renaming to avoid conflict with your import
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // 3. Handle Form Submission
  const onSubmit = (values: RegisterFormValues) => {
    setError(""); // Clear previous errors
    
    startTransition(async () => {
      // Call your Server Action
      const data = await register({
         ...values,confirmPassword:values.password
      });
      console.log(data)

      if (data?.error) {
        setError(data.error);
      } else {
        // Redirect to login or dashboard on success
        router.push("/sign-in"); 
      }
    });
  };

  return (
    <div className="pt-28 pb-32 px-6 min-h-screen bg-zinc-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-medium text-zinc-900">Create an account</h1>
          <p className="text-zinc-500 text-sm mt-2">
            Start your journey with CFC Academy today.
          </p>
        </div>

        {/* 4. Bind handleSubmit */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Full Name */}
          <div>
            <label className="block text-xs font-medium text-zinc-700 uppercase mb-1">
              Full Name
            </label>
            <input
              {...formRegister("name")}
              disabled={isPending}
              type="text"
              placeholder="John Doe"
              className={`w-full px-4 py-3 bg-zinc-50 border rounded-lg text-sm focus:outline-none focus:ring-1 transition-all ${
                errors.name 
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
                  : "border-zinc-200 focus:border-blue-500 focus:ring-blue-500"
              }`}
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-zinc-700 uppercase mb-1">
              Email
            </label>
            <input
              {...formRegister("email")}
              disabled={isPending}
              type="email"
              placeholder="you@example.com"
              className={`w-full px-4 py-3 bg-zinc-50 border rounded-lg text-sm focus:outline-none focus:ring-1 transition-all ${
                errors.email
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-zinc-200 focus:border-blue-500 focus:ring-blue-500"
              }`}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-medium text-zinc-700 uppercase mb-1">
              Password
            </label>
            <input
              {...formRegister("password")}
              disabled={isPending}
              type="password"
              placeholder="••••••••"
              className={`w-full px-4 py-3 bg-zinc-50 border rounded-lg text-sm focus:outline-none focus:ring-1 transition-all ${
                errors.password
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-zinc-200 focus:border-blue-500 focus:ring-blue-500"
              }`}
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Server Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
              </>
            ) : (
              "Create Account"
            )}
          </Button>

          <p className="text-xs text-zinc-400 text-center leading-relaxed px-4">
            By joining, you agree to our Terms of Service and Privacy Policy.
          </p>
        </form>

        <div className="mt-8 text-center text-sm text-zinc-500">
          Already have an account?{" "}
          <button
            onClick={() => router.push("/sign-in")}
            className="text-zinc-900 font-medium hover:underline"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;