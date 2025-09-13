import { useEffect, useRef } from "react";

declare global {
  interface Window {
    google: any;
  }
}

type Props = {
  lat: number;
  lng: number;
};

const GoogleMapTracker = ({ lat, lng }: Props) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.google && mapRef.current) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat, lng },
        zoom: 15,
      });

      new window.google.maps.Marker({
        position: { lat, lng },
        map,
      });
    }
  }, [lat, lng]);

  return <div ref={mapRef} style={{ width: "100%", height: "400px" }} />;
};

export default GoogleMapTracker;