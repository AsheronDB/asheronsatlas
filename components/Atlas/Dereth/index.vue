<template>
  <div id="dereth-map">
     <div id="map-container" ref="mapContainer"></div>
  </div>
</template>

<script setup>

import * as turf from "@turf/turf";
import { orderBy, debounce } from "lodash-es";

// import { mapActions, mapGetters } from "vuex";

// Data (migrate to vuex?)
import regions from "@/assets/data/regions.json";
import routeTest from "@/assets/data/route.json";

// import labelgun from "labelgun";

// import * as dateFns from "date-fns";

// import ButtonRadio from "@/components/ButtonRadio";

// Libs

// import RBush from "rbush";
// import polylabel from "polylabel";

// LOCATION DATA, figure out where to put
let poiWeeniesIds = [
  6084, 2383, 2080, 7941, 2341, 2562, 28981, 4164, 3628, 1364, 2074, 32045,
  1118, 2339, 4053,
];

const ROUTE_WAYPOINT_TYPE = {
  0: "Unknown",
  1: "Run",
  2: "Jump",
  3: "Use Object",
  4: "Use Portal",
  5: "Use NPC",
  6: "Use Vendor",
  254: "Start",
  255: "End",
};
const ROUTE_LOCATION_TYPE = {
  0: "Unknown",
  1: "Landscape",
  2: "Dungeon",
  3: "Platform",
  4: "Landscape Building",
  5: "Portal",
  6: "Portal Exit",
};
const ROUTE_WAYPOINT_ROUTE_STATUS = {
  0: "Invalid",
  1: "No Start Found",
  2: "No End Found",
  255: "Valid",
};

// Icons
// import { faTimes } from "@fortawesome/free-solid-svg-icons";

import {
  DERETH_MAP_TILE_SIZE,
  DERETH_MAP_MAX_ZOOM,
  DERETH_MAP_MIN_ZOOM,
  GLOBAL_COORDS_MAX,
  GLOBAL_COORDS_MIN,
  CDN_ASSETS_URL
} from "@/constants";

import { Position } from "@/classes";

const mapContainer = ref();
let isInitialLoad = ref(true);
let isMapReady = ref(false);
let locationsLoaded = ref(false);
let mapOrigin = ref([0, 0]);
let mapPadding = ref(4000);
let currentZoom = ref(0);
let minZoom = ref(DERETH_MAP_MIN_ZOOM);
let maxZoom = ref(DERETH_MAP_MAX_ZOOM);
let map = ref(null);
let mapSize = ref(GLOBAL_COORDS_MAX);
let tileSize = ref(DERETH_MAP_TILE_SIZE);
let currentMapCenter = ref(null);
let labelEngine = ref(null);
let findingRoute = ref(false);
let route = ref(routeTest);
let mapLocations = ref([]);

let layers = reactive({
  features: {
    selectedLocation: null,
    targetedLocation: null,
    locations: null,
    regions: null,
    inaccessible: null,
    labelBoundingBoxes: null,
    selectedPortalLine: null,
    landblocks: null,
    landblockHovered: null,
    landblockGrid: null,
    landblockGridFeatures: null,
    landblockCellGrid: null,
    landblockLayerTest: null,
    cellLayerTest: null,
    route: null,
  },
  tiles: {
    land: null,
    land_raw: null,
    objects: null,
    objects_raw: null,
    water: null,
  },
  grid: {
    landblocks: null,
    landcells: null,
  },
});

let renderers = reactive({
  canvasGrid: null,
});

let mapIcons = reactive({});

let options = reactive({
  enableRawMap: false,
  enableLandblockGrid: false,
  enableLandscapeObjects: true,
  enableInaccessibleTerrain: false,
  enableMarkers: true,
});

let locationsQueryTx = ref(null);

// Computed

const mapBounds = computed(() => {
  return [
    [0, 0],
    [mapSize.value, mapSize.value],
  ];
});

const mapBoundsVisual = computed(() => {
  return [
    mapOrigin.value.map((coord) => coord - mapPadding.value),
    [mapSize.value + mapPadding.value, mapSize.value + mapPadding.value],
  ];
});

const mapCenter = computed(() => {
  return [mapSize.value / 2, mapSize.value / 2];
});

const mapCenterLatLng = computed(() => {
  return L.latLng(mapCenter.value);
});

const selectedLocationPos = computed(() => {
  const coords = selectedLocation.value.geometry.coordinates;
  return Position.fromGlobal(coords[1], coords[0]);
});

