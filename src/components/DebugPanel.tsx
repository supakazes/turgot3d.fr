import type { LngLatBoundsLike } from "mapbox-gl";

interface DebugPanelProps {
  layerVisible: boolean;
  toggleLayer: () => void;
  zoom: number;
  center: [number, number];
  bounds: LngLatBoundsLike | null;
}

export function DebugPanel({ layerVisible, toggleLayer, zoom, center, bounds }: DebugPanelProps) {
  return (
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
  );
}
