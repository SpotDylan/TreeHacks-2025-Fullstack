'use client';

import { Map } from 'mapbox-gl';

interface PulsingTrackerProps {
  map: Map | null;
}

interface PulsingDot {
  width: number;
  height: number;
  data: Uint8Array;
  context: CanvasRenderingContext2D | null;
  onAdd: () => void;
  render: () => boolean;
}

export const createPulsingDot = (map: Map | null): PulsingDot => {
  const size = 200;
  return {
    width: size,
    height: size,
    data: new Uint8Array(size * size * 4),
    context: null,

    onAdd: function () {
      const canvas = document.createElement('canvas');
      canvas.width = this.width;
      canvas.height = this.height;
      this.context = canvas.getContext('2d');
    },

    render: function () {
      if (!this.context) return false;
      
      const duration = 2500;
      const t = (performance.now() % duration) / duration;

      const radius = (size / 2) * 0.2;
      const outerRadius = (size / 2) * 0.4 * t + radius;
      const context = this.context;

      // Draw the outer circle with project's purple theme
      context.clearRect(0, 0, this.width, this.height);
      context.beginPath();
      context.arc(
        this.width / 2,
        this.height / 2,
        outerRadius,
        0,
        Math.PI * 2
      );
      context.fillStyle = `rgba(129, 140, 248, ${1 - t})`; // Using violet-500
      context.fill();

      // Draw the inner circle with darker purple
      context.beginPath();
      context.arc(
        this.width / 2,
        this.height / 2,
        radius,
        0,
        Math.PI * 2
      );
      context.fillStyle = 'rgb(99, 102, 241)'; // Using purple-900
      context.strokeStyle = 'rgb(129, 140, 248)'; // Using violet-500
      context.lineWidth = 2 + 4 * (1 - t);
      context.fill();
      context.stroke();

      // Update this image's data with data from the canvas
      const imageData = context.getImageData(0, 0, this.width, this.height);
      this.data = new Uint8Array(imageData.data.buffer);

      // Continuously repaint the map
      map?.triggerRepaint();

      return true;
    }
  };
};

export const addPulsingDot = (map: Map | null, coordinates: [number, number]) => {
  if (!map) return;

  const pulsingDot = createPulsingDot(map);
  
  // Add the pulsing dot as a new image
  map.addImage('pulsing-dot', pulsingDot as any, { pixelRatio: 2 });

  // Add the source and layer
  map.addSource('dot-point', {
    'type': 'geojson',
    'data': {
      'type': 'FeatureCollection',
      'features': [
        {
          'type': 'Feature',
          'geometry': {
            'type': 'Point',
            'coordinates': coordinates
          },
          'properties': {}
        }
      ]
    }
  });

  map.addLayer({
    'id': 'layer-with-pulsing-dot',
    'type': 'symbol',
    'source': 'dot-point',
    'layout': {
      'icon-image': 'pulsing-dot'
    }
  });
};

export default function PulsingTracker({ map }: PulsingTrackerProps) {
  return null; // This is a utility component that doesn't render anything
}
