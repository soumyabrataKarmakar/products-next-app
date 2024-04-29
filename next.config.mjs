/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // Image host config setup to give access the host to the application
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fakestoreapi.com',
        port: '',
        pathname: '/img/**',
      },
    ],
  },
};

export default nextConfig;
