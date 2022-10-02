/** @type {import('next').NextConfig} */

//see details of next js security haeaders
//https://nextjs.org/docs/advanced-features/security-headers

const contentSecurityPolicy = `
 default-src 'self';
 script-src 'self' 'unsafe-eval';
 connect-src 'self' wss://${process.env.NEXT_PUBLIC_MQTT_HOST}:${process.env.NEXT_PUBLIC_MQTT_PORT}/mqtt;
 img-src 'self' data:;
 style-src 'self' 'unsafe-inline';
 style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com;
 font-src 'self' httsp://fonts.gstatic.com https://fonts.googleapis.com; 
 worker-src 'self' blob:;
`;

const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomain; preload",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin",
  },
  {
    key: "Content-Security-Policy",
    value: contentSecurityPolicy.replace(/\s{2,}/g, " ").trim(),
  },
];

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;