const locationLayers = computed(() => {
  if (!isMapReady.value) return [];

  //console.log("DRAWING LAYERS...");
  let currentZoom = map.value.getZoom();
  let mapBounds = map.value.getBounds();

  let locs = mapLocations.value;

  let points = mapLocations.value.filter((loc) => loc.geometry.type == "Point");

  console.log("POINTS!!!!");
  console.log(points);
  let regions = mapLocations.value.filter(
    (loc) => loc.geometry.type == "Polygon"
  );

  let showRegions = false;

  if (showRegions) {
    layers.regions.clearLayers();

    regions.forEach((region) => {
      // console.log(region);

      let poly = L.polygon(region.coordinates);

      //let labelCoords = polylabel(region.coordinates, 1.0);

      if (region.geometryType == "MultiPolygon") {
        // console.log('multi polys')
        //console.log(region.coordinates.length);

        // let max_area_polygon;
        // let max_area = 0;

        //let polys = region.coordinates;

        let labelCenter;

        let polys = region.coordinates.sort((a, b) => {
          let polyA = turf.polygon(a);
          let areaA = turf.area(polyA);

          let polyB = turf.polygon(b);
          let areaB = turf.area(polyB);

          return areaB - areaA;
        });

        labelCenter = turf.centerOfMass(turf.polygon(polys[0]));

        poly
          .bindTooltip(region.name, {
            direction: "center",
            permanent: true,
            interactive: true,
            className: "label",
          })
          .openTooltip([labelCenter[0], labelCenter[1]]);
      } else {
        //let turfPolygon = turf.polygon(region.coordinates);
        //labelCenter = turf.centerOfMass(turfPolygon);
        //    labelCenter = [0,0];
      }

      //
      // console.log('label coords')
      // console.log(labelCoords);

      this.layers.regions.addLayer(poly);
    });
  }

  // this.regions.splice(0)

  // this.regions = regions;

  let pointMarkers = points.map((location) => {
    // if (location.properties.type == "region" && ocation.properties.subCategory == "settlement") {
    //     //this.regions.push({ name: location.name, coordinates: location.geometry });

    //     console.log("SETTLEMENT REGION!!!!!!!!");
    //     console.log(location);
    //     let regionPoly = L.polygon(location.geometry.coordinates, {
    //         color: "red",
    //     });

    //     this.layers.locations.addLayer(regionPoly);

    let icon;

    if (location.properties.type == "town") {
      icon = this.mapIcons.town;
    }

    if (location.properties.type == "outpost") {
      icon = this.mapIcons.outpost;
    }

    if (location.properties.type == "lifestone") {
      icon = this.mapIcons.lifestone;
    }

    if (location.properties.type == "poi") {
      icon = this.mapIcons.poi;
    }

    if (
      location.properties.type == "vendor" ||
      location.properties.type == "npc"
    ) {
      icon = mapIcons.vendor;
    }

    if (location.properties.type == "portal") {
      icon = mapIcons.portal;
    }

    if (location.properties.type == "dungeon") {
      icon = mapIcons.dungeon;
    }

    if (location.properties.type == "house") {
      icon = mapIcons.housing;
    }

    if (location.properties.type == "settlement") {
      icon = mapIcons.housing;
    }

    // if (location.category == "settlement-region") {
    //     icon = this.mapIcons.housing;
    // }

    let mapCoords = location.geometry.coordinates;

    let marker = L.marker([mapCoords[0], mapCoords[1]], {
      icon: icon,
    });

    let priority = location.properties.priority || 5;

    if (location.properties.selected) {
      priority = 10;
    }

    marker.feature = {
      properties: {
        id: location.properties.id,
        slug: location.properties.slug,
        priority: priority,
      },
    };

    if (location.type == "town") {
      marker
        .bindTooltip(location.properties.name, {
          direction: "right",
          permanent: true,
          interactive: true,
          className: "label",
        })
        .openTooltip();
    }

    // TK: REENABLE
    //marker.on("click", onLocationClick);

    return marker;
  });

  return pointMarkers;
});

// METHODS

