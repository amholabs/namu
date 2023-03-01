/** @type {import('next').NextConfig} */
// const withTM = require('next-transpile-modules')(['halo-chip', 'fs'])
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  cacheOnFrontEndNav: false,
  register: false,
})

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['halo-chip', 'fs'],
  env: {
    mode: process.env.NODE_ENV,
    NEXT_PUBLIC_MODE: true,
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        bufferutil: require.resolve('bufferutil'),
        net: require.resolve('net'),
        request: require.resolve('request'),
        tls: require.resolve('tls'),
        'utf-8-validate': require.resolve('utf-8-validate'),
      }
    }
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
  ...nextConfig,
  experimental: {
    appDir: true,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/profile',
        permanent: true,
      },
    ]
  },
})

module.exports = pwa
