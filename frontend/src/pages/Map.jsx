import { useState } from "react";
import MapView from "../components/MapView";

const MapPage = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  const points = [
    { id: 1, name: "Point A", lat: 35.6997, lon: 51.3381 },
    { id: 2, name: "Point B", lat: 35.7153, lon: 51.4043 },
    { id: 3, name: "Point C", lat: 35.7326, lon: 51.4469 },
  ];

  const handleLocationFound = (locationInfo) => {
    setSelectedLocation(locationInfo);
    console.log(locationInfo);
  };

  return (
    <div>
      <MapView onLocationFound={handleLocationFound} points={points} />
    </div>
  );
};

export default MapPage;
