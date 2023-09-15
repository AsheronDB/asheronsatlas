import { point, booleanPointInPolygon } from "@turf/turf";

export default async (pointData) => {

   const db = openDatabase();

   console.log('reverse geocoding');  

   const queryStatement = db.prepare(`SELECT data, json_extract(data, '$.properties.type') as type FROM locations WHERE type = ?`)

   const regionsQuery = queryStatement.all('region');

   console.log(regionsQuery);

  const regions = regionsQuery.map(region => JSON.parse(region.data));

  const geocoded = regions
    .filter((feature) => booleanPointInPolygon(point(pointData), feature))
    .map((feature) => feature.properties.name);

    console.log(geocoded);

  return geocoded
};
