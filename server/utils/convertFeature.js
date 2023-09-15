import { globalToPos } from "@asherondb/ac-position";

export default (location) => {
  console.log(location);
  if (location.properties.type == "location") {
    location.properties.position = globalToPos(
      location.geometry.coordinates[0],
      location.geometry.coordinates[1]
    );
  }
  return featureToLeafletLatLng(location);
};
