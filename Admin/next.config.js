/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
        domains: ['novarise-billboards-upload.s3.amazonaws.com'],
    },
    async headers() {
        return [
            {
                // Matching all API routes
                source: "/api/:path*", // Use a wildcard route pattern
                headers: [
                    { key: "Access-Control-Allow-Credentials", value: "true" },
                    { key: "Access-Control-Allow-Origin", value: "*" },
                    { key: "Access-Control-Allow-Methods", value: "POST,GET,OPTIONS,PATCH,DELETE,PUT" },
                    {
                      key: "Access-Control-Allow-Headers",
                      value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
                    },
                  ],
            }
        ]
    },
    output: "standalone",
    experimental: { missingSuspenseWithCSRBailout: false},
};




module.exports = nextConfig

