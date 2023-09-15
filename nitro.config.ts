export default defineNitroConfig({
  storage: {
    'db': {
      driver: 'fs',
      base: './assets/data/db'
    }
  }
})