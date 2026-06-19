const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["@repo/ui"],
    // Emit a self-contained server for lean Docker images.
    output: "standalone",
    // Trace files from the monorepo root so workspace deps are included.
    outputFileTracingRoot: path.join(__dirname, "../../"),
};

module.exports = nextConfig;
