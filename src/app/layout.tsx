import type { Metadata } from "next";
import { Anuphan, Inter } from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css";
import { EnhancedThemeProvider } from "@/lib/enhanced-theme-provider";
import { Toaster } from "@/components/ui/toaster";

const anuphan = Anuphan({
  variable: "--font-anuphan",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "เฮลท์ แอนด์ เวลเนส สตูดิโอ | Wellness AI Assistant",
  description:
    "เดโมแชตแบบ Mock-first สำหรับสาธิตการสนทนาเกี่ยวกับสปาและเวลเนส โดยไม่ต้องใช้คีย์ API",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${anuphan.variable} ${inter.variable}`}>
        <EnhancedThemeProvider
          defaultMode="system"
          defaultColorTheme="green"
          storageKey="ai-chatbot-theme-mode"
          colorStorageKey="ai-chatbot-theme-color"
        >
          {children}
          <Toaster />
        </EnhancedThemeProvider>
      </body>
    </html>
  );
}
