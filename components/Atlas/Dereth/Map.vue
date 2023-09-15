<template>
  <div id="dereth-map">
    <div id="map-container" ref="mapContainer"></div>
  </div>
</template>

<script setup>
import { orderBy, debounce } from "lodash-es";
import { useStore } from "@/store";
import * as mapIcons from "@/common/mapIcons.js";
import { ACPosition, globalToPos } from "@asherondb/ac-position";
import impassableWaterSvg from "@/assets/img/map/impassable.water.svg?raw";
import impassableSlopesSvg from "@/assets/img/map/impassable.slopes.svg?raw";

import spawnTest from "@/assets/spawntest.geo.json";
import settlementRegions from "@/assets/settlement-regions.json";
import lootTiers from "@/assets/loottiers.geo.json";

import regionCells from "@/assets/region-cells.json";

// import labelgun from "labelgun";
import {
  DERETH_MAP_TILE_SIZE,
  DERETH_MAP_MAX_ZOOM,
  DERETH_MAP_MIN_ZOOM,
  GLOBAL_COORDS_MAX,
  GLOBAL_COORDS_MIN,
  CDN_ASSETS_URL,
  CELL_LENGTH,
  DERETH_MAP_TILES_URL,
} from "@/common/constants.js";

const store = useStore();
const mapContainer = ref();
const locationClicked = ref(false);
const mapClicked = ref(false);
const mapMouseDown = ref(false);
const isInitialLoad = ref(true);
const isMapReady = ref(false);
const mapOrigin = ref([0, 0]);
const mapPadding = ref(4000);
const currentZoom = ref(0);
const minZoom = ref(DERETH_MAP_MIN_ZOOM);
const maxZoom = ref(DERETH_MAP_MAX_ZOOM);
const map = ref(null);
const mapSize = ref(GLOBAL_COORDS_MAX);
const tileSize = ref(DERETH_MAP_TILE_SIZE);

