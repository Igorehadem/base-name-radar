/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/mini',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors https://warpcast.com https://*.warpcast.com;",
          },
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL'
          }
        ],
      },
      {
        source: '/mini/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors https://warpcast.com https://*.warpcast.com;",
          },
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL'
          }
        ],
      }
    ];
  },
};

export default nextConfig;
