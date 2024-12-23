/** @type {import('next').NextConfig} */
const withPWA = require("@ducanh2912/next-pwa").default({
  dest : "public",
  cacheOnFrontEndNav : true,
  aggressiveFrontEndNavCaching : true,
  reloadOnOnline : true,
  swcMinify : true,
  disable : false
});
const nextConfig = {
  reactStrictMode: false,
    typescript : {
      ignoreBuildErrors : true,
    },
    experimental: {
      serverActions: true,
      serverComponentsExternalPackages: ["mongoose"],
    },
    eslint: {
      // Warning: This allows production builds to successfully complete even if
      // your project has ESLint errors.
      ignoreDuringBuilds: true,
    },
    images: {
      domains: ['utfs.io'],
      remotePatterns: [
        {
          protocol: "https",
          hostname: "img.clerk.com",
        },
        {
          protocol: "https",
          hostname: "images.clerk.dev",
        },
        {
          protocol: "https",
          hostname: "uploadthing.com",
        },
        {
          protocol: "https",
          hostname: "placehold.co",
        },
      ],
    },
    webpack(config, { isServer }) {
      if (!isServer) {
      config.ignoreWarnings = [
        {
          message: /Only plain objects can be passed to Client Components/, // Suppress specific warning
        },
      ];
    }
      return config;
    },
  };
  
module.exports =  withPWA(nextConfig);