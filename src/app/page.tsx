import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { LogoWithText } from "@/components/ui/logo";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "เฮลท์ แอนด์ เวลเนส สตูดิโอ | Wellness AI Assistant",
  description:
    "ผู้ช่วยดิจิทัลสำหรับสปาและเวลเนส พร้อมให้คำแนะนำเกี่ยวกับบริการนวด การดูแลสุขภาพ และความงาม",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-emerald-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Fixed Navigation */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 w-full px-4 py-4 sm:px-6 lg:px-8 bg-white/80 backdrop-blur-md border-b border-slate-200/50 dark:bg-slate-900/80 dark:border-slate-700/50"
        data-testid="main-navigation"
      >
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <LogoWithText size="md" textSize="lg" />
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              asChild
              className="hidden sm:inline-flex"
              data-testid="nav-login-button"
            >
              <Link href="/auth/login">เข้าสู่ระบบ</Link>
            </Button>
            <Button asChild data-testid="nav-signup-button">
              <Link href="/auth/sign-up">ลงทะเบียน</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Background Image */}
      <main className="relative px-4 pt-24 pb-12 sm:px-6 lg:px-8">
        {/* Background Image with Overlay - Wellness/Spa themed */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15 dark:opacity-8"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=2832&q=80')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-50/60 to-green-50 dark:via-slate-900/60 dark:to-slate-900" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="text-center">
            {/* Logo in Hero Section */}
            <div className="flex justify-center mb-8" data-testid="hero-logo">
              <LogoWithText size="xl" textSize="2xl" />
            </div>

            {/* Badge */}
            <Badge
              variant="outline"
              className="inline-flex items-center border-green-200 bg-white/50 px-4 py-2 text-sm text-slate-700 backdrop-blur-sm dark:border-green-800 dark:bg-slate-800/50 dark:text-slate-300 mb-8"
              data-testid="hero-badge"
            >
              <span className="h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
              ขับเคลื่อนด้วย AI สำหรับสปาและเวลเนส
            </Badge>

            {/* Main Heading */}
            <h1
              className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl md:text-6xl lg:text-7xl"
              data-testid="hero-title"
            >
              <span className="block">เฮลท์ แอนด์ เวลเนส</span>
              <span
                className="block bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent"
                data-testid="hero-subtitle"
              >
                สตูดิโอ
              </span>
            </h1>

            {/* Description */}
            <p
              className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300 sm:text-xl"
              data-testid="hero-description"
            >
              ผู้ช่วยดิจิทัลอัจฉริยะสำหรับสปาและเวลเนส
              พร้อมให้คำแนะนำเกี่ยวกับบริการนวด การดูแลสุขภาพ และความงาม
              <br />
              <span className="font-semibold text-green-700 dark:text-green-300">
                จองคิว ปรึกษาบริการ และรับคำแนะนำส่วนบุคคลได้ตลอด 24 ชั่วโมง
              </span>
              <br />
              ประสบการณ์การดูแลสุขภาพและความงามที่ล้ำสมัย ด้วยเทคโนโลยี AI
              ที่เข้าใจความต้องการของคุณ
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
              <Button
                size="lg"
                asChild
                className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold px-8 py-3 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                data-testid="hero-consult-button"
              >
                <Link href="/chat">ปรึกษาผู้ช่วย AI</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="w-full sm:w-auto border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 px-8 py-3 text-lg rounded-lg transition-all duration-200"
                data-testid="hero-login-button"
              >
                <Link href="/auth/login">เข้าสู่ระบบ</Link>
              </Button>
            </div>
          </div>

          {/* Features Section - Streamlined to 3 core features */}
          <div className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <Card
              className="group bg-white/60 backdrop-blur-sm border-slate-200 hover:shadow-lg hover:scale-105 transition-all duration-300 dark:bg-slate-800/60 dark:border-slate-700"
              data-testid="feature-card-1"
            >
              <CardContent className="p-8">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-2xl">💆‍♀️</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  บริการสปาและการนวด
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  บริการนวดแผนไทย นวดอโรมา และทรีทเมนต์ความงาม
                  <br />
                  <span className="text-green-700 dark:text-green-300 font-medium">
                    ผ่อนคลาย ฟื้นฟูร่างกาย
                  </span>
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card
              className="group bg-white/60 backdrop-blur-sm border-slate-200 hover:shadow-lg hover:scale-105 transition-all duration-300 dark:bg-slate-800/60 dark:border-slate-700"
              data-testid="feature-card-2"
            >
              <CardContent className="p-8">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-2xl">📅</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  จองคิวและนัดหมาย
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  จองคิวบริการสปา เลือกเวลาที่สะดวก และรับการยืนยันทันที
                  <br />
                  <span className="text-teal-700 dark:text-teal-300 font-medium">
                    ระบบจองออนไลน์ 24/7
                  </span>
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card
              className="group bg-white/60 backdrop-blur-sm border-slate-200 hover:shadow-lg hover:scale-105 transition-all duration-300 dark:bg-slate-800/60 dark:border-slate-700 sm:col-span-2 lg:col-span-1"
              data-testid="feature-card-3"
            >
              <CardContent className="p-8">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-2xl">🤖</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  ผู้ช่วย AI อัจฉริยะ
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  คำแนะนำการดูแลสุขภาพ ความงาม และการผ่อนคลายตลอด 24 ชั่วโมง
                  <br />
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium">
                    ตอบคำถามและให้คำปรึกษาทันที
                  </span>
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Stats Section */}
          <div
            className="mt-24 rounded-3xl bg-gradient-to-r from-green-600 to-teal-600 p-8 text-center text-white sm:p-12"
            data-testid="stats-gradient-section"
          >
            <h2 className="text-3xl font-bold mb-8 sm:text-4xl">
              ความไว้วางใจจากลูกค้า
            </h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              <div>
                <div className="text-4xl font-bold sm:text-5xl">5K+</div>
                <div className="mt-2 text-green-100">ลูกค้าประจำ</div>
              </div>
              <div>
                <div className="text-4xl font-bold sm:text-5xl">98%</div>
                <div className="mt-2 text-green-100">ความพึงพอใจ</div>
              </div>
              <div>
                <div className="text-4xl font-bold sm:text-5xl">10+</div>
                <div className="mt-2 text-green-100">
                  ปีประสบการณ์ด้านสปาและเวลเนส
                </div>
              </div>
            </div>
            <div className="mt-8 text-lg text-green-100">
              <span className="font-semibold">
                เปิดบริการทุกวัน 9:00-21:00 น. | ทีมผู้เชี่ยวชาญ | มาตรฐานสากล
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-24 border-t border-slate-200 bg-white/50 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <LogoWithText size="md" textSize="lg" />
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              © 2025 เฮลท์ แอนด์ เวลเนส สตูดิโอ. สร้างด้วย ❤️ และ AI
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
