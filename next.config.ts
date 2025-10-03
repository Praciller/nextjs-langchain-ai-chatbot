import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ============================================================================
  // PERFORMANCE OPTIMIZATIONS
  // ============================================================================

  // Note: swcMinify is enabled by default in Next.js 13+, no need to specify

  // Optimize compilation and bundling
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === "production",
  },

  // ============================================================================
  // MODULE OPTIMIZATION
  // ============================================================================

  // Externalize large server-side packages to reduce bundle size
  serverExternalPackages: [
    "langchain",
    "@langchain/core",
    "@langchain/community",
    "@langchain/openai",
    "pdf-parse",
    "pg",
    "shiki",
  ],

  // Optimize package imports to reduce bundle size
  modularizeImports: {
    "lucide-react": {
      transform: "lucide-react/dist/esm/icons/{{member}}",
    },
  },

  // ============================================================================
  // IMAGE OPTIMIZATION
  // ============================================================================

  images: {
    // Enable image optimization
    formats: ["image/webp", "image/avif"],
    // Add external image domains if needed
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },

  // ============================================================================
  // DEVELOPMENT OPTIMIZATIONS
  // ============================================================================

  // Reduce memory usage during development
  experimental: {
    // Optimize memory usage
    optimizePackageImports: [
      "@radix-ui/react-avatar",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-label",
      "@radix-ui/react-popover",
      "@radix-ui/react-separator",
      "@radix-ui/react-slot",
      "@radix-ui/react-toast",
      "@radix-ui/react-tooltip",
    ],
  },

  // ============================================================================
  // WEBPACK OPTIMIZATIONS (if needed)
  // ============================================================================

  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Exclude server-only modules from client bundle
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    return config;
  },

  // ============================================================================
  // STATIC FILE OPTIMIZATION
  // ============================================================================

  // Ensure static files are served efficiently
  async headers() {
    return [
      {
        source: "/favicon.ico",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/logo.svg",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
