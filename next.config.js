/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        tls: false,
        fs: false,
        dns: false,
        child_process: false,
        dgram: false,
        'timers/promises': false,
        timers: false, 
        stream: false,
        http: false, 
        https: false, 
        zlib: false, 
        path: false,
        
        'async_hooks': false,
        'node:async_hooks': false,
        'node:fs': false,
        'node:path': false,
        'node:process': false,
        'node:http': false,
        'node:buffer': false,
        'node:util': false,
        'node:url': false,
        'node:net': false,
        'node:tls': false,
        'node:crypto': false,
        'node:stream': false,
        'node:zlib': false
      };
    }
    return config;
  },
};

module.exports = nextConfig;