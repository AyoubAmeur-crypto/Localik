"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapCar {
  id: string;
  name: string;
  price: number;
  imageSrc: string;
  location: string;
  isAvailable: boolean;
}

interface MoroccoMapProps {
  cars: MapCar[];
  hoveredCarId?: string | null;
}

const CITY_COORDINATES: Record<string, [number, number]> = {
  "Casablanca": [33.5731, -7.5898],
  "Marrakech": [31.6295, -7.9811],
  "Fes": [34.0333, -5.0000],
  "Fès": [34.0333, -5.0000],
  "Rabat": [34.0209, -6.8416],
  "Tangier": [35.7595, -5.8340],
  "Tanger": [35.7595, -5.8340],
  "Agadir": [30.4278, -9.5981],
  "Sefrou": [33.8314, -4.8278],
  "Chefchaouen": [35.1688, -5.2636],
  "Essaouira": [31.5085, -9.7595],
  "Ouarzazate": [30.9189, -6.9118],
  "Meknes": [33.8938, -5.5547],
  "Oujda": [34.6867, -1.9114],
};

export default function MoroccoMap({ cars, hoveredCarId }: MoroccoMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});

  useEffect(() => {
    if (!mapRef.current) return;

    // Center of Morocco
    const center: [number, number] = [31.7917, -7.0926];

    // Initialize map
    const map = L.map(mapRef.current, {
      center,
      zoom: 6,
      scrollWheelZoom: true,
      zoomControl: false,
    });

    L.control.zoom({ position: "topright" }).addTo(map);

    // Google Maps Roadmap tile layer (matching standard Google Map visuals)
    L.tileLayer("https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
      attribution: '&copy; Google Maps',
      maxZoom: 20,
    }).addTo(map);

    mapInstanceRef.current = map;

    // Clean up on unmount
    return () => {
      if (mapInstanceRef.current) {
        const mapToCleanup = mapInstanceRef.current;
        try {
          // Close popups first to avoid Leaflet positioning calculations on destroyed map
          mapToCleanup.closePopup();
          
          // Remove all layers individually
          mapToCleanup.eachLayer((layer) => {
            try {
              mapToCleanup.removeLayer(layer);
            } catch (e) {
              // Ignore layer-specific removal errors
            }
          });

          // Safely remove map instance
          mapToCleanup.remove();
        } catch (error) {
          console.error("Error during Leaflet map cleanup:", error);
        }
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when cars change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    Object.values(markersRef.current).forEach((marker) => {
      try {
        marker.remove();
      } catch (e) {}
    });
    markersRef.current = {};

    if (cars.length === 0) return;

    const bounds: L.LatLngExpression[] = [];

    cars.forEach((car) => {
      const coords = CITY_COORDINATES[car.location];
      if (!coords) return;

      const isHovered = hoveredCarId === car.id;
      const markerBg = isHovered ? "#1d4ed8" : "#1572D3";
      const scale = isHovered ? "scale(1.3)" : "scale(1)";

      // Rounded blue dot icon
      const icon = L.divIcon({
        className: `custom-dot-marker-${car.id}`,
        html: `<div style="background-color: ${markerBg}; width: 14px; height: 14px; border-radius: 50%; border: 2.5px solid white; box-shadow: 0 0 8px rgba(21,114,211,0.5), 0 2px 4px rgba(0,0,0,0.2); transition: all 0.2s ease; transform: ${scale};"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });

      const popupHtml = `
        <div style="width: 48px; height: 48px; border-radius: 50%; border: 2.5px solid #1572D3; background: white; overflow: hidden; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.25);">
          <img src="${car.imageSrc}" alt="" style="max-width: 82%; max-height: 82%; object-fit: contain;" />
        </div>
      `;

      const marker = L.marker(coords, { icon })
        .addTo(map)
        .bindPopup(popupHtml, {
          closeButton: false,
          className: "premium-map-popup",
          offset: [0, -4],
        });

      markersRef.current[car.id] = marker;
      bounds.push(coords);
    });

    // Fit map to markers bounds if there are any
    if (bounds.length > 0) {
      map.fitBounds(L.latLngBounds(bounds), {
        padding: [40, 40],
        maxZoom: 12,
      });
    }

    return () => {
      Object.values(markersRef.current).forEach((marker) => {
        try {
          marker.remove();
        } catch (e) {}
      });
      markersRef.current = {};
    };
  }, [cars]);

  // Handle hovered car style updates in real-time
  useEffect(() => {
    cars.forEach((car) => {
      const marker = markersRef.current[car.id];
      if (!marker) return;

      const isHovered = hoveredCarId === car.id;
      const markerBg = isHovered ? "#1d4ed8" : "#1572D3";
      const scale = isHovered ? "scale(1.35)" : "scale(1)";
      const zIndex = isHovered ? 1000 : 100;

      const icon = L.divIcon({
        className: `custom-dot-marker-${car.id}`,
        html: `<div style="background-color: ${markerBg}; width: 14px; height: 14px; border-radius: 50%; border: 2.5px solid white; box-shadow: 0 0 8px rgba(21,114,211,0.5), 0 2px 4px rgba(0,0,0,0.2); transition: all 0.2s ease; transform: ${scale};"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });

      marker.setIcon(icon);
      marker.setZIndexOffset(zIndex);
      
      if (isHovered) {
        marker.openPopup();
      }
    });
  }, [hoveredCarId, cars]);

  return (
    <>
      <div ref={mapRef} className="w-full h-full z-10" />
      <style>{`
        /* Overrides to make the Leaflet popup container transparent/circular */
        .premium-map-popup .leaflet-popup-content-wrapper {
          background: transparent !important;
          box-shadow: none !important;
          border: none !important;
          padding: 0 !important;
        }
        .premium-map-popup .leaflet-popup-tip-container {
          display: none !important;
        }
        .premium-map-popup .leaflet-popup-content {
          margin: 0 !important;
          padding: 0 !important;
        }
      `}</style>
    </>
  );
}
