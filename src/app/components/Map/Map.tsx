"use client"

import { useMemo } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { useData } from "../../contexts/data";
import Link from "next/link";

export default function Map() {
  const { isLoaded } = useLoadScript({ googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,});
  if (!isLoaded) return <div>Loading...</div>;
  return <MapKit/>;
 function MapKit(){
  const center = useMemo(() => ({ lat: 49.248597376102744, lng: 0.9611038272688814 }), []);  
  const data = useData();
return (
    <Link href={"https://maps.app.goo.gl/MLh4h36hFrPHHxjP7"}>
      <GoogleMap zoom={12} center={center} mapContainerClassName="w-full h-full rounded-xl" options={{ disableDefaultUI: true }}>
        {data.profile.logo&&<Marker position={center} icon={{url: data.profile.logo, scaledSize: new window.google.maps.Size(50, 50),}}/>}
      </GoogleMap>
    </Link>
  );
 }
}