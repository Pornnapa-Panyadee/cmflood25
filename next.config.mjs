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
        destination: '/cmflood',
        permanent: true,
      },
      {
        source: '/floodmap',
        destination: '/cmflood/floodmap',
        permanent: true,
      },
      {
        source: '/floodmap2557',
        destination: '/cmflood/floodmap2557',
        permanent: true,
      },
      {
        source: '/pole2025',
        destination: '/cmflood/pole2025',
        permanent: true,
      },
      {
        source: '/floodmark',
        destination: '/cmflood/floodmark',
        permanent: true,
      },
      {
        source: '/flooddepth',
        destination: '/cmflood/flooddepth',
        permanent: true,
      },
      {
        source: '/floodInterpolation',
        destination: '/cmflood/floodInterpolation',
        permanent: true,
      },
      {
        source: '/floodforecast',
        destination: '/cmflood/floodforecast',
        permanent: true,
      },
      {
        source: '/floodforcast',
        destination: '/cmflood/floodforecast',
        permanent: true,
      },
      {
        source: '/prediction',
        destination: '/cmflood/prediction',
        permanent: true,
      },
      {
        source: '/support',
        destination: '/cmflood/support',
        permanent: true,
      },
      {
        source: '/station/:id',
        destination: '/cmflood/station/:id',
        permanent: true,
      },
      {
        source: '/report/:id',
        destination: '/cmflood/report/:id',
        permanent: true,
      },
      {
        source: '/floodforecast-login',
        destination: '/cmflood/floodforecast-login',
        permanent: true,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/cmflood',
        destination: '/home',
      },
      {
        source: '/cmflood/floodforecast-login',
        destination: '/floodforecast-login',
      },
      {
        source: '/cmflood/:path*',
        destination: '/:path*',
      },
    ]
  },
}

export default nextConfig