const initMap = () => {

  console.log("Method: initMap");

  L.Projection.LonLatCustom = L.extend({}, L.Projection.LonLat, {
    bounds: L.bounds(mapBounds.value),
  });

  const transformScaleFactor = tileSize.value / mapSize.value;

  L.CRS.SimpleCustom = L.extend({}, L.CRS.Simple, {
    projection: L.Projection.LonLatCustom,
    transformation: new L.Transformation(
      transformScaleFactor,
      0,
      -1 * transformScaleFactor,
      0
    ),
    infinite: false,
  });

  let mapOptions = {
    crs: L.CRS.SimpleCustom,
    minZoom: minZoom.value,
    maxZoom: maxZoom.value,
    boxZoom: false,
    zoomControl: false,
    center: mapCenter.value,
    attributionControl: false,
    maxBoundsViscosity: 0,
    maxBounds: mapBoundsVisual.value,
  };

  // CREATE MAP
  map.value = L.map(mapContainer.value, mapOptions);

  // ------------------------------------------------------------------------------

  // MAP CONTROLS

  L.control
    .zoom({
      position: "bottomright",
    })
    .addTo(map.value);

  // SET UP LAYERS

  // Create featureGroups for all feature layers
  for (const layer in layers.features) {
    layers.features[layer] = L.featureGroup().addTo(map.value);
  }

  // Create tile layers

  const tileOptions = {
    bounds: mapBounds.value,
    tileSize: tileSize.value,
    errorTileUrl: CDN_ASSETS_URL + "/img/map/tiles/empty/tile.png",
    tms: true,
  };

  const waterTileOptions = Object.assign(
    {
      minNativeZoom: 4,
      maxNativeZoom: 8,
      minZoom: 4,
      maxZoom: maxZoom.value,
    },
    tileOptions
  );

  layers.tiles.water = L.tileLayer(
    CDN_ASSETS_URL + "/img/map/tiles/land/{z}/{x}/{y}.png",
    waterTileOptions
  );

  layers.tiles.water.getTileUrl = function (coords) {
    let zoom = this._getZoomForUrl();
    return `${CDN_ASSETS_URL}/img/map/tiles/water/${zoom}/tile.png`;
  };

  layers.tiles.water.addTo(map.value);

  const landTileOptions = Object.assign(
    {
      minNativeZoom: minZoom.value,
      maxNativeZoom: 8,
      minZoom: minZoom.value,
      maxZoom: maxZoom.value,
    },
    tileOptions
  );

  layers.tiles.land = L.tileLayer(
    CDN_ASSETS_URL + "/img/map/tiles/land/{z}/{x}/{y}.png",
    landTileOptions
  );

  layers.tiles.land.addTo(map.value);

  layers.tiles.land_raw = L.tileLayer(
    CDN_ASSETS_URL+ "/img/map/tiles/land_raw/{z}/{x}/{y}.png",
    landTileOptions
  );

  const objectTileOptions = Object.assign(
    {
      minNativeZoom: minZoom.value,
      maxNativeZoom: 8,
      minZoom: minZoom.value,
      maxZoom: maxZoom.value,
    },
    tileOptions
  );

    layers.tiles.objects = L.tileLayer(
    CDN_ASSETS_URL + "/img/map/tiles/objects/{z}/{x}/{y}.png",
    objectTileOptions
  );

  layers.tiles.objects.addTo(map.value);

  layers.tiles.objects_raw = L.tileLayer(
    CDN_ASSETS_URL + "/img/map/tiles/objects_raw/{z}/{x}/{y}.png",
    objectTileOptions
  );

  // this.map.createPane("canvasGridPane");
  // this.renderers.canvasGrid = L.svg({ pane: "canvasGridPane" });

    // TK: REENABLE
  //renderLandblockGrid();

  // Image layers

  // Fix impassable layer

  // L.imageOverlay(
  //     'http://localhost:8080/assets/img/unwalkable.png',
  //     this.mapBounds
  // ).addTo(this.map);

  // SET UP ICONS

  mapIcons.marker = L.icon({
    iconUrl: "@/assets/img/map/icons/map-marker.png",
    iconSize: [20, 20], // size of the icon
    iconAnchor: [10, 10], // point of the icon which will correspond to marker's location
    popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
    tooltipAnchor: [3, -1],
  });

  mapIcons.lifestone = L.icon({
    iconUrl: "@/assets/img/map/icons/Lifestone_Marker_Icon.png",
    iconSize: [35, 35], // size of the icon
    iconAnchor: [17.5, 17.5], // point of the icon which will correspond to marker's location
    tooltipAnchor: [8, 0], // point from which the popup should open relative to the iconAnchor
  });

  mapIcons.town = L.icon({
    iconUrl: "@/assets/img/map/icons/town-icon-test.png",
    iconSize: [20, 18], // size of the icon
    iconAnchor: [10, 9], // point of the icon which will correspond to marker's location
    popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
    tooltipAnchor: [12, 0], // point from which the popup should open relative to the iconAnchor
  });

  mapIcons.poi = L.icon({
    iconUrl: "@/assets/img/map/icons/map-poi-test3.png",
    iconSize: [18, 18], // size of the icon
    iconAnchor: [9, 9], // point of the icon which will correspond to marker's location
    popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
    tooltipAnchor: [12, 0], // point from which the popup should open relative to the iconAnchor
  });

  mapIcons.vendor = L.icon({
    iconUrl: "@/assets/img/map/icons/map-icon-npc.png",
    iconSize: [24, 24], // size of the icon
    iconAnchor: [12, 12], // point of the icon which will correspond to marker's location
    popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
    tooltipAnchor: [12, 0], // point from which the popup should open relative to the iconAnchor
  });

  mapIcons.portal = L.icon({
    iconUrl: "@/assets/img/map/icons/Lifestone_Portal_Icon.png",
    iconSize: [32, 32], // size of the icon
    iconAnchor: [16, 16], // point of the icon which will correspond to marker's location
    popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
    tooltipAnchor: [12, 0], // point from which the popup should open relative to the iconAnchor
  });

  mapIcons.outpost = L.icon({
    iconUrl: "@/assets/img/map/icons/map-point-outpost.png",
    iconSize: [12, 12], // size of the icon
    iconAnchor: [6, 6], // point of the icon which will correspond to marker's location
    popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
    tooltipAnchor: [12, 0], // point from which the popup should open relative to the iconAnchor
  });

  mapIcons.dungeon = L.icon({
    iconUrl: "@/assets/img/map/icons/map-point-gharu-town.png",
    iconSize: [14, 14], // size of the icon
    iconAnchor: [7, 7], // point of the icon which will correspond to marker's location
    popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
    tooltipAnchor: [12, 0], // point from which the popup should open relative to the iconAnchor
  });

  mapIcons.housing = L.icon({
    iconUrl: "@/assets/img/map/icons/house-icon.png",
    iconSize: [12, 12], // size of the icon
    iconAnchor: [6, 6], // point of the icon which will correspond to marker's location
    popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
    tooltipAnchor: [12, 0], // point from which the popup should open relative to the iconAnchor
  });

  mapIcons.settlement = L.icon({
    iconUrl: "@/assets/img/map/icons/Map_Point_Via_Town.png",
    iconSize: [12, 12], // size of the icon
    iconAnchor: [6, 6], // point of the icon which will correspond to marker's location
    popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
    tooltipAnchor: [12, 0], // point from which the popup should open relative to the iconAnchor
  });

  mapIcons.mapPointTest = L.icon({
    iconUrl: "@/assets/img/map/icons/Map_Point_Large.png",
    iconSize: [12, 12], // size of the icon
    iconAnchor: [6, 6], // point of the icon which will correspond to marker's location
    popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
    tooltipAnchor: [12, 0], // point from which the popup should open relative to the iconAnchor
  });

  mapIcons.mapMarkerPurple = L.icon({
    iconUrl: "@/assets/img/map/icons/map-marker-purple.png",
    iconSize: [14, 20], // size of the icon
    iconAnchor: [7, 20], // point of the icon which will correspond to marker's location
    popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
    tooltipAnchor: [12, 0], // point from which the popup should open relative to the iconAnchor
  });

  //
  //
  // gharuTown: L.icon({
  //     iconUrl: require('~assets/img/map/icons/map-point-gharu-town.png'),
  //     iconSize: [20, 20], // size of the icon
  //     iconAnchor: [10, 15], // point of the icon which will correspond to marker's location
  //     popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
  // }),
  // aluvianTown: L.icon({
  //     iconUrl: require('~assets/img/map/icons/map-point-aluv-town.png'),
  //     iconSize: [20, 20], // size of the icon
  //     iconAnchor: [10, 15], // point of the icon which will correspond to marker's location
  //     popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
  // }),
  // shoTown: L.icon({
  //     iconUrl: require('~assets/img/map/icons/Map_Point_Sho_Town.png'),
  //     iconSize: [20, 20], // size of the icon
  //     iconAnchor: [10, 15], // point of the icon which will correspond to marker's location
  //     popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
  // }),
  // viamontTown: L.icon({
  //     iconUrl: require('~assets/img/map/icons/Map_Point_Via_Town.png'),
  //     iconSize: [20, 20], // size of the icon
  //     iconAnchor: [10, 15], // point of the icon which will correspond to marker's location
  //     popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
  // }),
  // town: L.icon({
  //     iconUrl: require('~assets/img/map/icons/map-point-aluv-town.png'),
  //     iconSize: [15, 15], // size of the icon
  //     iconAnchor: [5, 5], // point of the icon which will correspond to marker's location
  //     popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
  // }),
  // 'landmark': L.icon({
  //     iconUrl: require('~assets/img/map/icons/map-point-large.png'),
  //     iconSize: [20, 20], // size of the icon
  //     iconAnchor: [10, 10], // point of the icon which will correspond to marker's location
  //     popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
  //     tooltipAnchor: [4, 0]
  // }),
  //
  //
  //
  // 'portal': L.icon({
  //     iconUrl: require('~assets/img/map/icons/Map_Point_Portal.png'),
  //     iconSize: [35, 35], // size of the icon
  //     iconAnchor: [17, 17], // point of the icon which will correspond to marker's location
  //     tooltipAnchor: [8, 0] // point from which the popup should open relative to the iconAnchor
  // }),
  // 'npc': L.icon({
  //     iconUrl: require('~assets/img/map/icons/map-icon-npc.png'),
  //     iconSize: [40, 40], // size of the icon
  //     iconAnchor: [20, 20], // point of the icon which will correspond to marker's location
  //     tooltipAnchor: [3, 0] // point from which the popup should open relative to the iconAnchor
  // })
  //

  //labelEngine.value = new labelgun(this.hideLabel, this.showLabel);

  // SET UP EVENTS

  map.value.on("click", onMapClick);
  map.value.on("moveend", onMapMoveEnd);
  map.value.on("movestart", onMapMoveStart);
  map.value.on("mousemove", onMapMouseMove);
  // this.map.on('zoomanim', this.onMapZoomAnimation);
  // this.map.on('zoom', this.onMapZoom);
  map.value.on("zoomend", onMapZoomEnd);
  // this.map.on('zoomstart', this.onMapZoomStart);
  map.value.on("resize", onMapResize);
  // this.map.on('moveend', this.onMapMoveEnd);

//   console.log(this.mapLocationPath);

//   if (this.mapLocationPath) {
//     console.log("INIT MAP: MAP LOCATION PATH FOUND!!");

//     let radarString = `${this.mapLocationPath.coords[0]}, ${this.mapLocationPath.coords[1]}`;

//     console.log(radarString);

//     let mapLocationPos = Position.fromRadar(radarString);
//     let mapLocationGlobal = mapLocationPos.toGlobal();
//     let mapLocationZoom = parseInt(this.mapLocationPath.coords[2]);

//     this.map.setView(
//       [mapLocationGlobal.y, mapLocationGlobal.x],
//       mapLocationZoom
//     );
//   } else {
//     //this.map.setView(this.mapCenter, 1); // TODO: Change to calced center
//     this.map.fitBounds(this.mapBounds);
//   }

    map.value.fitBounds(mapBounds.value);


  //

  // CHECK FOR 'mapPosition' first

  //  let boundsZoom = this.map.getBoundsZoom(bounds);

  // this.map.setMinZoom(boundsZoom);

  map.value.whenReady(mapReady);
};

