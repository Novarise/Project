/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['novarise-billboards-upload.s3.amazonaws.com'],
    },
    webpack: (config, options) => {
        config.devtool = false; // Disable source maps
        return config;
      },
      async rewrites() {
        return [
          {
            source: '/:path*',
            destination: '/:path*.js',
          },
        ];
      },
	output: "standalone",
}

module.exports = nextConfig
