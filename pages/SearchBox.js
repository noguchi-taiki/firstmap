import { useRef, useEffect,useState } from 'react';
import styles from "../styles/Layout.module.css";
import Image from 'next/image';
import App from './api';
// import markerImg from "../public/mugcup_tabaco.png";

export default function SearchBox({ map,firstCenter,setDestination,currentLocation,createMap}) {
  const inputRef = useRef(null);
  const markers = useRef([]); //マーカーを使う際のref定義
  const [url, setUrl] = useState("");
  const [places,setPlaces] = useState({});
  const [infoToggle,setInfoToggle] = useState(false);
  const [markerPositions, setMarkerPositions] = useState([]); // マーカーの位置を保存するstate
  const [showCafeToggle,setShowCafeToggle] = useState(false);


  useEffect(() => {
    if (map != null && inputRef.current) {
      const input = inputRef.current;
      const searchBox = new google.maps.places.SearchBox(input, {
        types: ['cafe'],
        componentRestrictions: { country: 'jp' }
      });
      const autocompleteService = new google.maps.places.AutocompleteService();

      // map.addListener('bounds_changed', () => {
      //   searchBox.setBounds(map.getBounds());
      // });
      //サーチボックスのsetBoundsメソッドを使いブラウザの表示範囲のみを検索してくれる。
      //chatgptによると付けたほうがいいらしいが今回はつけない方が良い

      searchBox.addListener('places_changed', () => {
        const places = searchBox.getPlaces();
        //再検索の際にマーカーを消す
        markers.current.forEach(marker => marker.setMap(null));
        markers.current = [];
        setInfoToggle(false);

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
                // map.setCenter(currentLocation);本来はこの書き方をしたい...
            } else {
                createMap(firstCenter);
            }
            input.placeholder = 'こちらはカフェもしくは喫茶店ではありません。';
            return;
          }

          // マーカーを作成して地図上に表示する。(Maekerメソッド) markerメソッドは後で色々工夫したいから
          //ドキュメントを読む必要あり。。。一度試してみたが苦戦しそうな模様なので一旦はデフォで
          const marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            // scaledSize: new google.maps.Size(50, 50),
          });

          markers.current.push(marker);
          
          if(places.length = 1){
            google.maps.event.addListener(marker,"click",()=>{
              setInfoToggle(prevToggle => !prevToggle);
              if(!infoToggle){
                setPlaces(places[0]);
                if (place.photos && place.photos.length > 0) {
                  setUrl(place.photos[0].getUrl({ maxWidth: 400, maxHeight: 300 }));
                  console.log(places.formatted_address)
                } else {
                  setUrl("画像が見つかりませんでした。")
                }
              }
            })
          }

          const markerPosition = marker.getPosition();
          if (markerPosition) {
            setMarkerPositions(prevPositions => [
              ...prevPositions,
              { lat: markerPosition.lat(), lng: markerPosition.lng() }
            ]);
          }

          if (place.geometry.viewport) {
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
          // setDestination(place.geometry.location); // 目的地を設定
        });

        map.fitBounds(bounds);
      });

      input.addEventListener('input', () => {
        const inputText = input.value;
        input.placeholder = 'カフェを検索';
        
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

const showNearCafes = () => {
  setShowCafeToggle(!showCafeToggle);
}
const hydes = () => {
  setShowCafeToggle(false);
  setInfoToggle(false);
}

  return(<>
    <input onClick={showNearCafes} onBlur={hydes} className={styles.searchBox} ref={inputRef} type="text" placeholder="ここから近い順！"/>
    
      {showCafeToggle &&(
        <App
        showCafeToggle={showCafeToggle}
        firstCenter={firstCenter}
        />
      )}
    {infoToggle && (
        <div className={styles.shopsInfo}>
          <div>name: {places.name}</div>
          <address>addres: {places.formatted_address}</address>
          <div className={styles.cafeInfoTell}>Tell: {places.formatted_phone_number}</div>
          <div>
            <Image src={url} alt="説明" width={500} height={300}/>
          </div>
        </div>
      )}
    </>
  );
}