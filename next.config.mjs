/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  // /prompts 목록 페이지가 생기기 전까지는 홈으로 보내요
  async redirects() {
    return [{ source: "/prompts", destination: "/", permanent: false }];
  },
  experimental: {
    agentFeedback: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
