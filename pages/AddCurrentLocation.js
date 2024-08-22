// "use client";
import { useEffect } from "react";

export default function AddCurrentLocationMarker({ map, position }) {
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof google !== 'undefined') {
      // 縁の薄い青丸
      new google.maps.Circle({
        strokeColor: '#deb9a0',
        strokeOpacity: 0.2,
        strokeWeight: 1,
        fillColor: '#deb9a0',
        fillOpacity: 0.2,
        map: map,
        center: position,
        radius: 100,
      });
      // 中央の濃い青丸
      new google.maps.Marker({
        position: position,
        map: map,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: '#fa802f',
          fillOpacity: 1,
          fillWeight: 3,
          // strokeColor: '#dbcbc5',
          strokeColor: '#f7f4f2',
          strokeWeight: 1,
          scale: 7,
        },
      });
    }
  }, [map, position]);

  return null;
}