const onMapClick = () => {};
const onMapMoveEnd = () => {};
const onMapMoveStart = () => {};
const onMapMouseMove = () => {};
const onMapZoomEnd = () => {};
const onMapResize = () => {};
const mapReady = () => {};


// HOOKS

onMounted(() => {
  initMap();
});
</script>

<style scoped>



#dereth-map {
    height: 100%;
}

#map-container {
    height: 100%;
     background: #242b4d;
}

.map-main {
  flex: 1 1 auto;
  display: flex;
  align-items: stretch;
  flex-direction: column;
  flex-basis: 20px;
}

.map-main .controls {
  background: red;
  flex: 0 0 auto;
}

.map-pane {
  position: relative;
  flex: 1 1 auto;
  display: flex;
  flex-direction: row;

  flex-basis: 20px;

  overflow: hidden;
}

.map-panel {
  width: 100%;
  /* height: 100%; */
  flex: 1 1 auto;
  position: relative;
}

#derethmap {
  width: 100%;
  height: 100%;
  /* height: 100%; */
  background: #242b4d;
  /* background: purple; */
  /* background: transparent
        url("http://localhost:8080/assets/img/map/tiles/water/6/tile.png")
        repeat 0 0; */

  /* background-repeat: repeat;
    background-position: 0 0; */
}

