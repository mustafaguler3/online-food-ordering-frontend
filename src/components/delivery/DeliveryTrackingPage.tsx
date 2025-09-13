
import { useState } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import deliveryService from "../../services/deliveryService";

const DeliveryTrackingPage = ({ restaurantLat, restaurantLng, deliveryPersonId }) => {
  const [position, setPosition] = useState({ lat: restaurantLat, lng: restaurantLng });

  const moveCourier = (direction: string) => {
    let newPos = { ...position };
    if (direction === "up") newPos.lat += 0.0005;
    if (direction === "down") newPos.lat -= 0.0005;
    if (direction === "left") newPos.lng -= 0.0005;
    if (direction === "right") newPos.lng += 0.0005;

    setPosition(newPos);

    // DB’ye gönder (sanki gerçek GPS gibi)
    deliveryService.updateLocation({
      deliveryPersonId,
      lat: newPos.lat,
      lng: newPos.lng,
    });
  };

  return (
    <div>
      <GoogleMap
        zoom={15}
        center={position}
        mapContainerStyle={{ width: "100%", height: "500px" }}
      >
        <Marker
          position={position}
          icon={{
            url: "/motorbike.png",
            scaledSize: new window.google.maps.Size(40, 40),
          }}
        />
      </GoogleMap>

      <div style={{ marginTop: 10 }}>
        <button onClick={() => moveCourier("up")}>⬆️</button>
        <button onClick={() => moveCourier("down")}>⬇️</button>
        <button onClick={() => moveCourier("left")}>⬅️</button>
        <button onClick={() => moveCourier("right")}>➡️</button>
      </div>
    </div>
  );
};

export default DeliveryTrackingPage;