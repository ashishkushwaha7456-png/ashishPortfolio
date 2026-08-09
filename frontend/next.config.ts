import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  staticPageGenerationTimeout: 300,

  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 480, 640, 828, 1080, 1200, 1440, 1920, 2560],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "utfs.io" },
      { protocol: "https", hostname: "i.scdn.co" },
    ],
  },

  experimental: {
    workerThreads: false,
    cpus: 1,
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "recharts",
      "date-fns",
    ],
  },

  serverExternalPackages: ["mongoose", "bcryptjs", "cloudinary", "nodemailer"],

  typescript: {
    /**
     * Type checking runs in-process during `next build` and needs ~4GB of heap.
     * That's fine on CI and on Vercel, and fine locally with
     * `NODE_OPTIONS=--max-old-space-size=4096`.
     *
     * On a very memory-constrained machine, set SKIP_TYPE_CHECK=1 to build
     * without it and verify separately with `npm run typecheck`. Unset by
     * default, so types are always enforced before a deploy.
     */
    ignoreBuildErrors: process.env.SKIP_TYPE_CHECK === "1",
  },

  eslint: {
    ignoreDuringBuilds: process.env.SKIP_LINT === "1",
  },

  async headers() {
    return [
      { source: "/(.*)", headers: securityHeaders },
      {
        source: "/fonts/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      { source: "/admin", destination: "/admin/dashboard", permanent: false },
      { source: "/home", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
