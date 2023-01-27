/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  cacheOnFrontEndNav: false,
})

const nextConfig = {
  reactStrictMode: true,
  env: {
    mode: process.env.NODE_ENV,
    NEXT_PUBLIC_MODE: true,
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) => {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      resourceQuery: /icon/,
      use: ['@svgr/webpack'],
    })
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      resourceQuery: { not: [/icon/] },
      loader: 'next-image-loader',
      options: { assetPrefix: '' },
    })
    return config
  },
}

module.exports = withPWA({
  nextConfig,
  experimental: {
    // Required:
    appDir: true,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/onboarding/congratulations',
        permanent: true,
      },
    ]
  },
})
