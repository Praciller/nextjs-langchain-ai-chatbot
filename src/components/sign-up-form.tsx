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
import { Logo } from "@/components/ui/logo";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      setIsLoading(false);

      toast({
        title: "รหัสผ่านไม่ตรงกัน ❌",
        description: "กรุณาตรวจสอบรหัสผ่านและยืนยันรหัสผ่านให้ตรงกัน",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/chat`,
          data: {
            display_name: displayName,
            phone: phone,
          },
        },
      });
      if (error) throw error;

      toast({
        title: "ลงทะเบียนสำเร็จ! 🎉",
        description: "กรุณาตรวจสอบอีเมลเพื่อยืนยันบัญชีของคุณ",
      });

      router.push("/auth/login");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "เกิดข้อผิดพลาด";
      setError(errorMessage);

      toast({
        title: "ลงทะเบียนไม่สำเร็จ ❌",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card data-testid="signup-card">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Logo size="xl" />
          </div>
          <CardTitle className="text-2xl" data-testid="signup-title">
            ลงทะเบียน
          </CardTitle>
          <CardDescription data-testid="signup-description">
            สร้างบัญชีใหม่เพื่อเข้าใช้งานระบบ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} data-testid="signup-form">
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="displayName">ชื่อที่แสดง</Label>
                <Input
                  id="displayName"
                  type="text"
                  placeholder="ชื่อของคุณ"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  data-testid="signup-displayname-input"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="0xx-xxx-xxxx"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  data-testid="signup-phone-input"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">อีเมล</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  data-testid="signup-email-input"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">รหัสผ่าน</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="รหัสผ่านของคุณ"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  data-testid="signup-password-input"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="repeat-password">ยืนยันรหัสผ่าน</Label>
                </div>
                <Input
                  id="repeat-password"
                  type="password"
                  placeholder="ยืนยันรหัสผ่านอีกครั้ง"
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  data-testid="signup-repeat-password-input"
                />
              </div>
              {error && (
                <p
                  className="text-sm text-red-500"
                  data-testid="signup-error-message"
                >
                  {error}
                </p>
              )}
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
                data-testid="signup-submit-button"
              >
                {isLoading ? "กำลังสร้างบัญชี..." : "ลงทะเบียน"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              มีบัญชีอยู่แล้ว?{" "}
              <Link
                href="/auth/login"
                className="underline underline-offset-4"
                data-testid="login-link"
              >
                เข้าสู่ระบบ
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
