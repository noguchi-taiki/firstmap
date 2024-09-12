"use client";

import { useRef, useEffect, useState } from "react";
import SearchBox from "./SearchBox";
import AddCurrentLocationMarker from "./AddCurrentLocation";
import Direction from "./Direction";
// import ShowCafes from "./ShowCafes";
import styles from "../styles/Layout.module.css";
import ReLocateButton from "./ReLocateButton";
import App from "./api";


export default function Map() {
  const ref = useRef(null);
  const [destination, setDestination] = useState(null);
  const [distance,setDistance] = useState(null);
  const [showDirections,setShowDirections] = useState(false);
  const [map, setMap] = useState(null);
  const firstCenter  = { lat: 35.6809591, lng: 139.7673068 };
  const [currentLocation,setCurrentLocation] = useState(null);
  
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
      //今後：カフェのみを表示する様にしたいがmapidを自作で設定すればできそう
      ...mapOptions,
      center: center,
      // mapId:,
    });
    setMap(newMap);
    // console.log(currentLocation);
    // console.log(firstCenter);
  };

  useEffect(() => {
    if (ref.current && !map) {
      if (navigator.geolocation) { //Geolocation APIの確認
        //多分これから先も使うことがあると思う
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setCurrentLocation(location);
            console.log(location);
            createMap(location);
          }
        );
      } else {
        console.warn("このブラウザではGeolocation APIが利用できません。");
        createMap(firstCenter);
      }
    }
  }, []);


  useEffect(() => {
    if (currentLocation) {
      console.log("currentLocationが更新されました:", currentLocation);
    }
  }, [currentLocation]);


  // useEffect(() => {
  //   if (!showDirections && map && destination) {
  //     if (destination.lat && destination.lng) {
  //       map.setCenter(destination);
  //     } else {
  //       console.error("無効な目的地の座標が設定されています:", destination);
  //     }
  //   }
  // }, [showDirections, map, destination]);

  const handleToggleDirections = () => {
    if(map && destination){
      setShowDirections(prevState => !prevState);
    }
  }

  return (
    <div>
      <App
        firstCenter={firstCenter}
      />

      <SearchBox
        map={map}
        firstCenter={firstCenter}
        currentLocation={currentLocation}
        createMap={createMap}
      />
      <button className={styles.directionButton} onClick={handleToggleDirections}>
        {showDirections ? "隠す" : "距離"}
      </button>

      <ReLocateButton
        firstCenter={firstCenter}
        currentLocation={currentLocation}
        createMap={createMap}
      />

      {showDirections &&(
        <Direction
          map={map}
          origin={firstCenter}
          destination={destination}
          setDistance={setDistance}
          mapOptions={mapOptions}
        />
      )}
      
      <div ref={ref} className={styles.map}/>
      <div>{showDirections && distance ? `距離: ${distance}` : ""}</div>

      {map && currentLocation && (
        <AddCurrentLocationMarker map={map} position={currentLocation}/>
      )}
    </div>
  )
}
