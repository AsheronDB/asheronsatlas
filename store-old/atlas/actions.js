


export default {
  async searchLocations(searchQuery) {
    return new Promise(async (resolve, reject) => {
      console.log("SEARCH LOCATIONS ACTION");
      try {

        const searchParams = new URLSearchParams({ q: searchQuery });

        let searchResults = await fetch(
          `${this.apiUrlBase}/search?${searchParams.toString()}`
        );

        const searchResultsData = await searchResults.json();
        this.searchResults = searchResultsData;
        resolve();
      } catch (error) {
        console.error(error);
        reject();
      }
    });
  },
  async reverseGeocode(point) {
    console.log('reverse geocode action');

    return new Promise(async (resolve, reject) => {
      try {

        const searchParams = new URLSearchParams({ point: point });

        let response = await fetch(
          `${this.apiUrlBase}/geocode/reverse?${searchParams.toString()}`
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
  async getLocation(locationId) {
    return new Promise(async (resolve, reject) => {
      console.log("getLocation action");
      try {
        const response = await fetch(
          `${this.apiUrlBase}/locations/${locationId}`
        );

        const data = await response.json();

        this.searchQuery = data.properties.name;
        this.selectedLocation = data;
        resolve();
      } catch (error) {
        console.error(error);
        reject();
      }
    });
  },

  async getLocations(zoom, bbox) {
    return new Promise(async (resolve, reject) => {
      try { 

        console.log('get locations');

        console.log(this.apiUrlBase);
        const searchParams = new URLSearchParams({ zoom: zoom, bbox: bbox });

        let locationsResponse = await fetch(
          `${this.apiUrlBase}/locations?${searchParams.toString()}`
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
  //   async fetchLocations() {
  //     try {
  //       let apiUrl = `${ACDB_API_URL}/locations`;
  //       console.log(apiUrl, "API URL");
  //       let locationsResponse = await fetch(apiUrl);

  //       const locationsData = await locationsResponse.json();

  //       console.log(locationsData);

  //       //   return false;

  //       let locations = locationsData.features.map((location) => {
  //         let zoom = {};

  //         let category = location.properties.category;
  //         let subCategory = location.properties.sub_type;

  //         if (category == "lifestone") {
  //           zoom = {
  //             min: 5,
  //             max: DERETH_MAP_MAX_ZOOM,
  //           };
  //         } else if (category == "dungeon") {
  //           zoom = {
  //             min: 4,
  //             max: DERETH_MAP_MAX_ZOOM,
  //           };
  //         } else if (category == "vendor" || category == "npc") {
  //           zoom = {
  //             min: 6,
  //             max: DERETH_MAP_MAX_ZOOM,
  //           };
  //         } else if (category == "portal") {
  //           zoom = {
  //             min: 5,
  //             max: DERETH_MAP_MAX_ZOOM,
  //           };
  //         } else if (category == "house") {
  //           if (subCategory == "mansion" || !location.properties.settlement) {
  //             zoom = {
  //               min: 4,
  //               max: DERETH_MAP_MAX_ZOOM,
  //             };
  //           } else if (subCategory == "cottage" || subCategory == "villa") {
  //             zoom = {
  //               min: 8,
  //               max: DERETH_MAP_MAX_ZOOM,
  //             };
  //           }
  //         } else if (category == "settlement") {
  //           zoom = {
  //             min: 4,
  //             max: 7,
  //           };
  //         } else {
  //           zoom = {
  //             min: DERETH_MAP_MIN_ZOOM,
  //             max: DERETH_MAP_MAX_ZOOM,
  //           };
  //         }

  //         location.properties.zoom = zoom;
  //         location.properties.slug = slugify(location.properties.name, {
  //           remove: /[*+~.()'"!:@]/g,
  //         });

  //         let [x, y] = location.geometry.coordinates;

  //         let xFormatted =
  //           x >= 0 ? Math.abs(x).toFixed(1) + "N" : Math.abs(x).toFixed(1) + "S";
  //         let yFormatted =
  //           y >= 0 ? Math.abs(y).toFixed(1) + "E" : Math.abs(y).toFixed(1) + "W";

  //         if (location.properties.drop) {
  //           location.properties.drop.coordinates = worldToCompassCoords(
  //             location.properties.drop.coordinates
  //           );
  //         }

  //         location.properties.coordinatesFormatted = [xFormatted, yFormatted];

  //         return location;
  //       });

  //       let collection = turf.featureCollection(locations);

  //       turf.coordEach(collection, (currentCoord) => {
  //         let newCoords = currentCoord;
  //         let [xMap, yMap] = newCoords;

  //         currentCoord.length = 0;
  //         currentCoord[0] = yMap;
  //         currentCoord[1] = xMap;
  //       });

  //       this.$patch({ locations: locations });
  //     } catch (error) {
  //       console.log("fetch error");
  //       console.log(error);
  //     }
  //   },
};
