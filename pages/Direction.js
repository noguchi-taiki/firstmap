import { useEffect, useRef } from 'react';

export default function Direction({ map, origin, destination, setDistance,mapOptions }) {
  const directionsRendererRef = useRef(null);

  useEffect(() => {
    if (!map || !origin || !destination) return;

    const directionsService = new google.maps.DirectionsService();

    if (!directionsRendererRef.current) {
      directionsRendererRef.current = new google.maps.DirectionsRenderer();
    }

    directionsService.route({
      origin: origin,
      destination: destination,
      travelMode: google.maps.TravelMode.DRIVING,
    }, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        directionsRendererRef.current.setDirections(result);
        directionsRendererRef.current.setMap(map);
        const routeDistance = result.routes[0].legs[0].distance.text;
        setDistance(routeDistance);
      } else {
        console.error('Directions request failed due to ' + status);
      }
    });

    return () => {
      if (directionsRendererRef.current) {
        directionsRendererRef.current.setMap(null); // コンポーネントがアンマウントされたときに経路を消す
        mapOptions.zoom = 15;
      }
    };

  }, [map, origin, destination, setDistance]);

  return null;
}
