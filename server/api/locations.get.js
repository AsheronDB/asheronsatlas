import { DERETH_MAP_MAX_ZOOM, DERETH_MAP_MIN_ZOOM } from "@/common/constants";

const LOCATION_CATEGORIES = {
  LIFESTONE: "lifestone",
  DUNGEON: "dungeon",
  VENDOR: "vendor",
  NPC: "npc",
  PORTAL: "portal",
  SETTLEMENT: "settlement",
  HOUSE: "house",
  TOWN: "town",
};

const LOCATION_SUBCATEGORIES = {
  MANSION: "mansion",
  COTTAGE: "cottage",
  VILLA: "villa",
};

const CATEGORY_ZOOM_LEVELS = {};

function getZoomCategories(zoom) {
  let categories = [];

  if (zoom >= 4 && zoom <= DERETH_MAP_MAX_ZOOM) {
    categories = [...categories, LOCATION_CATEGORIES.DUNGEON];
  }

  if (zoom >= 5 && zoom <= DERETH_MAP_MAX_ZOOM) {
    categories = [
      ...categories,
      LOCATION_CATEGORIES.LIFESTONE,
      LOCATION_CATEGORIES.PORTAL,
      LOCATION_CATEGORIES.BINDSTONE,
    ];
  }

  if (zoom >= 6 && zoom <= DERETH_MAP_MAX_ZOOM) {
    categories = [
      ...categories,
      LOCATION_CATEGORIES.VENDOR,
      LOCATION_CATEGORIES.NPC,
    ];
  }

  if (zoom >= 4 && zoom <= 7) {
    categories = [...categories, LOCATION_CATEGORIES.SETTLEMENT];
  }

  if (zoom > 7 && zoom <= DERETH_MAP_MAX_ZOOM) {
    categories = [...categories, LOCATION_CATEGORIES.HOUSE];
  }

  if (zoom >= DERETH_MAP_MIN_ZOOM && zoom <= 7) {
    categories = [...categories, LOCATION_CATEGORIES.TOWN];
  }

  return categories;
}

export default defineEventHandler(async (event) => {

  console.log("LOCATIONS GET ROUTE");

  const nitroDb = await useStorage('db');
  console.log(nitroDb);


  const query = getQuery(event);

  if (!query) return false;

  const db = openDatabase();

  const bbox = query.bbox.split(",").map((point) => parseFloat(point));
  const validZoomCategories = getZoomCategories(query.zoom);

  console.log(validZoomCategories);

  const dbQuery = db.prepare(
    `SELECT loc_id, data, json_extract(data, '$.properties.type') as type, json_extract(data, '$.geometry.type') as geometryType, CAST(json_extract(data, '$.geometry.coordinates[0]') as decimal) as x, CAST(json_extract(data, '$.geometry.coordinates[1]') as decimal) as y, json_extract(data, '$.properties.category') as category FROM locations WHERE type = @type AND geometryType = @geometryType AND (x >= @x1 AND x <= @x2 AND y >= @y1 AND y <= @y2 AND category IN (@zoomCategories))`
  );

  const locationsQuery = dbQuery.all({
    type: "location",
    geometryType: "Point",
    x1: bbox[0],
    x2: bbox[2],
    y1: bbox[1],
    y2: bbox[3],
    zoomCategories: validZoomCategories.join("', '")
  });

  console.log(locationsQuery);

  const locations = locationsQuery.map((location) => {
    let data;
    try {
      data = JSON.parse(location.data);
    } catch (error) {
      console.log(location);
      console.log(error);
    }
    return data;
  });

  let filteredLocations = locations;

  filteredLocations = filteredLocations.map((location) =>
    convertFeature(location)
  );

  return filteredLocations;
});
