// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
    },
  },
  ui: {
    icons: ["heroicons", "fa6-brands", "fa6-regular", "fa6-solid"],
  },
  devtools: { enabled: false },
  runtimeConfig: {
    public: {
      apiBaseUrl: "/api",
    },
  },
  colorMode: {
    preference: "light",
  },
  tailwindcss: {
    exposeConfig: true,
  },
  css: ["@/assets/css/main.css"],
  modules: ["@nuxt/ui", "@pinia/nuxt"],
  build: {
    postcss: {
      postcssOptions: {
        plugins: {
          tailwindcss: {},
          autoprefixer: {},
        },
      },
    },
  },
});
