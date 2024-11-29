/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'th.bing.com',
          port: '', // Leave empty for default port
          pathname: '/**', // Allow all paths
        },
        {
          protocol: 'https',
          hostname: 'gateway.pinata.cloud',
          port: '', // Leave empty for default port
          pathname: '/**', // Allow all paths
        },
      ],
    },
    reactStrictMode: false,
  };
  
export default nextConfig;