.detail-panel {
  height: 100%;
  background: #131313;
  flex: 0 0 340px;
  max-width: 340px;
  width: 340px;
  padding: 0 0px 0 2px;
  min-height: 0;

  /* margin: 0px 0 0px 2px; */
}

.detail-panel .wrap {
  /* height: 100%; */
  border: 2px solid #a08557;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.detail-panel .wrap header {
  border-bottom: 2px solid #a08557;
  padding: 15px;
  font-family: "Georgia", sans-serif;
  padding-right: 60px;
  position: relative;

  line-height: 1.2;
  flex: 0 0 auto;
}

.detail-panel .wrap header .category {
  text-transform: uppercase;
  font-weight: bold;

  letter-spacing: 0.05rem;
  font-size: 0.7rem;
  color: #a08557;

  padding: 0;
  margin: 0;
  margin-bottom: 0.2rem;
}

.detail-panel .wrap header .name {
  font-size: 1.4rem;
  line-height: 1.2;
  padding: 0;
  margin: 0;

  margin-bottom: 5px;
}

.detail-panel .wrap header .coords {
  font-family: sans-serif;
  font-weight: bold;
  color: #fff;
  font-size: 0.95rem;
  margin-top: 0.2rem;
  margin-bottom: 0;
  padding: 0;
}

