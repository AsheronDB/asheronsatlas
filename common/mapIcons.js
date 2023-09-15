import L from "leaflet";

import MarkerIcon from "@/assets/img/map/icons/map-marker.png";
// import LifestoneIcon from "@/assets/img/map/icons/Lifestone_Marker_Icon.png";
// import TownIcon from "@/assets/img/map/icons/town-icon-test.png";
// import PoiIcon from "@/assets/img/map/icons/map-poi-test3.png";
// import VendorIcon from "@/assets/img/map/icons/map-icon-npc.png";
// import PortalIcon from "@/assets/img/map/icons/Lifestone_Portal_Icon.png";
// import OutpostIcon from "@/assets/img/map/icons/map-point-outpost.png";
// import DungeonIcon from "@/assets/img/map/icons/map-point-gharu-town.png";
// import HousingIcon from "@/assets/img/map/icons/house-icon.png";

import SettlementIcon from "@/assets/img/map/icons/Map_Point_Via_Town.png";
import MapPointTestIcon from "@/assets/img/map/icons/Map_Point_Large.png";
import MapMarkerPurpleIcon from "@/assets/img/map/icons/map-marker-purple.png";

// import VendorIcon from "@/assets/img/map/icons/map-icon-npc.png";


import TownAluvianIcon from "@/assets/img/map/icons2/Map_Point_Aluv_Town.png";
import TownGharuIcon from "@/assets/img/map/icons2/Map_Point_Gharu_Town.png";
import TownShoIcon from "@/assets/img/map/icons2/Map_Point_Aluv_Town.png";
import TownViamontIcon from "@/assets/img/map/icons2/Map_Point_Via_Town.png";
import OutpostIcon from "@/assets/img/map/icons2/Map_Point_Town.png";

import BindstoneIcon from "@/assets/img/map/icons2/Map_Point_Bindstone.png";


//import PortalIcon from "@/assets/img/map/icons2/Map_Point_PortLrg.png";


import DungeonIcon from "@/assets/img/map/icons2/Map_Point_Dungeon.png";


import PortalIcon from "@/assets/img/map/icons/Lifestone_Portal_Icon.png";
//import LifestoneIcon from "@/assets/img/map/icons2/Map_Point_LS.png";

//import LifestoneIcon from "@/assets/img/map/icons2/Map_Point_Lifestone_2.png";
import LifestoneIcon from "@/assets/img/map/icons/Lifestone_Marker_Icon.png";



import PoiIcon from "@/assets/img/map/icons2/Map_Point_Large.png";
import HousingIcon from "@/assets/img/map/icons2/Map_Point_Cottage.png";

//import VendorIcon from "@/assets/img/map/icons2/Map_Point_NPC.png";

import VendorIcon from "@/assets/img/map/icons/map-icon-npc.png";

// export const town = L.icon({
//   iconUrl: TownIcon,
//   iconSize: [14, 14], // size of the icon
//   iconAnchor: [7, 7], // point of the icon which will correspond to marker's location
//   popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
//   tooltipAnchor: [12, 0], // point from which the popup should open relative to the iconAnchor
// });

export const townAluvian = L.icon({
  iconUrl: TownAluvianIcon,
  iconSize: [14, 14], // size of the icon
  iconAnchor: [7, 7], // point of the icon which will correspond to marker's location
  popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
  tooltipAnchor: [12, 0], // point from which the popup should open relative to the iconAnchor
});

export const townGharu = L.icon({
  iconUrl: TownGharuIcon,
  iconSize: [14, 14], // size of the icon
  iconAnchor: [7, 7], // point of the icon which will correspond to marker's location
  popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
  tooltipAnchor: [12, 0], // point from which the popup should open relative to the iconAnchor
});

export const townViamont = L.icon({
  iconUrl: TownViamontIcon,
  iconSize: [14, 14], // size of the icon
  iconAnchor: [7, 7], // point of the icon which will correspond to marker's location
  popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
  tooltipAnchor: [12, 0], // point from which the popup should open relative to the iconAnchor
});

