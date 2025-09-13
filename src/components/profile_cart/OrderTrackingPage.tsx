import { useEffect, useState } from "react";
import { DeliveryLocation } from "../../models/DeliveryPerson";
import axios from "axios";
import { MapContainer } from 'react-leaflet/MapContainer'
import { TileLayer } from 'react-leaflet/TileLayer'
import { useMap } from 'react-leaflet/hooks'
import L from "leaflet"
import { Marker, Popup } from "react-leaflet";
import { Card, Spinner } from "react-bootstrap";
import deliveryService from "../../services/deliveryService";

// Kurye iconu
const deliveryIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [50, 50],
  iconAnchor: [25, 50],
});

interface Props {
    orderId: number
}

const OrderTrackingPage = ({ orderId }: Props) => {
  const [location, setLocation] = useState<DeliveryLocation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await deliveryService.trackingOrder(orderId)
        console.log("response order "+ response.data)
        setLocation(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Tracking error:", err);
      }
    };

    fetchLocation();
    const interval = setInterval(fetchLocation, 5000);

    return () => clearInterval(interval);
  }, [orderId]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p>Loading delivery location...</p>
      </div>
    );
  }

  if (!location) {
    return <p>Delivery has not started yet.</p>;
  }

  return (
    <div className="container mt-4">
      <Card className="mb-3 shadow-sm">
        <Card.Body>
          <h5>Order Tracking - #{orderId}</h5>
          <p>
            Delivery Person: <strong>{location.deliveryPerson.user.name}</strong>
          </p>
          <p>Last Updated: {new Date(location.timestamp).toLocaleTimeString()}</p>
        </Card.Body>
      </Card>

      <MapContainer
        center={[location.latitude, location.longitude]}
        zoom={15}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <Marker
          position={[location.latitude, location.longitude]}
          icon={deliveryIcon}
        >
          <Popup>
            {location.deliveryPerson.user.name} <br />
            Last updated: {new Date(location.timestamp).toLocaleTimeString()}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default OrderTrackingPage;