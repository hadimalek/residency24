module.exports = {
  apps: [
    {
      name: "residency24",
      script: ".next/standalone/server.js",
      cwd: "/var/www/residency24",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "0.0.0.0",
      },
      instances: 1,
      autorestart: true,
      max_memory_restart: "512M",
    },
  ],
};