export const townSho = L.icon({
  iconUrl: TownShoIcon,
  iconSize: [14, 14], // size of the icon
  iconAnchor: [7, 7], // point of the icon which will correspond to marker's location
  popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
  tooltipAnchor: [12, 0], // point from which the popup should open relative to the iconAnchor
});

export const outpost = L.icon({
    iconUrl: OutpostIcon,
    iconSize: [12, 12], // size of the icon
    iconAnchor: [6, 6], // point of the icon which will correspond to marker's location
    popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
    tooltipAnchor: [12, 0], // point from which the popup should open relative to the iconAnchor
  });

export const marker = L.icon({
  iconUrl: MarkerIcon,
  iconSize: [20, 20], // size of the icon
  iconAnchor: [10, 10], // point of the icon which will correspond to marker's location
  popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
  tooltipAnchor: [3, -1],
});

export const lifestone = L.icon({
  iconUrl: LifestoneIcon,
  iconSize: [48, 48], // size of the icon
  iconAnchor: [24, 24], // point of the icon which will correspond to marker's location
  tooltipAnchor: [8, 0], // point from which the popup should open relative to the iconAnchor
});

export const bindstone = L.icon({
    iconUrl: BindstoneIcon,
    iconSize: [42, 42], // size of the icon
    iconAnchor: [21, 21], // point of the icon which will correspond to marker's location
    tooltipAnchor: [8, 0], // point from which the popup should open relative to the iconAnchor
  });

export const poi = L.icon({
  iconUrl: PoiIcon,
  iconSize: [18, 18], // size of the icon
  iconAnchor: [9, 9], // point of the icon which will correspond to marker's location
  popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
  tooltipAnchor: [12, 0], // point from which the popup should open relative to the iconAnchor
});

export const vendor = L.icon({
  iconUrl: VendorIcon,
  iconSize: [24, 30], // size of the icon
  iconAnchor: [12, 15], // point of the icon which will correspond to marker's location
  popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
  tooltipAnchor: [12, 0], // point from which the popup should open relative to the iconAnchor
});

export const portal = L.icon({
  iconUrl: PortalIcon,
  iconSize: [30, 30], // size of the icon
  iconAnchor: [15, 15], // point of the icon which will correspond to marker's location
  popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
  tooltipAnchor: [12, 0], // point from which the popup should open relative to the iconAnchor
});



export const dungeon = L.icon({
  iconUrl: DungeonIcon,
  iconSize: [12, 11], // size of the icon
  iconAnchor: [6, 5.5], // point of the icon which will correspond to marker's location
  popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
  tooltipAnchor: [12, 0], // point from which the popup should open relative to the iconAnchor
});
export const housing = L.icon({
  iconUrl: HousingIcon,
  iconSize: [12, 12], // size of the icon
  iconAnchor: [6, 6], // point of the icon which will correspond to marker's location
  popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
  tooltipAnchor: [12, 0], // point from which the popup should open relative to the iconAnchor
});
export const settlement = L.icon({
  iconUrl: SettlementIcon,
  iconSize: [12, 12], // size of the icon
  iconAnchor: [6, 6], // point of the icon which will correspond to marker's location
  popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
  tooltipAnchor: [12, 0], // point from which the popup should open relative to the iconAnchor
});

// export default {

