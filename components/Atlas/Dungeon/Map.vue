<template>
  <div id="dereth-map">
    <div id="map-container" ref="mapContainer"></div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, toRaw } from "vue";
import L from "leaflet";
import { orderBy, debounce } from "lodash";

import { useAtlasStore } from "@/store/atlas";
const atlasStore = useAtlasStore();

// import { Position } from "@/classes";

import { ACPosition } from "@asherondb/ac-position";

const mapContainer = ref();
let isInitialLoad = ref(true);
let isMapReady = ref(false);
let map = ref(null);

// METHODS

const initMap = () => {
  console.log("Method: initMap");

  // dimensions of the image
  const w = 679;
  const h = 1983;
  const url = "http://kempe.net/images/newspaper-big.jpg";

  const mapCenter = [w / 2, h / 2];

  let mapOptions = {
    crs: L.CRS.Simple,
    minZoom: 0,
    maxZoom: 10,
    boxZoom: false,
    zoomControl: false,
    center: mapCenter,
    attributionControl: false,
    maxBoundsViscosity: 0.5,
    zoomSnap: 0.25,
    // zoomDelta: 0.2
  };

  // CREATE MAP
  map.value = L.map(mapContainer.value, mapOptions);

  const mapBuffer = 100;

  // calculate the edges of the image, in coordinate space
  var southWest = map.value.unproject([0, h], map.value.getMaxZoom() - 1);
  var northEast = map.value.unproject([w, 0], map.value.getMaxZoom() - 1);
  var bounds = new L.LatLngBounds(southWest, northEast);

  var southWestMax = map.value.unproject(
    [0 - mapBuffer, h + mapBuffer],
    map.value.getMaxZoom() - 1
  );
  var northEastMax = map.value.unproject(
    [w + mapBuffer, 0 - mapBuffer],
    map.value.getMaxZoom() - 1
  );
  var maxBounds = new L.LatLngBounds(southWestMax, northEastMax);

  // add the image overlay,
  // so that it covers the entire map
  L.imageOverlay("./public/dungeon-maps/01E9.gif", bounds).addTo(map.value);

  // tell leaflet that the map is exactly as big as the image
  map.value.setMaxBounds(maxBounds);




  map.value.fitBounds(bounds);


  const currZoom = map.value.getZoom();
  map.value.setMinZoom(currZoom);

  L.rectangle(maxBounds).addTo(map.value);

  // ------------------------------------------------------------------------------

  // MAP CONTROLS

  L.control
    .zoom({
      position: "bottomright",
    })
    .addTo(map.value);

  //map.value.whenReady(onMapReady);

  map.value.on("zoomend", onMapZoomEnd);

};

const onMapZoomEnd = (event) => {
  let zoom = map.value.getZoom();
  //currentZoom.value = currentZoom;
    console.log(zoom);
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
  flex: 1 1 auto;
}

#map-container {
  height: 100%;
  background: var(--tw-color-slate-700);
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
