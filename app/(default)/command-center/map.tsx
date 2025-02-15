'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapboxStyleSwitcherControl } from "mapbox-gl-style-switcher";
import "mapbox-gl-style-switcher/styles.css";
import "mapbox-gl/dist/mapbox-gl.css";

const MapComponent = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    if (!mapContainer.current) return; // wait for container to be ready

    mapboxgl.accessToken = "pk.eyJ1IjoiYnBhY2h1Y2EiLCJhIjoiY2lxbGNwaXdmMDAweGZxbmg5OGx2YWo5aSJ9.zda7KLJF3TH84UU6OhW16w";
    
    // Initialize map with dark style
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      zoom: 12
    });

    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (map.current) {
            map.current.setCenter([position.coords.longitude, position.coords.latitude]);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          // Default to San Francisco if location access is denied
          if (map.current) {
            map.current.setCenter([-122.174217, 37.427940]);
          }
        }
      );
    }

    map.current.addControl(new MapboxStyleSwitcherControl() as any);

    // Cleanup on unmount
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  return (
    <div 
      ref={mapContainer} 
      style={{ 
        width: '100%', 
        height: '350px',
        borderRadius: '8px',
        overflow: 'hidden',
        marginLeft: '0'
      }} 
    />
  );
};

export default MapComponent;
