export default () => {
  return {
    searchQuery: "",
    searchTerm: "",
    platform: undefined,
    spawnData: undefined,
    locations: undefined,
    sidebarVisible: true,
    hoveredPosition: null,
    targetedReverseGeocode: null,
    targetedZoom: null,
    selectedLocation: null,
    targetedPosition: undefined,
    moveMapOnPathChange: true,
    searchIndex: undefined,
    searchQuery: "",
    searchResults: [],
    derethMapLoaded: false,
    locationPathRadar: null,
    locationPathZoom: null,
    locationPathObjCellId: null,
    maps: {
      dereth: {
        zoom: null,
        center: null
      },
    },
    options: {
      window: {
        maximized: false,
      },
      dereth: {
        layers: {
          lootTiers: false,
          impassableTerrain: false,
          landscapeObjects: true,
          developmentRegions: false,
        },
        landblockGrid: false,
      },
      enableMarkers: true,
    },
  };
};
