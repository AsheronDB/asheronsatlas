import { globalToPos } from '@asherondb/ac-position';
const API_URL_HOST = `http://localhost`;

export default {

    isWindows(state) {
        return state.platform == 'win';
    },

    isMacOS(state) {
        return state.platform == 'mac';
    },

    apiUrlBase(state) {
        const port = state.serverPort || 55436;
        return `${API_URL_HOST}:${port}`;
    }
  // targetedPositionFormatted(state) {

  //     return state.targetedPosition
  // },

    // if (state.locations && state.locations.features) {
    //     console.log('finding selected loc...');
    //     console.log(state.locations);
    //     let newLoc = state.locations.features.find((location) => {
    //     console.log(location.properties.id);
    //     return location.properties.id == state.selectedLocationId
    //   });
    //   console.log('newloc');
    //   console.log(newLoc);
    //   return newLoc;
    // } else {
    //   return null;
    // }

};
