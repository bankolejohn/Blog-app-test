import type { NextConfig } from "next";

function buildCsp(): string {
  const isDev = process.env.NODE_ENV !== "production";
  const directives: string[] = [];
  directives.push("default-src 'self'");
  directives.push("base-uri 'self'");
  directives.push("font-src 'self' data:");
  directives.push("img-src 'self' data: blob: https:");
  directives.push("object-src 'none'");
  const scriptSrc = ["'self'", "'unsafe-inline'"];
  if (isDev) scriptSrc.push("'unsafe-eval'", "'wasm-unsafe-eval'");
  directives.push(`script-src ${scriptSrc.join(" ")}`);
  directives.push("style-src 'self' 'unsafe-inline'");
  const connectSrc = ["'self'"];
  if (isDev) connectSrc.push("ws:", "http://localhost:3000");
  directives.push(`connect-src ${connectSrc.join(" ")}`);
  return directives.join("; ");
}

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Content-Security-Policy", value: buildCsp() },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
