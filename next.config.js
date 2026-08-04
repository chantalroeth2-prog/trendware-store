/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      // E-Commerce Produktbilder (echte Produkte)
      { protocol: "https", hostname: "ae01.alicdn.com" },
      { protocol: "https", hostname: "**.alicdn.com" },
      { protocol: "https", hostname: "m.media-amazon.com" },
      { protocol: "https", hostname: "**.media-amazon.com" },
      { protocol: "https", hostname: "**.aliexpress.com" },
      { protocol: "https", hostname: "i.ebayimg.com" },
      { protocol: "https", hostname: "**.ebayimg.com" },
      // Google Shopping Thumbnails
      { protocol: "https", hostname: "encrypted-tbn*.gstatic.com" },
      { protocol: "https", hostname: "**.gstatic.com" },
    ],
  },
};

module.exports = nextConfig;
