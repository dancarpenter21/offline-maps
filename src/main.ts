import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Color,
  EllipsoidTerrainProvider,
  Ion,
  Rectangle,
  SingleTileImageryProvider,
  Viewer,
} from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import './style.css';

Ion.defaultAccessToken = '';

const worldImageUrl = '/maps/blue-marble-world.jpg';
const worldBounds = L.latLngBounds([-90, -180], [90, 180]);
const worldRectangle = Rectangle.fromDegrees(-180, -90, 180, 90);

const leafletMap = L.map('leaflet-map', {
  attributionControl: false,
  crs: L.CRS.EPSG4326,
  center: [0, 0],
  zoom: 1,
  minZoom: 1,
  maxZoom: 5,
  maxBounds: worldBounds,
  maxBoundsViscosity: 1,
});

L.imageOverlay(worldImageUrl, worldBounds).addTo(leafletMap);
leafletMap.fitBounds(worldBounds);

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
  new SingleTileImageryProvider({
    url: worldImageUrl,
    rectangle: worldRectangle,
    tileWidth: 5400,
    tileHeight: 2700,
  }),
);

viewer.scene.globe.baseColor = Color.fromCssColorString('#0f2530');
if (viewer.scene.skyAtmosphere) {
  viewer.scene.skyAtmosphere.show = false;
}
viewer.scene.fog.enabled = false;
viewer.scene.globe.enableLighting = false;

viewer.scene.camera.setView({
  destination: worldRectangle,
});
viewer.scene.requestRender();