//   outpost: L.icon({
//     iconUrl: OutpostIcon,
//     iconSize: [12, 12], // size of the icon
//     iconAnchor: [6, 6], // point of the icon which will correspond to marker's location
//     popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
//     tooltipAnchor: [12, 0], // point from which the popup should open relative to the iconAnchor
//   }),
//   dungeon: L.icon({
//     iconUrl: DungeonIcon,
//     iconSize: [14, 14], // size of the icon
//     iconAnchor: [7, 7], // point of the icon which will correspond to marker's location
//     popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
//     tooltipAnchor: [12, 0], // point from which the popup should open relative to the iconAnchor
//   }),
//   housing: L.icon({
//     iconUrl: HousingIcon,
//     iconSize: [12, 12], // size of the icon
//     iconAnchor: [6, 6], // point of the icon which will correspond to marker's location
//     popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
//     tooltipAnchor: [12, 0], // point from which the popup should open relative to the iconAnchor
//   }),
//   settlement: L.icon({
//     iconUrl: SettlementIcon,
//     iconSize: [12, 12], // size of the icon
//     iconAnchor: [6, 6], // point of the icon which will correspond to marker's location
//     popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
//     tooltipAnchor: [12, 0], // point from which the popup should open relative to the iconAnchor
//   }),
//   mapPointTest: L.icon({
//     iconUrl: MapPointTestIcon,
//     iconSize: [12, 12], // size of the icon
//     iconAnchor: [6, 6], // point of the icon which will correspond to marker's location
//     popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
//     tooltipAnchor: [12, 0], // point from which the popup should open relative to the iconAnchor
//   }),
//   mapMarkerPurple: L.icon({
//     iconUrl: MapMarkerPurpleIcon,
//     iconSize: [14, 20], // size of the icon
//     iconAnchor: [7, 20], // point of the icon which will correspond to marker's location
//     popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
//     tooltipAnchor: [12, 0], // point from which the popup should open relative to the iconAnchor
//   }),
// };

//
//
// gharuTown: L.icon({
//     iconUrl: require('~assets/img/map/icons/map-point-gharu-town.png'),
//     iconSize: [20, 20], // size of the icon
//     iconAnchor: [10, 15], // point of the icon which will correspond to marker's location
//     popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
// }),
// aluvianTown: L.icon({
//     iconUrl: require('~assets/img/map/icons/map-point-aluv-town.png'),
//     iconSize: [20, 20], // size of the icon
//     iconAnchor: [10, 15], // point of the icon which will correspond to marker's location
//     popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
// }),
// shoTown: L.icon({
//     iconUrl: require('~assets/img/map/icons/Map_Point_Sho_Town.png'),
//     iconSize: [20, 20], // size of the icon
//     iconAnchor: [10, 15], // point of the icon which will correspond to marker's location
//     popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
// }),
// viamontTown: L.icon({
//     iconUrl: require('~assets/img/map/icons/Map_Point_Via_Town.png'),
//     iconSize: [20, 20], // size of the icon
//     iconAnchor: [10, 15], // point of the icon which will correspond to marker's location
//     popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
// }),
// town: L.icon({
//     iconUrl: require('~assets/img/map/icons/map-point-aluv-town.png'),
//     iconSize: [15, 15], // size of the icon
//     iconAnchor: [5, 5], // point of the icon which will correspond to marker's location
//     popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
// }),
// 'landmark': L.icon({
//     iconUrl: require('~assets/img/map/icons/map-point-large.png'),
//     iconSize: [20, 20], // size of the icon
//     iconAnchor: [10, 10], // point of the icon which will correspond to marker's location
//     popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
//     tooltipAnchor: [4, 0]
// }),
//
//
//
// 'portal': L.icon({
//     iconUrl: require('~assets/img/map/icons/Map_Point_Portal.png'),
//     iconSize: [35, 35], // size of the icon
//     iconAnchor: [17, 17], // point of the icon which will correspond to marker's location
//     tooltipAnchor: [8, 0] // point from which the popup should open relative to the iconAnchor
// }),
// 'npc': L.icon({
//     iconUrl: require('~assets/img/map/icons/map-icon-npc.png'),
//     iconSize: [40, 40], // size of the icon
//     iconAnchor: [20, 20], // point of the icon which will correspond to marker's location
//     tooltipAnchor: [3, 0] // point from which the popup should open relative to the iconAnchor
// })
//
