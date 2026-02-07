import { useEffect, useRef, useState } from "react";
import mapboxgl, { type LngLatBoundsLike } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./App.css";

const DEBUG_LAYER_ID = "verniquet rasters";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

function App() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);

  const [zoom, setZoom] = useState(0);
  const [center, setCenter] = useState<[number, number]>([0, 0]);
  const [bounds, setBounds] = useState<LngLatBoundsLike | null>(null);
  const [bearing, setBearing] = useState(0);
  const [pitch, setPitch] = useState(0);
  const [layerVisible, setLayerVisible] = useState(true);

  const toggleLayer = () => {
    const map = mapInstance.current;
    if (!map || !map.getLayer(DEBUG_LAYER_ID)) return;

    const next = !layerVisible;
    map.setLayoutProperty(DEBUG_LAYER_ID, "visibility", next ? "visible" : "none");
    setLayerVisible(next);
  };

  useEffect(() => {
    if (!mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/kazes/cmlcggm7c002701r33d1saasz",
      center: [2.3522, 48.8566],
      zoom: 11,
    });

    mapInstance.current = map;
    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    const updateState = () => {
      setZoom(Number(map.getZoom().toFixed(2)));
      setCenter([Number(map.getCenter().lng.toFixed(5)), Number(map.getCenter().lat.toFixed(5))]);
      const mapBounds = map.getBounds();
      setBounds(mapBounds ? mapBounds.toArray() : null);
      setBearing(Number(map.getBearing().toFixed(1)));
      setPitch(Number(map.getPitch().toFixed(1)));
    };

    map.on("load", () => {
      updateState();

      console.log(map.getStyle().layers?.map((l) => l.id));

      // ensure initial visibility state
      if (map.getLayer(DEBUG_LAYER_ID)) {
        map.setLayoutProperty(DEBUG_LAYER_ID, "visibility", layerVisible ? "visible" : "none");
      }
    });
    map.on("move", updateState);

    return () => map.remove();
  }, []);

  return (
    <>
      <div ref={mapRef} style={{ width: "100vw", height: "100vh" }} />

      {/* Debug panel */}
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
          maxWidth: 320,
        }}
      >
        <button
          onClick={toggleLayer}
          style={{
            marginTop: 8,
            padding: "4px 8px",
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          {layerVisible ? "Hide" : "Show"} layer
        </button>

        <div>
          <b>Zoom</b>: {zoom}
        </div>
        <div>
          <b>Center</b>: {center[0]}, {center[1]}
        </div>
        <div>
          <b>Bearing</b>: {bearing}°
        </div>
        <div>
          <b>Pitch</b>: {pitch}°
        </div>
        <div>
          <b>Bounds</b>:<pre style={{ margin: "4px 0 0" }}>{JSON.stringify(bounds, null, 2)}</pre>
        </div>
      </div>
    </>
  );
}

export default App;
