import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";

export default defineConfig({
  plugins: [react()],
  server: {
    //to use when debuging:
    https: {
      key: fs.readFileSync('./cert/develop.darkube.app-key.pem'),
      cert: fs.readFileSync('./cert/develop.darkube.app.pem'),
    },
    host: "develop.darkube.app",
    allowedHosts: ["pashmak.darkube.app","develop.darkube.app"],

    //to use when deploying
    // host: "0.0.0.0",
    // allowedHosts: ["pashmak.darkube.app"],

    port: 5173,
    cors: true,
  },
});