.detail-panel .wrap header .geocode {
  font-size: 0.95rem;
  margin: 0;

  line-height: 1.35;

  padding: 0;

  color: #a08557;
}

.detail-panel .wrap header .close {
  position: absolute;
  top: 1px;
  right: 1px;

  background: #442f18;
  color: #a08557;
  padding: 2px 5px;
  line-height: 1;
  vertical-align: middle;
  border: 1px solid #735c36;
  border-width: 0 0 1px 1px;
  cursor: pointer;
  opacity: 0.65;
  transition: opacity 0.2s linear;
}

.detail-panel .wrap header .close:hover {
  opacity: 1;
}

.detail-panel .wrap header .gameicon {
  position: absolute;
  top: 35px;
  right: 12px;
}

.detail-panel .wrap .content {
  flex: 1 1 auto;
  min-height: 0;
  padding: 15px;
  overflow: scroll;
}

.detail-card {
  position: absolute;
  bottom: 20px;
  left: 50%;
  width: 400px;
  background: #fff;

  font-size: 15px;
  font-weight: bold;

  text-shadow: 1px 1px rgba(255, 255, 255, 0.25);

  height: 75px;
  transform: translateX(-50%);
  z-index: 50000;
  padding: 8px 14px;
  border: 1px solid #272727;

  background: #a08557 url("@/@/@/assets/img/map-detail-card-bg.png") repeat 0
    0;
  color: #131313;

  box-shadow: 2px 2px 0 0px rgba(0, 0, 0, 0.5), inset 1px 1px 0 #d9b578;
}

.detail-card p {
  margin: 0;
  padding: 0;
}

.detail-card .link {
  color: var(--accent-color-2);
}

.detail-card .coords {
  font-size: 13px;
  font-family: sans-serif;
}

.detail-card .close {
  position: absolute;
  top: 0px;
  right: 0px;
  color: #524022;
  line-height: 1;
  padding: 7px 10px;
  vertical-align: middle;
  opacity: 0.7;
  cursor: pointer;
  transition: opacity 0.1s linear;
}

.detail-card .close:hover {
  opacity: 1;
}

.leaflet-container {
  /* background: #1d213b !important; */
  outline: 0;
}

.leaflet-tooltip.label {
  background: none;
  color: #fff;
  border: 0;
  box-shadow: none;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000,
    1px 1px 0 #000;
  font-weight: bold;
  margin-left: 0;
  padding: 2px 2px 2px 0;

  font-family: var(--font-family-serif);
  font-size: 0.8rem;
}

.detail-panel {
}

.search-overlay {
  background: #000;
  flex: 0 0 340px;
  padding: 4px;

  position: absolute;
  top: 5px;
  right: 5px;

  width: 300px;
  z-index: 50000;
  color: #fff;
}

.map-options {
  background: #311614;
  padding: 14px;
  border-bottom: 2px solid #131313;
  user-select: none;
  display: flex;
  flex-direction: row;
}

.map-options label {
  cursor: pointer;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

pre {
  color: #fff;
}

#heightmap {
  display: none;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
