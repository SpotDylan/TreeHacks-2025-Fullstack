        'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useDemoMode } from '@/contexts/DemoModeContext';
import { useSelectedSoldier } from '@/contexts/SelectedSoldierContext';
import { mockSoldiers, updateSoldierPositions, MockSoldier } from '@/utils/mockSoldierData';
import mapboxgl from 'mapbox-gl';
import { MapboxStyleSwitcherControl } from "mapbox-gl-style-switcher";
import "mapbox-gl-style-switcher/styles.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { addPulsingDot } from '@/components/PulsingTracker';

// Constants for minimap
const OVERVIEW_MIN_ZOOM = 8;
const OVERVIEW_MAX_ZOOM = 16;
const OVERVIEW_ZOOM_OFFSET = 4;

const MapComponent = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const minimapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const minimap = useRef<mapboxgl.Map | null>(null);
  const [bounds, setBounds] = useState<mapboxgl.LngLatBounds | null>(null);
  const [soldiers, setSoldiers] = useState(mockSoldiers);
  const { isDemoMode } = useDemoMode();
  const { setSelectedSoldier } = useSelectedSoldier();

  // Calculate the appropriate zoom level for the minimap
  const buildOverviewZoom = (mainZoom: number): number => {
    const zoomedOut = mainZoom - OVERVIEW_ZOOM_OFFSET;
    return Math.min(Math.max(zoomedOut, OVERVIEW_MIN_ZOOM), OVERVIEW_MAX_ZOOM);
  };

  // Update minimap bounds visualization
  const updateMinimapBounds = () => {
    if (!map.current || !minimap.current) return;

    const newBounds = map.current.getBounds();
    if (!newBounds) return;
    
    setBounds(newBounds);

    // Remove existing bounds layers
    if (minimap.current.getSource('bounds')) {
      minimap.current.removeLayer('bounds-fill');
      minimap.current.removeLayer('bounds-outline');
      minimap.current.removeSource('bounds');
    }

    try {
      // Extract coordinates before using them to ensure type safety
      const west = newBounds.getWest();
      const south = newBounds.getSouth();
      const east = newBounds.getEast();
      const north = newBounds.getNorth();

      // Add new bounds visualization
      const coordinates: [number, number][] = [
        [west, south],
        [east, south],
        [east, north],
        [west, north],
        [west, south]
      ];

      minimap.current.addSource('bounds', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [coordinates]
          },
          properties: {}
        }
      });

      minimap.current.addLayer({
        id: 'bounds-fill',
        type: 'fill',
        source: 'bounds',
        paint: {
          'fill-color': '#0080ff',
          'fill-opacity': 0.2
        }
      });

      minimap.current.addLayer({
        id: 'bounds-outline',
        type: 'line',
        source: 'bounds',
        paint: {
          'line-color': '#0080ff',
          'line-width': 0.5
        }
      });
    } catch (error) {
      console.error('Error updating minimap bounds:', error);
    }
  };

  useEffect(() => {
    if (!mapContainer.current || !minimapContainer.current) return; // wait for containers to be ready

    // Cleanup previous instances
    if (map.current) {
      map.current.remove();
      map.current = null;
    }
    if (minimap.current) {
      minimap.current.remove();
      minimap.current = null;
    }

    // Initialize new instances
    mapboxgl.accessToken = "pk.eyJ1IjoiYnBhY2h1Y2EiLCJhIjoiY2lxbGNwaXdmMDAweGZxbmg5OGx2YWo5aSJ9.zda7KLJF3TH84UU6OhW16w";
    
    // Initialize main map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      zoom: 14,
      minZoom: 3,
      maxZoom: 20
    });

    // Initialize minimap
    minimap.current = new mapboxgl.Map({
      container: minimapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      zoom: 10,
      interactive: false // Disable minimap interaction
    });

    // Wait for both maps to load
    Promise.all([
      new Promise(resolve => map.current?.on('style.load', resolve)),
      new Promise(resolve => minimap.current?.on('style.load', resolve))
    ]).then(async () => {
      // Get initial position based on mode
      const initialPosition = isDemoMode 
        ? [-122.1701, 37.4277] // Stanford coordinates
        : await (async () => {
            try {
              const response = await fetch(
                'https://api.wheretheiss.at/v1/satellites/25544',
                { method: 'GET' }
              );
              const { latitude, longitude } = await response.json();
              return [longitude, latitude] as [number, number];
            } catch (err) {
              console.error('Error fetching ISS location:', err);
              return [0, 0] as [number, number];
            }
          })();
      
      if (map.current && minimap.current) {
        const center = initialPosition as [number, number];
        map.current.setCenter(center);
        minimap.current.setCenter(center);
        map.current.setZoom(isDemoMode ? 14 : 2);
        minimap.current.setZoom(isDemoMode ? 12 : 1);
        
        if (isDemoMode) {
          // Add pulsing dots and click handlers for all soldiers
          soldiers.forEach((soldier, index) => {
            const position: [number, number] = [soldier.currentPosition[1], soldier.currentPosition[0]];
            addPulsingDot(map.current!, position, `soldier-${index}`);

            // Add click handler for the layer
            map.current!.on('click', `layer-with-soldier-${index}-dot`, (e) => {
              if (e.features && e.features[0]) {
                const clickedSoldier = soldiers.find(s => s.id === `demo-soldier-${index + 1}`);
                if (clickedSoldier) {
                  setSelectedSoldier(clickedSoldier);
                }
              }
            });

            // Change cursor to pointer when hovering over soldier dots
            map.current!.on('mouseenter', `layer-with-soldier-${index}-dot`, () => {
              map.current!.getCanvas().style.cursor = 'pointer';
            });

            map.current!.on('mouseleave', `layer-with-soldier-${index}-dot`, () => {
              map.current!.getCanvas().style.cursor = '';
            });
          });

          // Update soldier positions every 2 seconds
          const updateInterval = setInterval(() => {
            if (map.current && minimap.current) {
              const updatedSoldiers = updateSoldierPositions(soldiers);
              setSoldiers(updatedSoldiers);

              // Update each soldier's position
              updatedSoldiers.forEach((soldier, index) => {
                const source = map.current!.getSource(`soldier-${index}-point`) as mapboxgl.GeoJSONSource | undefined;
                if (source) {
                  source.setData({
                    type: 'FeatureCollection',
                    features: [
                      {
                        type: 'Feature',
                        geometry: {
                          type: 'Point',
                          coordinates: [soldier.currentPosition[1], soldier.currentPosition[0]] as [number, number]
                        },
                        properties: {
                          title: soldier.name,
                          description: soldier.event
                        }
                      }
                    ]
                  });
                }
              });
            }
          }, 2000);

          return () => clearInterval(updateInterval);
        } else {
          // Add pulsing dot at ISS location
          addPulsingDot(map.current, initialPosition as [number, number]);

          // Update ISS position every 2 seconds
          const updateInterval = setInterval(async () => {
            try {
              const response = await fetch(
                'https://api.wheretheiss.at/v1/satellites/25544',
                { method: 'GET' }
              );
              const { latitude, longitude } = await response.json();
              const newPosition = [longitude, latitude] as [number, number];
              
              if (map.current && minimap.current) {
                // Update the dot's position
                const source = map.current.getSource('dot-point') as mapboxgl.GeoJSONSource;
                if (source) {
                  source.setData({
                    type: 'FeatureCollection',
                    features: [
                      {
                        type: 'Feature',
                        geometry: {
                          type: 'Point',
                          coordinates: newPosition
                        },
                        properties: {}
                      }
                    ]
                  });

                  // Fly to new position
                  map.current.flyTo({
                    center: newPosition,
                    speed: 0.5
                  });
                  
                  minimap.current.setCenter(newPosition);
                }
              }
            } catch (err) {
              console.error('Error updating ISS location:', err);
            }
          }, 2000);

          return () => clearInterval(updateInterval);
        }

      }

      map.current?.addControl(new MapboxStyleSwitcherControl() as any);

      // Initial bounds update
      updateMinimapBounds();

      // Sync minimap with main map movements
      map.current?.on('move', () => {
        if (map.current && minimap.current) {
          const center = map.current.getCenter();
          minimap.current.setCenter(center);
          minimap.current.setZoom(buildOverviewZoom(map.current.getZoom()));
          updateMinimapBounds();
        }
      });
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      if (minimap.current) {
        minimap.current.remove();
        minimap.current = null;
      }
    };
  }, [isDemoMode, setSelectedSoldier]);

  return (
    <div style={{ position: 'relative' }}>
      <div 
        style={{ 
          width: '100%', 
          height: '550px',
          borderRadius: '12px',
          overflow: 'hidden',
          marginLeft: '0',
          padding: '2px',
          boxSizing: 'border-box'
        }} 
      >
        <div 
          ref={mapContainer}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '6px',
            overflow: 'hidden'
          }}
        />
      </div>
      <div 
        ref={minimapContainer} 
        style={{ 
          position: 'absolute',
          top: '10px',
          right: '10px',
          width: '150px',
          height: '150px',
          borderRadius: '4px',
          overflow: 'hidden',
          border: '2px solid rgba(0, 0, 0, 0.2)',
          background: '#fff'
        }} 
      />
    </div>
  );
};

export default MapComponent;
