/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// Normalizes the coords that tiles repeat across the x axis (horizontally)
// like the standard Google map tiles.
function getNormalizedCoord(coord, zoom) {
  const y = coord.y;
  let x = coord.x;

  // tile range in one direction range is dependent on zoom level
  // 0 = 1 tile, 1 = 2 tiles, 2 = 4 tiles, 3 = 8 tiles, etc
  const tileRange = 1 << zoom;

  // don't repeat across y-axis (vertically)
  if (y < 0 || y >= tileRange) {
    return null;
  }

  // repeat across x-axis
  if (x < 0 || x >= tileRange) {
    return null;
  }

  return { x: x, y: y };
}

function initMap(): void {
  const map = new google.maps.Map(
    document.getElementById('map') as HTMLElement,
    {
      center: { lat: 50, lng: 50 },
      zoom: 2,
      streetViewControl: false,
      mapTypeControl: true,
      mapTypeControlOptions: {
        mapTypeIds: ['iv'],
      },
    }
  );

  const IVMapType = new google.maps.ImageMapType({
    getTileUrl: function (coord, zoom): string {
      const normalizedCoord = getNormalizedCoord(coord, zoom);

      if (!normalizedCoord) {
        return '';
      }

      const bound = Math.pow(2, zoom);
      return (
        'https://cdn.ouranosstudios.com/iv-map' +
        '/' +
        zoom +
        '/tile_' +
        normalizedCoord.x +
        '_' +
        //(bound - normalizedCoord.y - 1) +
        normalizedCoord.y +
        '.png'
      );
    },
    tileSize: new google.maps.Size(256, 256),
    maxZoom: 5,
    minZoom: 0,
    // @ts-ignore TODO 'radius' does not exist in type 'ImageMapTypeOptions'
    radius: 1738000,
    name: 'GTA IV',
  });
  const VMapType = new google.maps.ImageMapType({
    getTileUrl: function (coord, zoom): string {
      const normalizedCoord = getNormalizedCoord(coord, zoom);

      if (!normalizedCoord) {
        return '';
      }

      const bound = Math.pow(2, zoom);
      return (
        'https://cdn.ouranosstudios.com/atlas' +
        '/' +
        zoom +
        '_' +
        normalizedCoord.x +
        '_' +
        //(bound - normalizedCoord.y - 1) +
        normalizedCoord.y +
        '.png'
      );
    },
    tileSize: new google.maps.Size(256, 256),
    maxZoom: 7,
    minZoom: 3,
    // @ts-ignore TODO 'radius' does not exist in type 'ImageMapTypeOptions'
    radius: 1738000,
    name: 'GTA V',
  });

  map.mapTypes.set('iv', IVMapType);
  map.mapTypes.set('v', VMapType);
  map.setMapTypeId('iv');
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
export {};
