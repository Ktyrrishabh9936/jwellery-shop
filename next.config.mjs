/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode:false,
  eslint: {
    ignoreDuringBuilds: true,
},
images: {
  unoptimized: true,
  remotePatterns: [
    {
      protocol: "https",
      hostname: "jenii.s3.eu-north-1.amazonaws.com",
    },
    {
      protocol: "https",
      hostname: "jenii-storage.s3.ap-south-1.amazonaws.com",
    },
    {
      protocol: "https",
      hostname: "res.cloudinary.com",
    },
    {
      protocol: 'https',
      hostname: 'jenii-storage.s3-accelerate.amazonaws.com',
      pathname: '/products/**',
    },
    {
      protocol: 'https',
      hostname: 'jenii-storage.s3-accelerate.amazonaws.com',
      pathname: '/category/**',
    },
    {
      protocol: 'https',
      hostname: 'lh3.googleusercontent.com',
    },
    {
      protocol: 'https',
      hostname: 'i.pinimg.com',
    },
  ],
},
        webpack(config) {
          config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
          });
          return config;
        },
      };

export default nextConfig;
