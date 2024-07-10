import { useRef, useEffect, useState } from 'react';
import SearchBox from './SearchBox';
import{ setCurrentLocationMarker } from "./currentLocation";
import Direction from "./Direction";
import Smoke from './smoke';

export default function Map() {
  const hoge = {
    fuaga: "piyo",
  };
  const ref = useRef(null);
  const [map, setMap] = useState(null);
  const [firstCenter, setFirstCenter] = useState({ lat: 35.6809591, lng: 139.7673068 });
  const [destination, setDestination] = useState(null);
  const [distance,setDistance] = useState(null);
  const [showDirections,setShowDirections] = useState(false);

  const mapOptions = {
    zoom: 15,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    keyboardShortcuts: false,
    gestureHandling: "greedy",
    clickableIcons: false,
  };

  const createMap = (center) => {
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
            const currentLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setFirstCenter(currentLocation);
            createMap(currentLocation);
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
};

  return (
    <div>
      <SearchBox map={map}
      firstCenter={firstCenter}
      setDestination={setDestination}
      />
      <button onClick={handleToggleDirections}>
        {showDirections?"隠す":"経路(車)"}
      </button>
      {showDirections && destination && (
        <Direction
          map={map}
          origin={firstCenter}
          destination={destination}
          setDistance={setDistance}
          mapOptions={mapOptions}
        />
      )}
      <Smoke/>
      
      <div ref={ref} style={{ height: "470px", width: "500px" }} />
      <div>{showDirections&& distance ?`距離: ${distance}`:""}</div>
    </div>
  );
}