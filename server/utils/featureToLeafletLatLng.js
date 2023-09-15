import { coordEach, clone } from '@turf/turf';

export default (feature) => {
  const clonedFeature = clone(feature);
  coordEach(clonedFeature, (coords) => {
    const [x, y] = coords;
    coords.length = 0;
    coords[0] = y;
    coords[1] = x;
  });
  return clonedFeature;
};