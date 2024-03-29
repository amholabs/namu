/** @type {import('next').NextConfig} */
// const withTM = require('next-transpile-modules')(['halo-chip', 'fs'])
const runtimeCaching = require('next-pwa/cache')
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: true,
  cacheOnFrontEndNav: false,
  register: false,
})

const nextConfig = {
  runtimeCaching,
  reactStrictMode: true,
  buildExcludes: [/app-build-manifest.json$/],
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
        destination: '/profile/',
        permanent: false,
      },
    ]
  },
})

module.exports = pwa
