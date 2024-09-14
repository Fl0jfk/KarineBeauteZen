"use client"

import { useMemo } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { useData } from "../../contexts/data";
import Link from "next/link";

function detectDeviceType() {
  const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent : '';
  if (/iPhone|iPad|iPod/i.test(userAgent)) {
    return 'iOS';
  } else if (/Android/i.test(userAgent)) {
    return 'Android';
  }
  return 'Unknown';
}

export default function Map() {
  const { isLoaded } = useLoadScript({ googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,});
  if (!isLoaded) return <div>Loading...</div>;
  const deviceType = detectDeviceType();
  const mapLink = deviceType === 'iOS' ? "https://maps.apple.com/?address=40%20Route%20du%20Neubourg,%2027370%20Saint-Pierre-des-Fleurs,%20France&auid=7312967961999577381&ll=49.248613,0.961462&lsp=9902&q=Karine%20Beauté%20Zen&t=m" : "https://maps.app.goo.gl/MLh4h36hFrPHHxjP7";
  return <MapKit mapLink={mapLink} />;
}

function MapKit({ mapLink}:any) {
  const center = useMemo(() => ({ lat: 49.248597376102744, lng: 0.9611038272688814 }), []);
  const data = useData();
  return (
    <Link href={mapLink}>
      <GoogleMap zoom={12} center={center} mapContainerClassName="w-full h-full rounded-xl" options={{ disableDefaultUI: true }}>
        {data.profile.logo && (
          <Marker position={center} icon={{ url: data.profile.logo, scaledSize: new window.google.maps.Size(50, 50)}}/>
        )}
      </GoogleMap>
    </Link>
  );
}
