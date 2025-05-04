/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    serverActions: true,
  },
  // Disable the development mode indicator
  devIndicators: {
    buildActivity: false,
    buildActivityPosition: 'bottom-right',
  },
  // Enable proper error handling
  onError: (err) => {
    console.error('Next.js error:', err);
  },
  // Enable proper page reloading
  webpack: (config, { dev, isServer }) => {
    // Add proper error handling
    config.infrastructureLogging = {
      level: 'error',
    };
    return config;
  },
}

module.exports = nextConfig 