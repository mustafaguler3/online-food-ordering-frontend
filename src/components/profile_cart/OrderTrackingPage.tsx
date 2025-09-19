import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import L from "leaflet";
import deliveryService from "../../services/deliveryService";

const courierIcon = new L.Icon({
  iconUrl: "/images/motorbike.png",
  iconSize: [40, 40],
});

export default function OrderTrackingPage({ orderId }: { orderId: number }) {
  const [courierPos, setCourierPos] = useState<[number, number] | null>(null);
  const [restaurantPos, setRestaurantPos] = useState<[number, number] | null>(null);
  const [customerPos, setCustomerPos] = useState<[number, number] | null>(null);
  const [route, setRoute] = useState<[number, number][]>([]);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const res = await deliveryService.getDeliveryLocation(orderId);
        setCourierPos([res.courier.lat, res.courier.lng]);
        setRestaurantPos([res.restaurant.lat, res.restaurant.lng]);
        setCustomerPos([res.customer.lat, res.customer.lng]);
        setRoute([
          [res.courier.lat, res.courier.lng],
          [res.customer.lat, res.customer.lng],
        ]);
      } catch (err) {
        console.error("Coortinate not found", err);
      }
    };

    fetchPositions();

    const interval = setInterval(fetchPositions, 5000);

    return () => clearInterval(interval);
  }, [orderId]);

  if (!courierPos || !restaurantPos || !customerPos) return <p>Yükleniyor...</p>;

  return (
    <MapContainer center={courierPos} zoom={15} style={{ height: "400px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      <Marker position={courierPos} icon={courierIcon}>
        <Popup>🚴 Delivery is here!</Popup>
      </Marker>
      <Polyline positions={route} color="blue" weight={5} />
    </MapContainer>
  );
}