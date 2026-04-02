/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/chiangmai/cmflood',
        permanent: true,
      },
      {
        source: '/floodmap',
        destination: '/chiangmai/cmflood/floodmap',
        permanent: true,
      },
      {
        source: '/floodmap2557',
        destination: '/chiangmai/cmflood/floodmap2557',
        permanent: true,
      },
      {
        source: '/pole2025',
        destination: '/chiangmai/cmflood/pole2025',
        permanent: true,
      },
      {
        source: '/floodmark',
        destination: '/chiangmai/cmflood/floodmark',
        permanent: true,
      },
      {
        source: '/flooddepth',
        destination: '/chiangmai/cmflood/flooddepth',
        permanent: true,
      },
      {
        source: '/floodInterpolation',
        destination: '/chiangmai/cmflood/floodInterpolation',
        permanent: true,
      },
      {
        source: '/floodforecast',
        destination: '/chiangmai/cmflood/floodforecast',
        permanent: true,
      },
      {
        source: '/floodforcast',
        destination: '/chiangmai/cmflood/floodforecast',
        permanent: true,
      },
      {
        source: '/prediction',
        destination: '/chiangmai/cmflood/prediction',
        permanent: true,
      },
      {
        source: '/support',
        destination: '/chiangmai/cmflood/support',
        permanent: true,
      },
      {
        source: '/station/:id',
        destination: '/chiangmai/cmflood/station/:id',
        permanent: true,
      },
      {
        source: '/report/:id',
        destination: '/chiangmai/cmflood/report/:id',
        permanent: true,
      },
      {
        source: '/floodforecast-login',
        destination: '/chiangmai/cmflood/floodforecast-login',
        permanent: true,
      },
      {
        source: '/cmflood',
        destination: '/chiangmai/cmflood',
        permanent: true,
      },
      {
        source: '/cmflood/:path*',
        destination: '/chiangmai/cmflood/:path*',
        permanent: true,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/chiangmai/cmflood',
        destination: '/home',
      },
      {
        source: '/chiangmai/cmflood/floodforecast-login',
        destination: '/floodforecast-login',
      },
      {
        source: '/chiangmai/cmflood/:path*',
        destination: '/:path*',
      },
    ]
  },
}

export default nextConfig
