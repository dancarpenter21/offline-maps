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

The Leaflet pane uses a local canvas grid layer instead of remote map tiles. The
Cesium pane uses generated coordinate imagery with ellipsoid terrain, no Cesium
Ion token, no online terrain, and all network-backed widgets disabled.
