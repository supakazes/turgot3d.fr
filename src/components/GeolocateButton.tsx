import React, { useState } from "react";

interface GeolocateButtonProps {
  onGeolocate: (coords: { lat: number; lng: number }) => void;
}

const GeolocateButton: React.FC<GeolocateButtonProps> = ({ onGeolocate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = () => {
    setLoading(true);
    setError(null);
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLoading(false);
        onGeolocate({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        setLoading(false);
        setError("Unable to retrieve your location.");
      },
    );
  };

  return (
    <div>
      <button onClick={handleClick} disabled={loading}>
        {loading ? "Locating..." : "Get My Location"}
      </button>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
};

export default GeolocateButton;
