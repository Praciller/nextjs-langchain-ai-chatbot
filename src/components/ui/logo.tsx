import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  /**
   * Size variant for the logo
   * - sm: 24x24px (for compact spaces)
   * - md: 32x32px (default, for navigation)
   * - lg: 48x48px (for headers)
   * - xl: 64x64px (for hero sections)
   * - 2xl: 96x96px (for large displays)
   */
  size?: "sm" | "md" | "lg" | "xl" | "2xl";

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Whether to show the logo text alongside the image
   */
  showText?: boolean;

  /**
   * Custom text to display (defaults to "เฮลท์ แอนด์ เวลเนส")
   */
  text?: string;

  /**
   * Text size variant (only applies when showText is true)
   */
  textSize?: "sm" | "md" | "lg" | "xl";
}

const sizeMap = {
  sm: 24,
  md: 32,
  lg: 48,
  xl: 64,
  "2xl": 96,
};

const textSizeMap = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-xl",
  xl: "text-2xl",
};

/**
 * Logo Component for Health & Wellness Studio
 *
 * Features:
 * - Multiple size variants for different use cases
 * - Optional text display
 * - Responsive and accessible
 * - Optimized with Next.js Image component
 *
 * @example
 * // Simple logo
 * <Logo size="md" />
 *
 * @example
 * // Logo with text
 * <Logo size="lg" showText textSize="lg" />
 *
 * @example
 * // Custom styling
 * <Logo size="xl" className="shadow-lg" />
 */
export function Logo({
  size = "md",
  className,
  showText = false,
  text = "เฮลท์ แอนด์ เวลเนส",
  textSize = "md",
}: LogoProps) {
  const dimension = sizeMap[size];

  return (
    <div
      className={cn("flex items-center gap-2", className)}
      data-testid="logo-container"
    >
      <div className="relative flex-shrink-0" data-testid="logo-image">
        <Image
          src="/logo.svg"
          alt="Health & Wellness Studio Logo"
          width={dimension}
          height={dimension}
          priority
          className="object-contain"
        />
      </div>

      {showText && (
        <span
          className={cn(
            "font-bold text-slate-900 dark:text-white whitespace-nowrap",
            textSizeMap[textSize]
          )}
          data-testid="logo-text"
        >
          {text}
        </span>
      )}
    </div>
  );
}

/**
 * Compact Logo Component (Logo + Text in one line)
 * Useful for navigation bars and headers
 */
export function LogoWithText({
  size = "md",
  textSize = "md",
  className,
}: Omit<LogoProps, "showText" | "text">) {
  return (
    <Logo size={size} showText textSize={textSize} className={className} />
  );
}

/**
 * Logo Icon Only (No Text)
 * Useful for compact spaces like mobile menus
 */
export function LogoIcon({
  size = "md",
  className,
}: Omit<LogoProps, "showText" | "text" | "textSize">) {
  return <Logo size={size} className={className} />;
}
