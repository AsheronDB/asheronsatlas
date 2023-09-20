import { useRuntimeConfig } from "#app";

export default {
  async getLocations(zoom: number, bbox) {
    return new Promise(async (resolve, reject) => {
      try {
        console.log("get locations");

        const API_BASE_URL = useRuntimeConfig().public.apiBaseUrl;

        const searchParams = new URLSearchParams({ zoom: zoom, bbox: bbox });

        let locationsResponse = await fetch(
          `/api/locations?${searchParams.toString()}`
        );

        const locationsData = await locationsResponse.json();
        this.locations = locationsData;

        resolve();
      } catch (error) {
        console.error(error);
        reject();
      }
    });
  },

  async reverseGeocode(point) {
    console.log("reverse geocode action");

    return new Promise(async (resolve, reject) => {
      try {
        const searchParams = new URLSearchParams({ point: point });

        let response = await fetch(
          `/api/geocode/reverse?${searchParams.toString()}`
        );

        const data = await response.text();

        console.log(data);
        this.targetedReverseGeocode = data;
        resolve();
      } catch (error) {
        console.error(error);
        reject();
      }
    });
  },
};
