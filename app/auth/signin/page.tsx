"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
  
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
  
      if (result?.error) {
        setError("Invalid credentials");
      } else {
        const res = await fetch("/api/user");
        const user = await res.json();
  
        if (user?.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (error) {
      console.error(error)
      setError("An error occurred during sign in");
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Gradient background */}
      <div className="fixed inset-0 -z-10 min-h-screen">
        <div className="absolute inset-0 h-full bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.03),transparent_50%)]" />
        <div className="absolute inset-0 h-full bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.04),transparent_70%)]" />
      </div>

      {/* CIRA Branding Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
            <svg 
              className="h-6 w-6 text-white" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            CIRA
          </h1>
        </div>
        <p className="mt-2 text-sm text-neutral-400">
          Campus Incident Reporting Application
        </p>
      </div>

      {/* Login Form */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-neutral-900/50 backdrop-blur-sm py-8 px-4 shadow-xl border border-neutral-800 rounded-xl sm:px-10">
          <h2 className="text-center text-xl font-medium text-blue-500 mb-6">
            Sign In to Your Account
          </h2>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-300">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-neutral-800 rounded-lg bg-neutral-900 placeholder-neutral-500 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/20"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-300">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-neutral-800 rounded-lg bg-neutral-900 placeholder-neutral-500 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/20"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Sign In"
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-neutral-400">Don&apos;t have an account?</span>{" "}
            <Link href="/auth/signup" className="text-blue-500 hover:text-blue-400 font-medium">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}