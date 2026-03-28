module.exports = {
  apps: [
    {
      name: "residency24",
      script: "node_modules/.bin/next",
      args: "start -p 3000",
      cwd: "/var/www/residency24",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      instances: 1,
      autorestart: true,
      max_memory_restart: "512M",
    },
  ],
};
