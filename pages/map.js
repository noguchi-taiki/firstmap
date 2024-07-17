import { useRef, useEffect, useState } from 'react';
import SearchBox from './SearchBox';
import{ setCurrentLocationMarker } from "./currentLocation";
import Direction from "./Direction";
import styles from "../styles/Layout.module.css";
import ReLocateButton from "./reLocateButton";

export default function Map() {
  const ref = useRef(null);
  const [firstCenter, setFirstCenter] = useState({ lat: 35.6809591, lng: 139.7673068 });
  const [destination, setDestination] = useState(null);
  const [distance,setDistance] = useState(null);
  const [showDirections,setShowDirections] = useState(false);
  const [map, setMap] = useState(null);
  const [currentLocation,setCurrentLocation] = useState(null);

  const createMap = (center) => {
    const mapOptions = {
      zoom: 15,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      keyboardShortcuts: false,
      gestureHandling: "greedy",
      clickableIcons: false,
    };
    const newMap = new google.maps.Map(ref.current,{
      ...mapOptions,
      center: center,
    });
    setMap(newMap);
    setCurrentLocationMarker(newMap,center);
  };


  useEffect(() => {
    if (ref.current && !map) {
      if (navigator.geolocation) {//Geolocation APIの確認
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            console.log(location);
            setFirstCenter(location);
            createMap(location);
            setCurrentLocation(location);
          },
          () => {
            // Geolocationの取得が失敗した場合
            createMap(firstCenter);
          }
        );
      } else {
        console.warn("このブラウザではGeolocation APIが利用できません。");
        // Geolocation APIがサポートされていない場合
        createMap(firstCenter);
      }
    }
    console.log(currentLocation);
  }, [ref, map, firstCenter]);

useEffect(()=>{
  if(!showDirections && map && destination){
    map.setCenter(destination);
    <Direction mapOptions={mapOptions}/>
  }
},[showDirections]);

const handleToggleDirections = () => {
  if(map && destination){
    setShowDirections(prevState => !prevState);
  }
}

console.log(firstCenter);
console.log(currentLocation);
  return (
    <div>
      <SearchBox
      map={map}
      firstCenter={firstCenter}
      setDestination={setDestination}
      createMap={createMap}
      />
      <button className={styles.directionButton} onClick={handleToggleDirections}>
        {showDirections?"隠す":"検索"}
      </button>

      <ReLocateButton
      firstCenter={firstCenter}
      currentLocation={currentLocation}
      createMap={createMap}
      />

      {showDirections && destination && (
        <Direction
          map={map}
          origin={firstCenter}
          destination={destination}
          setDistance={setDistance}
          mapOptions={mapOptions}
        />
      )}
      
      <div ref={ref} className={styles.map}/>
      <div>{showDirections&& distance ?`距離: ${distance}`:""}</div>
    </div>
  )
}
