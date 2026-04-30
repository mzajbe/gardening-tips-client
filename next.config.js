
// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
// };

// module.exports = {
//   nextConfig,
//   experimental: {
//     missingSuspenseWithCSRBailout: false,
//   },
// };

/** @type {import('next').NextConfig} */
const baseApi =
  process.env.NEXT_PUBLIC_BASE_API ||
  "https://gardening-server.vercel.app/api/v1";

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
