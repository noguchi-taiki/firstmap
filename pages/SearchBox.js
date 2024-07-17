import { useRef, useEffect,useState } from 'react';
import styles from "../styles/Layout.module.css";
import{ setCurrentLocationMarker } from "./currentLocation";

export default function SearchBox({ map,firstCenter,setDestination,currentLocation,createMap}) {
  const inputRef = useRef(null);
  const markers = useRef([]); //マーカーを使う際のref定義
  const index = useRef([]);
  const [markerPositions, setMarkerPositions] = useState([]); // マーカーの位置を保存するstate

  useEffect(() => {
    if (map && inputRef.current) {
      const autocompleteService = new google.maps.places.AutocompleteService();
      const input = inputRef.current;
      
      const searchBox = new google.maps.places.SearchBox(input, {
        types: ['cafe'], //カフェのみを検索する
        componentRestrictions: { country: 'jp' } // 日本国内に制限
      });

      map.addListener('bounds_changed', () => {
        searchBox.setBounds(map.getBounds());
      });

      searchBox.addListener('places_changed', () => {
        const places = searchBox.getPlaces();

        if (places.length === 0) {
          return;
        }

        //再検索の際にマーカーを消す
        markers.current.forEach(marker => marker.setMap(null));
        markers.current = [];  

        const bounds = new google.maps.LatLngBounds();
        places.forEach((place) => {
          if (!place.geometry || !place.geometry.location) {
            return;
          }

          // カフェ以外の場所を選択した場合はクリア
          if (!place.types.includes('cafe')) {
            input.value = '';
            if(currentLocation!=null){
                createMap(currentLocation);
            } else {
                createMap(firstCenter);
            }
            input.placeholder = 'こちらはカフェもしくは喫茶店ではありません。';
            return;
          }

          // マーカーを作成して地図上に表示する。(Maekerメソッド) 
          const marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
          });

          markers.current.push(marker);

          const markerPosition = marker.getPosition();
          // if (markerPosition) {
          //   setMarkerPositions(prevPositions => [
          //     ...prevPositions,
          //     { lat: markerPosition.lat(), lng: markerPosition.lng() }
          //   ]);
          // }

          if (place.geometry.viewport) {
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
          setDestination(place.geometry.location); // 目的地を設定
        });

        map.fitBounds(bounds);
      });

      input.addEventListener('input', () => {
        const inputText = input.value;
        input.placeholder = 'ex:近くのカフェ';
        
        if (inputText) {
          const searchQuery = inputText.includes('カフェ') ? inputText : inputText + ' カフェ'; // キーワードに「カフェ」が含まれていなければ追加
          autocompleteService.getPlacePredictions({ input: searchQuery, types: ['cafe'], componentRestrictions: { country: 'jp' } }, predictions => {
            if (predictions) {
              const cafePredictions = predictions.filter(prediction => prediction.types.includes('cafe'));
              searchBox.set('predictions', cafePredictions);
            }
          });
        } else {
          searchBox.set('predictions', []);
        }
      });
    }
  }, [map,setDestination]);
  return(<>
    <input className={styles.searchBox} ref={inputRef} type="text" placeholder="ex:近くのカフェ"/>
    </>
  );
}