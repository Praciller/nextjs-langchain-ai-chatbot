"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Create Supabase client inside try block for better error handling
      const supabase = createClient();

      // Set a timeout to prevent indefinite waiting
      const loginPromise = supabase.auth.signInWithPassword({
        email,
        password,
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Login timeout - please try again")),
          10000
        )
      );

      // Race between login and timeout
      const { error } = (await Promise.race([
        loginPromise,
        timeoutPromise,
      ])) as any;

      if (error) throw error;

      // Show success toast
      toast({
        title: "เข้าสู่ระบบสำเร็จ! 🎉",
        description: "ยินดีต้อนรับกลับ! กำลังเข้าสู่ระบบ...",
      });

      // Use router.replace for faster navigation without adding to history
      router.replace("/chat");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      setError(errorMessage);

      // Show error toast
      toast({
        title: "เข้าสู่ระบบไม่สำเร็จ ❌",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // เพิ่มการจัดการ autoComplete ใน handleSubmit
  const handleFillDemo = () => {
    setEmail("user@demo.com");
    setPassword("demo123");
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card data-testid="login-card">
        <CardHeader>
          <CardTitle className="text-2xl" data-testid="login-title">
            เข้าสู่ระบบ
          </CardTitle>
          <CardDescription data-testid="login-description">
            เข้าสู่ระบบเพื่อจองคิวและใช้บริการสปาของเรา
          </CardDescription>
          <div
            className="mt-2 px-4 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 p-2 rounded-lg border border-emerald-200 dark:border-emerald-800"
            data-testid="demo-credentials-section"
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="text-sm text-emerald-800 dark:text-emerald-200"
                  data-testid="demo-email-text"
                >
                  Email: user@demo.com
                </p>
                <p
                  className="text-sm text-emerald-800 dark:text-emerald-200"
                  data-testid="demo-password-text"
                >
                  Password: demo123
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleFillDemo}
                className="ml-2 bg-white hover:bg-emerald-50 dark:bg-emerald-900/50 dark:hover:bg-emerald-800/50 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300"
                data-testid="auto-fill-button"
              >
                Auto Fill
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} data-testid="login-form">
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  tabIndex={1}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  data-testid="login-email-input"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/auth/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    data-testid="forgot-password-link"
                  >
                    ลืมรหัสผ่าน?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  tabIndex={2}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  data-testid="login-password-input"
                />
              </div>
              {error && (
                <p
                  className="text-sm text-red-500"
                  data-testid="login-error-message"
                >
                  {error}
                </p>
              )}
              <Button
                type="submit"
                tabIndex={3}
                className="w-full relative"
                disabled={isLoading}
                data-testid="login-submit-button"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    กำลังเข้าสู่ระบบ...
                  </span>
                ) : (
                  "เข้าสู่ระบบ"
                )}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/sign-up"
                className="underline underline-offset-4"
                data-testid="signup-link"
              >
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
