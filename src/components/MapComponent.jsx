import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Recenter map when coordinates change
function RecenterMap({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center);
    }
  }, [center]);
  return null;
}

const MapComponent = ({ onLocationSelect }) => {
  const [position, setPosition] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setPosition([pos.coords.latitude, pos.coords.longitude]);
      if (onLocationSelect) {
        onLocationSelect({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
      }
    });
  }, []);

  return (
    <div className="w-full h-[300px] rounded overflow-hidden shadow border">
      {position && (
        <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
          <RecenterMap center={position} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <Marker position={position}>
            <Popup>You are here</Popup>
          </Marker>
        </MapContainer>
      )}
      {!position && <p className="p-4 text-gray-500">Fetching your location...</p>}
    </div>
  );
};

export default MapComponent;
