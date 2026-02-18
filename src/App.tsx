import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./App.css";
import { DebugPanel } from "./components/DebugPanel";
import GeolocateButton from "./components/GeolocateButton";

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
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null);
  const [userMarker, setUserMarker] = useState<mapboxgl.Marker | null>(null);

  // Handler to update map position and place marker
  const handleGeolocate = (coords: { lat: number; lng: number }) => {
    if (mapInstance) {
      mapInstance.flyTo({ center: [coords.lng, coords.lat], zoom: 15 });
      mapInstance.once("moveend", () => {
        if (userMarker) {
          userMarker.remove();
        }
        // Use the default Mapbox marker (pin)
        const marker = new mapboxgl.Marker().setLngLat([coords.lng, coords.lat]).addTo(mapInstance);
        setUserMarker(marker);
      });
    }
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

    setMapInstance(map);
    map.addControl(new mapboxgl.NavigationControl(), "top-right");

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

    map.on("load", updateUrl);
    map.on("moveend", updateUrl);

    return () => map.remove();
  }, []);

  return (
    <>
      <div ref={mapRef} style={{ width: "100vw", height: "100vh" }} />
      <div style={{ position: "absolute", top: 10, left: 10, zIndex: 10 }}>
        <GeolocateButton onGeolocate={handleGeolocate} />
      </div>
      <DebugPanel map={mapInstance} layerId={DEBUG_LAYER_ID} />
    </>
  );
}

export default App;
