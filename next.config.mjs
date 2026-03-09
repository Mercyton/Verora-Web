/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  experimental: {
    optimizeCss: true,
  },
  async rewrites() {
    return [
      // Example proxy rewrite - adjust as needed
      // {
      //   source: '/api/:path*',
      //   destination: 'https://your-api-endpoint.com/:path*',
      // },
    ];
  },
};

export default nextConfig;
