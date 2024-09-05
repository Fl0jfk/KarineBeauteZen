/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
      formats : ['image/webp'],
      remotePatterns: [
          {
              protocol: "https",
              hostname: "**.cdninstagram.com",
              port: "",
          },
          {
              protocol: 'https',
              hostname: 'images.unsplash.com'
          },
          {
              protocol: 'https',
              hostname: 'littlequeenphotography.s3.eu-west-3.amazonaws.com'
          },
          {
              protocol: 'https',
              hostname: 'lh3.googleusercontent.com'
          }
      ]
  }
}

module.exports = nextConfig