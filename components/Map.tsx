"use client";

import { useEffect, useRef } from "react";
import * as maptilersdk from "@maptiler/sdk";


interface MapProps {
    cods: {lng: number, lat: number}
}

export default function Map({cods = {lng:106.5348, lat: 38.7946}}: MapProps) {
    const mapContainer = useRef<HTMLDivElement | null >(null);
    // const makerContainer = useRef<HTMLDivElement | null >(null);
    const map = useRef<maptilersdk.Map>(null)
    const zoom = 10;
    maptilersdk.config.apiKey = process.env.MAPTILER_API_KEY!;
  
    useEffect(() => {
        if (map.current) return; // stops map from intializing more than once
      
        map.current = new maptilersdk.Map({
          container: mapContainer.current as HTMLElement,
          style: maptilersdk.MapStyle.STREETS,
          center: [cods.lng, cods.lat],
          zoom: zoom,
          maptilerLogo: false,
          
        });
        new maptilersdk.Marker({
            color: "red",
            draggable: false,
            rotation: 0,
            rotationAlignment: "map",
            scale: 1
        }).setLngLat([cods.lng, cods.lat]).addTo(map.current);
      
      }, [cods.lng, cods.lat, zoom]);


      return (
        <div className="relative w-full h-[25vh]">
           
          <div ref={mapContainer} className="w-full !h-[25vh] [&_summary]:!hidden [&_details]:!hidden [&_a]:!hidden absolute" />
        </div>
      );

}