/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: [
      'lh3.googleusercontent.com', 
      'avatars.githubusercontent.com', 
      'avatar.vercel.sh',
      'firebasestorage.googleapis.com',
      'storage.googleapis.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  devIndicators: {
    position: 'bottom-right'
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