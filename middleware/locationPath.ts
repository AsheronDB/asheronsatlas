import { globalToPos, radarToPos } from "@asherondb/ac-position";
import { SELECTED_DATA_TYPES } from "@/common/constants";
import { LocationDataTypes } from '@/common/enums';

const coordPathRegExp = new RegExp(
  /^@\d{1,2}(?:\.\d)?[SN],\d{1,2}(?:\.\d)?[EW](?:,\d{1,2}Z)?$/,
  "i"
);
const radarRegExp = new RegExp(
  /^\d{1,2}(?:\.\d)?[SN],\d{1,2}(?:\.\d)?[EW]$/,
  "i"
);
const objCellIdRegExp = new RegExp(/^0x[0-9A-F]{8}$/, "i");

import { useStore } from "@/store";

export default defineNuxtRouteMiddleware((to, from) => {
  console.log("locationPath middleware");
  console.log(to);

  const store = useStore();

  if (to.params.locationPath) {

    if (coordPathRegExp.test(to.params.locationPath[0])) {
      // First item is @coords
      // Replace path to erase everything after this item
      // Set locationPathCoords store item
      // Set locationPathZoom store item

      console.log('FIRST ITEM IS @COORDS');
      const coordsParts = to.params.locationPath[0].substring(1).split(",")
      store.locationPathCoords = `${coordsParts[0]}, ${coordsParts[1]}`;
      if (coordsParts[2]) store.locationPathZoom = parseInt(coordsParts[2], 10);

    } else if (radarRegExp.test(to.params.locationPath[0])) {
      // First item is regular coords

      // Set detail panel enum type to 'coords'

      const formattedCoords = to.params.locationPath[0].substring(1).split(",").join(", ");
      store.searchQuery = formattedCoords;
      store.selectedData = {
        type: LocationDataTypes.Coords,
        position: to.params.locationPath[0];
      }

      // Check second item

      if (coordPathRegExp.test(to.params.locationPath[1])) {
        // Second item is @coords
        // Replace path to erase everything after SECOND item

        const coordsParts = to.params.locationPath[1].substring(1).split(",");
        store.locationPathCoords = `${coordsParts[0]}, ${coordsParts[1]}`;
        if (coordsParts[2])
          store.locationPathZoom = parseInt(coordsParts[2], 10);

      
      } else {
        // Second item is NOT @coords
        // Replace path to erase everything after FIRST item

      }
    } else if (objCellIdRegExp.test(to.params.locationPath[0])) {
      // First item is objCellID

      store.searchQuery = to.params.locationPath[0];

      store.selectedData = {
        type: LocationDataTypes.ObjCellId,
        position: to.params.locationPath[0]
      }
      // store.detailPanelData = to.params.locationPath[0];

      // Check second item

      if (coordPathRegExp.test(to.params.locationPath[1])) {
        // Second item is @coords
        // Replace path to erase everything after SECOND item

        const coordsParts = to.params.locationPath[1].substring(1).split(",");
        store.locationPathCoords = `${coordsParts[0]}, ${coordsParts[1]}`;
        if (coordsParts[2])
          store.locationPathZoom = parseInt(coordsParts[2], 10);

      
      } else {
        // Second item is NOT @coords
        // Replace path to erase everything after FIRST item

      }
    } else {
      // Assume it's a location ID

      store.selectedDataType = SELECTED_DATA_TYPES.LOCATION;
      store.selectedData = to.params.locationPath[0];
      store.searchQuery = to.params.locationPath[0];

      console.log('ASSUME LOCATION ID')

      // Perform location ID validation here to check if it's valid or proceed and let the component handle the validation in a useAsyncData call

      
      

      // Check second item

      if (coordPathRegExp.test(to.params.locationPath[1])) {
        // Second item is @coords
        // Replace path to erase everything after SECOND item

        const coordsParts = to.params.locationPath[1].split(",").join(", ");
        store.locationPathCoords = `${coordsParts[0]}, ${coordsParts[1]}`;
        if (coordsParts[2])
          store.locationPathZoom = parseInt(coordsParts[2], 10);

      
      } else {
        // Second item is NOT @coords
        // Replace path to erase everything after FIRST item

     
      }
    }
  }
});
