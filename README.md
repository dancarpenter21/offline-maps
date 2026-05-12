# Offline Maps

Simple repository to test Leaflet and Cesium on disconnected systems.

## Setup

Install dependencies while connected to the internet:

```sh
npm install
```

After dependencies are installed, the app runs without internet access:

```sh
npm run dev
```

Build the production bundle:

```sh
npm run build
```

## Offline behavior

Both panes use the bundled `public/maps/blue-marble-world.jpg` image instead of
remote map tiles. Leaflet displays it as a full-world image overlay, and Cesium
drapes the same image over an ellipsoid globe with no Cesium Ion token, no online
terrain, and all network-backed widgets disabled.
