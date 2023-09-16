import Joi from "joi";
import { globalToPos, radarToPos } from "@asherondb/ac-position";

const objCellIdRegExp = /^0x[0-9A-F]{8}$/;
const radarRegExp =
  /^@\d{1,2}(?:\.\d)?[SN],\d{1,2}(?:\.\d)?[EW](?:,\d{1,2}Z)?$/;

const radarSchema = Joi.string().pattern(radarRegExp).required();

const radarPathSchema = Joi.array().length(1).ordered(radarSchema);

const fullPathSchema = Joi.array()
  .length(2)
  .ordered(
    Joi.string()
      .pattern(radarRegExp, { invert: true })
      .pattern(objCellIdRegExp, { invert: true })
      .pattern(/@/, { invert: true })
      .required(),
    radarSchema
  );

const locationIdSchema = Joi.array()
  .length(1)
  .ordered(
    Joi.string()
      .pattern(radarRegExp, { invert: true })
      .pattern(objCellIdRegExp, { invert: true })
      .pattern(/@/, { invert: true })
      .required()
  );

const objCellIdSchema = Joi.array()
  .length(1)
  .ordered(
    Joi.string()
      .pattern(objCellIdRegExp)
      .pattern(radarRegExp, { invert: true })
      .pattern(/@/, { invert: true })
      .required()
  );

const pathSchemas = {
  radar: radarPathSchema,
  locationId: locationIdSchema,
  full: fullPathSchema,
  objCellId: objCellIdSchema,
};

import { useStore } from "@/store";
export default defineNuxtRouteMiddleware((to, from) => {
  console.log("locationPath middleware");
  console.log(to);

  const store = useStore();
  console.log(store);

  if (to.params.locationPath) {
    const validSchema = Object.entries(pathSchemas).filter((entry) =>
      entry[1].validate(to.params.locationPath).error ? false : true
    );

    console.log(validSchema);

    if (validSchema.length > 0) {

      

      const schemaName = validSchema[0][0];
      switch (schemaName) {
        case "radar":

          const radarParts = to.params.locationPath[0].substring(1).split(",");
          // const pos = radarToPos(`${radarParts[0]}, ${radarParts[1]}`);

          // console.log(pos);

          store.locationPathRadar = `${radarParts[0]}, ${radarParts[1]}`;

          if (radarParts[2])
            store.locationPathZoom = parseInt(radarParts[2], 10);

          // if (store.moveMapOnPathChange) {
          //   const latLng = L.latLng([
          //     pos.coordinates.global.y,
          //     pos.coordinates.global.x,
          //   ]);
          //   map.value.setView(latLng);
          // }
          break;
      }
    } else {
      // router.replace({ name: "home", params: { locationPath: [] } });
    }
  }

  // if (to.params.id === '1') {
  //   return abortNavigation()
  // }
  // In a real app you would probably not redirect every route to `/`
  // however it is important to check `to.path` before redirecting or you
  // might get an infinite redirect loop
  // if (to.path !== '/') {
  //   return navigateTo('/')
  // }
});