const layers = reactive({
  features: {
    selectedLocation: null,
    locations: null,
    regions: null,
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
    spawns: null,
    targetedPosition: null,
  },
  lootTiers: null,
  impassable: {
    slopes: null,
    water: null,
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

const renderers = reactive({
  canvasGrid: null,
  impassable: null,
});

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

const locationLayers = computed(() => {
  if (!isMapReady.value) return [];

  let points = store.locations || [];

  let pointMarkers = points.map((location) => {
    let icon = mapIcons.town;

    switch (location.properties.category) {
      case "town":
        switch (location.properties.subCategory) {
          case "aluvian":
            icon = mapIcons.townAluvian;
            break;
          case "sho":
            icon = mapIcons.townSho;
            break;
          case "gharundim":
            icon = mapIcons.townGharu;
            break;
          case "viamont":
            icon = mapIcons.townViamont;
            break;
          case "outpost":
            icon = mapIcons.outpost;
            break;
        }
        break;
    }

    if (location.properties.category == "lifestone") {
      icon = mapIcons.lifestone;
    }

    if (location.properties.category == "bindstone") {
      icon = mapIcons.bindstone;
    }

    if (location.properties.category == "poi") {
      icon = mapIcons.poi;
    }

    if (
      location.properties.category == "vendor" ||
      location.properties.category == "npc"
    ) {
      icon = mapIcons.vendor;
    }

    if (location.properties.category == "portal") {
      icon = mapIcons.portal;
    }

    if (location.properties.category == "dungeon") {
      icon = mapIcons.dungeon;
    }

    if (location.properties.category == "house") {
      icon = mapIcons.housing;
    }

    if (location.properties.category == "settlement") {
      icon = mapIcons.housing;
    }

    // if (location.category == "settlement-region") {
    //     icon = mapIcons.housing;
    // }

    let mapCoords = location.geometry.coordinates;

    let marker = L.marker([mapCoords[0], mapCoords[1]], {
      icon: toRaw(icon),
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

    // if (location.type == "town") {
    //   marker
    //     .bindTooltip(location.properties.name, {
    //       direction: "right",
    //       permanent: true,
    //       interactive: true,
    //       className: "label",
    //     })
    //     .openTooltip();
    // }

    marker.on("click", onLocationClick);

    return marker;
  });

  return pointMarkers;
});

// WATCHERS

watch(
  () => store.options.dereth.landblockGrid,
  async (newVal, oldVal) => {
    console.log("landblockGrid watcher");
    handleLandblockGrid();
  }
);

watch(
  () => store.options.dereth.layers.impassableTerrain,
  async (newVal, oldVal) => {
    console.log("impassableTerrain watcher");
    toggleLayerVisibility(store.options.dereth.layers.impassableTerrain, [
      layers.impassable.water,
      layers.impassable.slopes,
    ]);
  }
);

watch(
  () => store.options.dereth.layers.lootTiers,
  async (newVal, oldVal) => {
    console.log("impassableTerrain watcher");
    toggleLayerVisibility(store.options.dereth.layers.lootTiers, [
      layers.lootTiers,
    ]);
  }
);

watch(
  () => store.options.dereth.layers.landscapeObjects,
  async (newVal, oldVal) => {
    console.log("impassableTerrain watcher");

    toggleLayerVisibility(store.options.dereth.layers.landscapeObjects, [
      layers.tiles.objects_raw,
    ]);
  }
);

watch(
  () => store.options.dereth.layers.developmentRegions,
  async (newVal, oldVal) => {
    console.log("impassableTerrain watcher");

    toggleLayerVisibility(store.options.dereth.layers.developmentRegions, [
      layers.tiles.land_raw,
    ]);
  }
);

watch(locationLayers, async (newVal, oldVal) => {
  console.log("locationLayers Watcher");
  drawLayersDebounced();
});

watch(
  () => store.selectedLocation,
  async (newVal, oldVal) => {
    console.log("selectedLocation watcher");

    layers.features.selectedLocation.clearLayers();

    if (newVal) {
      console.log("new selectedLocation");
      if (newVal.geometry.type == "Point") {
        if (!locationClicked.value) {
          console.log("Location is a point");
          map.value.panTo(newVal.geometry.coordinates);
        }

        // layers.features.selectedLocation.addLayer(poly);

        const iconSize = [10, 10];

        const latlng = L.latLng(newVal.geometry.coordinates);
        layers.features.selectedLocation.clearLayers();

        const rect = L.shapeMarker(latlng, {
          shape: "square",
          color: "#11f30f",
          fillOpacity: 0,
          opacity: 1,
          radius: Math.min.apply(Math, iconSize) / 2 + 5,
        });

        layers.features.selectedLocation.addLayer(rect);

        if (newVal.properties.category == "portal") {
          console.log(newVal.properties);

          const destLatLng = L.latLng([
            newVal.properties.destination.coordinates.global.y,
            newVal.properties.destination.coordinates.global.x,
          ]);

          let line = L.polyline([latlng, destLatLng], { color: "purple" });

          layers.features.selectedLocation.addLayer(line);
        }
      } else {
        console.log("Location is a polygon");
        const poly = L.polygon(newVal.geometry.coordinates, {
          color: "orange",
          fillColor: "orange",
          fillOpacity: 0.2,
          weight: 1,
        });

        layers.features.selectedLocation.addLayer(poly);

        const bounds = poly.getBounds();
        map.value.fitBounds(bounds, { noMoveStart: true });
      }

      locationClicked.value = false;
    }
  }
);

// watch(
//   () => store.spawnData,
//   async (newVal, oldVal) => {
//     console.log("handleSpawnData watcher");
//     if (newVal) {
//       handleSpawnData();
//     }
//   }
// );

watch(
  () => store.targetedPosition,
  async (newVal, oldVal) => {
    console.log("targetedPosition watcher");

    layers.features.targetedPosition.clearLayers();

    if (newVal) {
      //layers.features.targetedPosition.clearLayers();
      console.log(newVal);
      console.log("value found");
      const latLng = L.latLng([
        newVal.coordinates.global.y,
        newVal.coordinates.global.x,
      ]);

      if (!mapClicked.value) {
        map.value.panTo(latLng, { noMoveStart: true });
      }

      console.log("mapIcons");
      console.log(mapIcons.marker);

      //   let marker = L.marker(latLng, {
      //     icon: mapIcons.marker,
      //   });

      let marker = L.circleMarker(latLng, {
        color: "#11f30f",
        fillOpacity: 0,
        opacity: 1,
        radius: 10,
      });

      layers.features.targetedPosition.addLayer(marker);
    } else {
      console.log("value not found");
    }

    mapClicked.value = false;
  }
);

// METHODS

const onLocationClick = (event) => {
  console.log("Function: onLocationClick");

  locationClicked.value = true;
  store.getLocation(event.target.feature.properties.id);

  store.targetedPosition = null;
  store.searchResults = [];
  console.log(event);

  const iconSize = event.sourceTarget.options.icon.options.iconSize;
  //const locationLatLng = iconSize;
  const containerPoint = event.containerPoint;

  //   const botLeftX = containerPoint.x - iconSize[0];
  //   const botLeftY = containerPoint.y - iconSize[0];
  //   const topRightX = containerPoint.x + iconSize[1];
  //   const topRightY = containerPoint.y + iconSize[1];

  //   const botLeft = map.value.containerPointToLatLng(L.point([botLeftX, botLeftY]));
  //   const topRight = map.value.containerPointToLatLng(L.point([topRightX, topRightY]));

  //     console.log(botLeft);
  //     console.log(topRight);
  //const rect = L.rectangle([botLeft, topRight]);

  //store.selectedLocationId = event.target.feature.properties.id;

  //store.searchQuery = event.target.feature.properties.name;
};

// const drawRegions = () => {
//   console.log("DRAWING REGIONS...");

//   layers.features.regions.clearLayers();

//   console.log("cleared layers");

//   regionsData.value.forEach((region) => {
//     // console.log(region);

//     let poly = L.polygon(region.geometry.coordinates);

//     //let labelCoords = polylabel(region.coordinates, 1.0);

//     if (region.geometry.type == "MultiPolygon") {
//       // console.log('multi polys')
//       //console.log(region.coordinates.length);

//       // let max_area_polygon;
//       // let max_area = 0;

//       //let polys = region.coordinates;

//       let labelCenter;

//       let polys = region.geometry.coordinates.sort((a, b) => {
//         let polyA = turf.polygon(a);
//         let areaA = turf.area(polyA);

//         let polyB = turf.polygon(b);
//         let areaB = turf.area(polyB);

//         return areaB - areaA;
//       });

//       labelCenter = turf.centerOfMass(turf.polygon(polys[0]));

//       poly
//         .bindTooltip(region.name, {
//           direction: "center",
//           permanent: true,
//           interactive: true,
//           className: "label",
//         })
//         .openTooltip([labelCenter[0], labelCenter[1]]);
//     } else {
//       //let turfPolygon = turf.polygon(region.coordinates);
//       //labelCenter = turf.centerOfMass(turfPolygon);
//       //    labelCenter = [0,0];
//     }

//     //
//     // console.log('label coords')
//     // console.log(labelCoords);

//     layers.features.regions.addLayer(poly);
//   });
// };

const drawLayers = () => {
  console.log("DRAWING LAYERS...");

  layers.features.locations.clearLayers();

  console.log("cleared layers");
  let markers = locationLayers.value;

  markers.forEach((marker) => {
    layers.features.locations.addLayer(marker);
  });
};

const drawLayersDebounced = debounce(() => {
  drawLayers();
}, 500);

const handleLandblockGrid = () => {
  if (store.options.dereth.landblockGrid) {
    //this.layers.landblockHovered.clearLayers();

    layers.grid.landblocks.addTo(map.value);

    // Check zoom level for cells

    if (currentZoom.value >= 7) {
      layers.grid.landcells.addTo(map.value);
    }
  } else {
    layers.grid.landblocks.removeFrom(map.value);
    layers.grid.landcells.removeFrom(map.value);
  }
};

const initMap = () => {
  console.log("Method: initMap");

  // Set up custom projection

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
    maxBoundsViscosity: 1,
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

  layers.lootTiers = L.featureGroup();

  // Set up custom panes

  map.value.createPane("canvasGrid");
  map.value.getPane("canvasGrid").style.zIndex = 550;
  renderers.canvasGrid = L.canvas({ pane: "canvasGrid" });

  // Set up tile layers

  const tileOptions = {
    bounds: mapBounds.value,
    tileSize: tileSize.value,
    errorTileUrl: DERETH_MAP_TILES_URL + "/empty/tile.png",
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
    DERETH_MAP_TILES_URL + "/land/{z}/{x}/{y}.png",
    waterTileOptions
  );

  layers.tiles.water.getTileUrl = function (coords) {
    let zoom = this._getZoomForUrl();
    return `${DERETH_MAP_TILES_URL}/water/${zoom}/tile.png`;
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
    DERETH_MAP_TILES_URL + "/land/{z}/{x}/{y}.png",
    landTileOptions
  );

  layers.tiles.land.addTo(map.value);

  layers.tiles.land_raw = L.tileLayer(
    DERETH_MAP_TILES_URL + "/land_raw/{z}/{x}/{y}.png",
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
    DERETH_MAP_TILES_URL + "/objects/{z}/{x}/{y}.png",
    objectTileOptions
  );

  layers.tiles.objects_raw = L.tileLayer(
    DERETH_MAP_TILES_URL + "/objects_raw/{z}/{x}/{y}.png",
    objectTileOptions
  );

  layers.tiles.objects_raw.addTo(map.value);

  // Set up impassable terrain layers

  const waterSvgDoc = new DOMParser().parseFromString(
    impassableWaterSvg,
    "text/html"
  );
  const waterSvgEl = waterSvgDoc.getElementsByTagName("svg")[0];
  layers.impassable.water = L.svgOverlay(waterSvgEl, mapBounds.value);

  const slopesSvgDoc = new DOMParser().parseFromString(
    impassableSlopesSvg,
    "text/html"
  );
  const slopesSvgEl = slopesSvgDoc.getElementsByTagName("svg")[0];
  layers.impassable.slopes = L.svgOverlay(slopesSvgEl, mapBounds.value);

  // Setup map event handlers
  map.value.on("click", onMapClick);
  map.value.on("moveend", onMapMoveEnd);
  map.value.on("movestart", onMapMoveStart);
  map.value.on("mousemove", onMapMouseMove);
  map.value.on("mousedown", onMapMouseDown);
  map.value.on("mouseup", onMapMouseUp);
  map.value.on("zoomend", onMapZoomEnd);
  map.value.on("zoomstart", onMapZoomStart);
  map.value.on("resize", onMapResize);

  //   console.log(this.mapLocationPath);

  //   if (this.mapLocationPath) {
  //     console.log("INIT MAP: MAP LOCATION PATH FOUND!!");

  //     let radarString = `${this.mapLocationPath.coords[0]}, ${this.mapLocationPath.coords[1]}`;

  //     console.log(radarString);

  //     let mapLocationPos = ACPosition.fromRadar(radarString);
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

  // Set up map view

  map.value.fitBounds(mapBounds.value);

  map.value.whenReady(onMapReady);
};

const onMapClick = async (event) => {
  console.log("Function: onMapClick");

  const clickInBounds = L.latLngBounds(mapBounds.value).contains(event.latlng);
  mapClicked.value = true;

  if (store.selectedLocation) {
    // If location currently selected, clear it when map is clicked
    store.selectedLocation = null;
    store.targetedPosition = null;
    store.searchQuery = "";
  } else if (store.targetedPosition && !store.options.dereth.landblockGrid) {
    // ?
    store.targetedPosition = null;
    store.searchQuery = "";
  } else {
    // ?
    if (clickInBounds) {
      console.log("click in bounds!");
      const clickedPosition = globalToPos(event.latlng.lng, event.latlng.lat);

      // await store.reverseGeocode(
      //   `${clickedPosition.coordinates.global.x},${clickedPosition.coordinates.global.y}`
      // );
      store.targetedPosition = clickedPosition;
      store.searchQuery = clickedPosition.coordinates.radar.formatted;
    }
  }
};

const onMapMoveEnd = async () => {
  currentZoom.value = map.value.getZoom();
  console.log(currentZoom.value, "Current zoom: ");

  if (!isInitialLoad.value) {
    //await getVisibleLocations();
  }
};

const onMapMoveStart = (event) => {
  console.log("onMapMoveStart");
  console.log(event);

  if (store.targetedPosition) {
    store.targetedPosition = null;
    store.searchQuery = "";
  }
};

const onMapMouseDown = (event) => {
  console.log("onMapMouseDown");
  mapMouseDown.value = true;
};

const onMapMouseUp = (event) => {
  console.log("onMapMouseUp");
  mapMouseDown.value = false;
};

const onMapMouseMove = (event) => {
  let latlng = event.latlng;

  if (store.options.dereth.landblockGrid) {
    handleLandblockGridHover(latlng);
  }

  store.hoveredPosition = globalToPos(event.latlng.lng, event.latlng.lat);
};

const onMapZoomStart = async (event) => {
  //   store.targetedPosition = null;
  //   store.searchQuery = "";
};

const onMapZoomEnd = async (event) => {
  currentZoom.value = map.value.getZoom();
  //currentZoom.value = currentZoom;

  if (store.options.dereth.landblockGrid) {
    if (currentZoom.value >= 7) {
      layers.grid.landcells.addTo(map.value);
    } else {
      layers.grid.landcells.removeFrom(map.value);
    }
  }
};

const onMapResize = () => {
  console.log("Method: onMapResize");
};

const onMapReady = async () => {
  console.log("Method: mapReady");
  isMapReady.value = true;
  isInitialLoad.value = false;

  // Load data and show map

  renderLandblockGrid();

  lootTiers.features.forEach((feature) => {
    const poly = L.polygon(feature.geometry.coordinates, {
      fillColor: feature.properties.color,
      fillOpacity: 0.8,
      stroke: false,
    });

    layers.lootTiers.addLayer(poly);
  });

  //await getVisibleLocations();

  //   const poly = L.polygon(regionCells.geometry.coordinates, {
  //     fillColor: "orange",
  //     fillOpacity: 0.8,
  //     stroke: false,
  //   });
  //   poly.addTo(map.value);

  // regionCells.features.forEach((feature) => {

  // });

  // spawnTest.features.forEach((feature) => {
  //   const poly = L.polygon(feature.geometry.coordinates, { fillColor: 'orange', fillOpacity: 0.8, stroke: false });
  //   poly.addTo(map.value);
  // });

  //  settlementRegions.features.forEach((feature) => {
  //   const poly = L.polygon(feature.geometry.coordinates, { fillColor: 'orange', fillOpacity: 0.8, stroke: false });
  //   poly.addTo(map.value);
  // });

  store.derethMapLoaded = true;
};

const getVisibleLocations = async () => {
  const currentZoom = map.value.getZoom();
  const currentBoundsPad = map.value.getBounds().pad(0.25);
  const bbox = currentBoundsPad.toBBoxString();
  return store.getLocations(currentZoom, bbox);
};

const onDatabaseUpdate = () => {
  console.log("Method: onMapResize");
};

const renderLandblockGrid = () => {
  console.log("Method: renderLandblockGrid");

  layers.grid.landblocks = L.featureGroup({
    pane: "canvasGrid",
  });
  layers.grid.landcells = L.featureGroup({ pane: "canvasGrid" });

  let borderBounds = [
    [0, 0],
    [mapSize.value, mapSize.value],
  ];

  let borderRect = L.rectangle(borderBounds, {
    color: "#000000",
    weight: 0.8,
    interactive: false,
    pane: "canvasGrid",
    renderer: renderers.canvasGrid,
    fillColor: "transparent",
  });

  let numBlocks = 256;

  let lbSize = mapSize.value / 255;

  let opts = {
    color: "#000000",
    weight: 0.8,
    pane: "canvasGrid",
    renderer: renderers.canvasGrid,
    interactive: false,
  };

  // L.polyline(latlngs, { color: "red" }).addTo(
  //     this.layers.grid.landblocks
  // );

  let cellSize = mapSize.value / 2040;

  let cellOpts = {
    color: "#000000",
    weight: 0.6,
    pane: "canvasGrid",
    renderer: renderers.canvasGrid,
    interactive: false,
    opacity: 0.65,
  };

  for (let i = 1; i < 2040; i++) {
    // vertical
    // // horizontal

    let dist = cellSize * i;
    let latlngsVert = [
      [0, dist],
      [GLOBAL_COORDS_MAX, dist],
    ];
    L.polyline(latlngsVert, cellOpts).addTo(layers.grid.landcells);

    let latlngsHoriz = [
      [dist, 0],
      [dist, GLOBAL_COORDS_MAX],
    ];
    L.polyline(latlngsHoriz, cellOpts).addTo(layers.grid.landcells);
  }

  for (let i = 1; i < 255; i++) {
    // vertical
    // // horizontal

    let dist = lbSize * i;
    let latlngsVert = [
      [0, dist],
      [GLOBAL_COORDS_MAX, dist],
    ];
    L.polyline(latlngsVert, opts).addTo(layers.grid.landblocks);

    let latlngsHoriz = [
      [dist, 0],
      [dist, GLOBAL_COORDS_MAX],
    ];
    L.polyline(latlngsHoriz, opts).addTo(layers.grid.landblocks);
  }

  borderRect.addTo(layers.grid.landblocks);
};

const createLandblockRect = (position, style) => {
  let lbSize = 255;
  let width = mapSize.value / lbSize;
  let height = mapSize.value / lbSize;

  let lbRectSW = [position.landblock.y * width, position.landblock.x * height];
  let lbRectNE = [
    position.landblock.y * width + width,
    position.landblock.x * height + height,
  ];

  let lbRectBounds = [lbRectSW, lbRectNE];

  let styleObj = style || {
    stroke: false,
    interactive: false,
    fillColor: "#fff",
    fillOpacity: 0.2,
  };
  let lbRect = L.rectangle(lbRectBounds, styleObj);

  return lbRect;
};

const createLandcellRect = (position) => {
  const cellLength = CELL_LENGTH;

  let cellRectSW = [
    position.cell.globalY * cellLength,
    position.cell.globalX * cellLength,
  ];
  let cellRectNE = [
    position.cell.globalY * cellLength + cellLength,
    position.cell.globalX * cellLength + cellLength,
  ];

  let cellRectBounds = [cellRectSW, cellRectNE];

  let cellRect = L.rectangle(cellRectBounds, {
    stroke: false,
    interactive: false,
    fillColor: "#000",
    fillOpacity: 0.2,
  });

  return cellRect;
};

const handleLandblockGridHover = (latlng) => {
  let landblockSize = 255;

  console.log(latlng);
  console.log("handle landblock grid over");

  let position;
  try {
    position = globalToPos(latlng.lng, latlng.lat);
  } catch (error) {
    console.log(error);
  }

  let cursorInBounds = L.latLngBounds(mapBounds.value).contains(latlng);

  if (store.options.dereth.landblockGrid && cursorInBounds && position) {
    layers.features.landblockHovered.clearLayers();

    let lbRect = createLandblockRect(position);
    let cellRect = createLandcellRect(position);

    cellRect.bindTooltip(position.objCellIdHex, {
      sticky: true,
      direction: "right",
      className: "landblock-tooltip",
    });

    //.bindTooltip('Landblock ' + lbHex, { permanent: true, direction: 'right', offset: L.point(50,0) }).openTooltip()

    layers.features.landblockHovered.addLayer(lbRect);
    layers.features.landblockHovered.addLayer(cellRect);

    cellRect.openTooltip();
  }

  if (!cursorInBounds || !store.options.dereth.landblockGrid) {
    layers.features.landblockHovered.clearLayers();
  }
};

// const handleSpawnData = () => {
//   console.log("handleSpawnData");
//   const data = store.spawnData;

//   layers.features.spawns.clearLayers();
//   let styleObj = {
//     stroke: false,
//     interactive: false,
//     fillColor: "red",
//     fillOpacity: 0.8,
//   };

//   for (let i = 0; i < data.length; i++) {
//     const objCellId = parseInt(data[i], 16);
//     console.log(objCellId);
//     const position = new ACPosition(objCellId);
//     const lbRect = createLandblockRect(position, styleObj);

//     lbRect.addTo(layers.features.spawns);
//   }
// };

const toggleLayerVisibility = (option, layers) => {
  console.log("toggleLayerVisibility");
  console.log(option);
  if (option) {
    layers.forEach((layer) => layer.addTo(map.value));
  } else {
    layers.forEach((layer) => layer.removeFrom(map.value));
  }
};

// HOOKS

onMounted(() => {
  initMap();
});
</script>

<style scoped>
#dereth-map {
  height: 100%;
  z-index: 50;
  position: relative;
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

  /* background: #a08557 url("@/@/@/assets/img/map-detail-card-bg.png") repeat 0 0; */
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
