"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Github, Globe, Loader2 } from "lucide-react";

// Import the actions we created above
import { login, loginWithOAuth } from "@/server/auth/actions/login.action";

// 1. Validation Schema
const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof LoginSchema>;

const Page = () => {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  // 2. Setup Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 3. Handle Credentials Submit
  const onSubmit = (values: LoginFormValues) => {
    setError("");
    startTransition(async () => {
      const data = await login(values);
      // If we get data back, it implies an error (since success redirects)
      if (data?.error) {
        setError(data.error);
      }
    });
  };

  // 4. Handle Google Login
  const handleGoogleLogin = () => {
    // We can call the server action directly here
    startTransition(() => {
      loginWithOAuth("google");
    });
  };

  return (
    <div className="pt-28 pb-32 px-6 min-h-screen bg-zinc-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-medium text-zinc-900">Welcome back</h1>
          <p className="text-zinc-500 text-sm mt-2">
            Sign in to your account to continue
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-xs font-medium text-zinc-700 uppercase mb-1">
              Email
            </label>
            <input
              {...register("email")}
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

          {/* Password Field */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-medium text-zinc-700 uppercase">
                Password
              </label>
              <a
                href="/auth/reset"
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Forgot?
              </a>
            </div>
            <input
              {...register("password")}
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
              <p className="text-xs text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <Button disabled={isPending} type="submit" className="w-full">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-zinc-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-zinc-400">Or continue with</span>
          </div>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-1 gap-4">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
          >
            <Globe size={16} /> Google
          </button>
        </div>

        <div className="mt-8 text-center text-sm text-zinc-500">
          Don't have an account?{" "}
          <button
            onClick={() => router.push("/sign-up")}
            className="text-zinc-900 font-medium hover:underline"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;