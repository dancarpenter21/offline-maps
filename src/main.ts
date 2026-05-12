import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  ArcType,
  Cartesian3,
  Color,
  EllipsoidTerrainProvider,
  GeographicTilingScheme,
  Ion,
  Rectangle,
  TileCoordinatesImageryProvider,
  Viewer,
} from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import './style.css';

Ion.defaultAccessToken = '';

const leafletMap = L.map('leaflet-map', {
  attributionControl: false,
  center: [0, 0],
  zoom: 2,
  minZoom: 1,
  maxZoom: 6,
  worldCopyJump: true,
});

class OfflineGridLayer extends L.GridLayer {
  createTile(coords: L.Coords): HTMLCanvasElement {
    const tile = document.createElement('canvas');
    const size = this.getTileSize();
    const width = size.x;
    const height = size.y;

    tile.width = width;
    tile.height = height;

    const ctx = tile.getContext('2d');
    if (!ctx) {
      return tile;
    }

    const hue = (coords.x * 29 + coords.y * 17 + coords.z * 41) % 360;
    ctx.fillStyle = `hsl(${hue}, 45%, 18%)`;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = `hsl(${(hue + 35) % 360}, 50%, 25%)`;
    ctx.fillRect(0, 0, width, height / 2);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, width - 2, height - 2);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    for (let i = 1; i < 4; i += 1) {
      const position = (width / 4) * i;
      ctx.beginPath();
      ctx.moveTo(position, 0);
      ctx.lineTo(position, height);
      ctx.moveTo(0, position);
      ctx.lineTo(width, position);
      ctx.stroke();
    }

    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = '600 18px system-ui, sans-serif';
    ctx.fillText(`z${coords.z} / x${coords.x} / y${coords.y}`, 16, 34);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.68)';
    ctx.font = '13px system-ui, sans-serif';
    ctx.fillText('Offline generated tile', 16, 58);

    return tile;
  }
}

new OfflineGridLayer({
  tileSize: 256,
  noWrap: false,
}).addTo(leafletMap);

L.control
  .scale({
    imperial: false,
    metric: true,
  })
  .addTo(leafletMap);

const viewer = new Viewer('cesium-container', {
  animation: false,
  baseLayerPicker: false,
  fullscreenButton: false,
  geocoder: false,
  homeButton: false,
  infoBox: false,
  navigationHelpButton: false,
  sceneModePicker: false,
  selectionIndicator: false,
  timeline: false,
  vrButton: false,
  terrainProvider: new EllipsoidTerrainProvider(),
  baseLayer: false,
  requestRenderMode: true,
  scene3DOnly: true,
});

viewer.imageryLayers.addImageryProvider(
  new TileCoordinatesImageryProvider({
    color: Color.WHITE,
    tilingScheme: new GeographicTilingScheme(),
    tileWidth: 256,
    tileHeight: 256,
  }),
);

viewer.scene.globe.baseColor = Color.fromCssColorString('#0f2530');
if (viewer.scene.skyAtmosphere) {
  viewer.scene.skyAtmosphere.show = false;
}
viewer.scene.fog.enabled = false;
viewer.scene.globe.enableLighting = false;
viewer.camera.setView({
  destination: Cartesian3.fromDegrees(-25, 20, 18_000_000),
});

viewer.entities.add({
  name: 'Equator',
  polyline: {
    positions: Cartesian3.fromDegreesArray([-180, 0, 180, 0]),
    width: 2,
    material: Color.CYAN.withAlpha(0.85),
    arcType: ArcType.NONE,
  },
});

viewer.entities.add({
  name: 'Prime Meridian',
  polyline: {
    positions: Cartesian3.fromDegreesArray([0, -90, 0, 90]),
    width: 2,
    material: Color.YELLOW.withAlpha(0.85),
    arcType: ArcType.NONE,
  },
});

viewer.scene.camera.setView({
  destination: Rectangle.fromDegrees(-180, -90, 180, 90),
});
viewer.scene.requestRender();
