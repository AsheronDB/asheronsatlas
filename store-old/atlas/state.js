export default () => {
  return {
    platform: undefined,
    serverPort: undefined,
    spawnData: undefined,
    locations: undefined,
    sidebarVisible: true,
    hoveredPosition: null,
    targetedReverseGeocode: null,
    selectedLocation: null,
    targetedPosition: undefined,
    searchIndex: undefined,
    searchQuery: "",
    searchResults: [],
    derethMapLoaded: false,
    options: {
      window: {
        maximized: false,
      },
      dereth: {
        layers: {
          landscapeObjects: true,
          impassableTerrain: false,
          developmentRegions: false,
        },
        landblockGrid: false,
      },
      enableMarkers: true,
    },
  };
};
