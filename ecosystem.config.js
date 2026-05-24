// PM2 config — APP_DIR overrides the default path for non-/var/www installs
// (e.g. CloudPanel/Plesk layouts under ~/htdocs/<domain>/<repo>)
const path = require("path");
const APP_DIR = process.env.APP_DIR || path.resolve(__dirname);
const PORT = process.env.PORT || 3000;

module.exports = {
  apps: [
    {
      name: "residency24",
      script: ".next/standalone/server.js",
      cwd: APP_DIR,
      env: {
        NODE_ENV: "production",
        PORT,
        HOSTNAME: "0.0.0.0",
        // Absolute path so uploads survive rebuilds regardless of process.cwd().
        UPLOAD_PERSIST_DIR: path.join(APP_DIR, "data"),
      },
      instances: 1,
      autorestart: true,
      max_memory_restart: "512M",
    },
  ],
};
