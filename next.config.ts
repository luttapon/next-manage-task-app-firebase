import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzYXF3a3RwdHVreWN5aHplY2hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyOTgyNzksImV4cCI6MjA3NDg3NDI3OX0.o3yydUrTucNigq3z_L5ic0OrzbWOojShohh4Z5rSi_Y',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
