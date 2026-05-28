/** @type {import('next').NextConfig} */
const nextConfig = {
  // docusign-esign uses AMD module format incompatible with Turbopack — load via Node require() instead
  serverExternalPackages: ['docusign-esign'],
};

export default nextConfig;
