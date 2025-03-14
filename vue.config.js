const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === "production" ? "/resume-builder/" : "/", // Apply only in production
  devServer: {
    allowedHosts: "all",
    host: "0.0.0.0",
    port: 8082,
  }
});