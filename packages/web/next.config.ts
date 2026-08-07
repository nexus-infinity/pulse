import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Consume the shared TypeScript source directly (no prebuilt dist required).
  transpilePackages: ["@pulse/shared"],
  // Do not auto-generate AGENTS.md / CLAUDE.md framework boilerplate.
  agentRules: false,
};

export default nextConfig;
