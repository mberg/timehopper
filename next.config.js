/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  // This is not a Next.js app, but this config helps with Vercel deployment
  // for Create React App projects
  experimental: {
    externalDir: true,
  },
};

module.exports = nextConfig; 