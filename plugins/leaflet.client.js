import L from 'leaflet'
import 'leaflet-svg-shape-markers';

export default defineNuxtPlugin(nuxtApp => {
  return {
      provide: {
        L
      }
    }
})