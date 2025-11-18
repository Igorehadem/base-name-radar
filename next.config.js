/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "ALLOWALL"
          },
          {
            key: "Content-Security-Policy",
            // разрешаем фрейминг со стороны фаркастера
            value: "frame-ancestors https://*.farcaster.xyz https://*.warpcast.com *"
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;
