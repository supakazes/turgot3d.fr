import { useEffect, useRef, useState } from "react";
import mapboxgl, { type LngLatBoundsLike } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./App.css";

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

      <div
        style={{
          position: "absolute",
          top: 12,
          left: 12,
          background: "white",
          padding: "12px 14px",
          borderRadius: 6,
          fontFamily: "monospace",
          fontSize: 12,
          lineHeight: 1.4,
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          maxWidth: 360,
        }}
      >
        <button
          onClick={toggleLayer}
          style={{ marginTop: 8, padding: "4px 8px", fontSize: 12, cursor: "pointer" }}
        >
          {" "}
          {layerVisible ? "Hide" : "Show"} layer{" "}
        </button>
        <div>
          <b>Permalink</b>:<div style={{ wordBreak: "break-all" }}>{window.location.href}</div>
        </div>

        <div style={{ marginTop: 8 }}>
          <b>Zoom</b>: {zoom}
        </div>
        <div>
          <b>Center</b>: {center[0]}, {center[1]}
        </div>
        <div>
          <b>Bounds</b>:<pre style={{ margin: "4px 0 0" }}>{JSON.stringify(bounds, null, 2)}</pre>
        </div>
      </div>
    </>
  );
}

export default App;
