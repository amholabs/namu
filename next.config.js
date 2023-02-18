/** @type {import('next').NextConfig} */
const withTM = require('next-transpile-modules')(['halo-chip'])
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

const pwa = withPWA({
  nextConfig,
  experimental: {
    // Required:
    appDir: true,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/onboarding/welcome',
        permanent: true,
      },
    ]
  },
})

module.exports = withTM({ ...pwa })
