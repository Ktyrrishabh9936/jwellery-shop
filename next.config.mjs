/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode:false,
  eslint: {
    ignoreDuringBuilds: true,
},
images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "jenii.s3.eu-north-1.amazonaws.com",
    },
    {
      protocol: "https",
      hostname: "res.cloudinary.com",
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
