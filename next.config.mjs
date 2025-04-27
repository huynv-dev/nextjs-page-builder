/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Các cấu hình khác của bạn ở đây
  images: {
    domains: ['via.placeholder.com', 'images.unsplash.com'],
    formats: ['image/avif', 'image/webp'],
  }
}

export default nextConfig;
