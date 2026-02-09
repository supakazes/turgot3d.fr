import { useEffect, useRef, useState } from "react";
import mapboxgl, { type LngLatBoundsLike } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./App.css";
import { DebugPanel } from "./components/DebugPanel";

const DEBUG_LAYER_ID = "verniquet rasters";
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

function getInitialCamera() {
  const sp = new URLSearchParams(window.location.search);

  if (!sp.has("lng") || !sp.has("lat") || !sp.has("z")) {
    return {
      center: [2.3522, 48.8566] as [number, number],
      zoom: 15, // buildings visible
    };
  }

  const lng = Number(sp.get("lng"));
  const lat = Number(sp.get("lat"));
  const z = Number(sp.get("z"));

  if (!Number.isFinite(lng) || !Number.isFinite(lat) || !Number.isFinite(z)) {
    return {
      center: [2.3522, 48.8566] as [number, number],
      zoom: 15,
    };
  }

  return {
    center: [lng, lat] as [number, number],
    zoom: Math.max(z, 14), // prevent space view
  };
}

function App() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const [layerVisible, setLayerVisible] = useState(true);

  const [zoom, setZoom] = useState(0);
  const [center, setCenter] = useState<[number, number]>([0, 0]);
  const [bounds, setBounds] = useState<LngLatBoundsLike | null>(null);

  const toggleLayer = () => {
    const map = mapInstance.current;
    if (!map || !map.getLayer(DEBUG_LAYER_ID)) return;

    const next = !layerVisible;
    map.setLayoutProperty(DEBUG_LAYER_ID, "visibility", next ? "visible" : "none");
    setLayerVisible(next);
  };

  useEffect(() => {
    if (!mapRef.current) return;

    const initial = getInitialCamera();

    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/kazes/cmlcggm7c002701r33d1saasz",
      center: initial.center,
      zoom: initial.zoom,
    });

    mapInstance.current = map;
    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    const updateDebugState = () => {
      setZoom(Number(map.getZoom().toFixed(2)));
      setCenter([Number(map.getCenter().lng.toFixed(5)), Number(map.getCenter().lat.toFixed(5))]);
      setBounds(map.getBounds()?.toArray() ?? null);
    };

    const updateUrl = () => {
      const c = map.getCenter();
      const z = map.getZoom();

      const sp = new URLSearchParams(window.location.search);
      sp.set("lng", c.lng.toFixed(5));
      sp.set("lat", c.lat.toFixed(5));
      sp.set("z", z.toFixed(2));

      const newUrl = `${window.location.pathname}?${sp.toString()}${window.location.hash}`;
      window.history.replaceState(null, "", newUrl);
    };

    map.on("load", () => {
      updateDebugState();
      updateUrl();
    });

    map.on("move", updateDebugState);
    map.on("moveend", updateUrl);

    return () => map.remove();
  }, []);

  return (
    <>
      <div ref={mapRef} style={{ width: "100vw", height: "100vh" }} />
      <DebugPanel
        layerVisible={layerVisible}
        toggleLayer={toggleLayer}
        zoom={zoom}
        center={center}
        bounds={bounds}
      />
    </>
  );
}

export default App;
