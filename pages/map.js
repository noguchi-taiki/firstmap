import { useRef, useEffect, useState } from 'react';
import SearchBox from './SearchBox';
import{ setCurrentLocationMarker } from "./currentLocation";

export default function Map() {
  const ref = useRef(null);
  const [map, setMap] = useState(null);
  const [firstCenter, setFirstCenter] = useState({ lat: 35.6809591, lng: 139.7673068 });

  const mapOptions = {
    zoom: 15,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
  };

  useEffect(() => {
    if (ref.current && !map) {
      if (navigator.geolocation) {//Geolocation APIの確認
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const currentLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setFirstCenter(currentLocation);
            const newMap = new window.google.maps.Map(ref.current,{
              ...mapOptions,
              center: currentLocation,
            })
            setMap(newMap);
            setCurrentLocationMarker(newMap, currentLocation); // 現在地のマーカーを設置
          },
          () => {
            // Geolocationの取得が失敗した場合
            setMap(new window.google.maps.Map(ref.current, {
              ...mapOptions,
              center: firstCenter,
            }));
            setMap(newMap);
            setCurrentLocationMarker(newMap, firstCenter); // 初期位置のマーカーを設置
          }
        );
      } else {
        console.warn("このブラウザではGeolocation APIが利用できません。");
        // Geolocation APIがサポートされていない場合
        setMap(new window.google.maps.Map(ref.current, {
          ...mapOptions,
          center: firstCenter,
        }));
        setMap(newMap);
        setCurrentLocationMarker(newMap, firstCenter); // 初期位置のマーカーを設置
      }
    }
  }, [ref, map, firstCenter]);

  return (
    <div>
      <SearchBox map={map}
      firstCenter={firstCenter}
      style={{ height: "30px", width: "350px" }} />
      <div ref={ref} style={{ height: "320px", width: "350px" }} />
    </div>
  );
}