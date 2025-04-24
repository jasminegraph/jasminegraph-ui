/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: "/backend/:path*",
        destination: `http://10.10.4.109:8080/:path*`,
      },
    ];
  },
};

export default nextConfig;
