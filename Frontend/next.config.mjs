/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/backend/:path*",
        destination: `http://backend:8080/:path*`,
      },
    ];
  },
};

export default nextConfig;
