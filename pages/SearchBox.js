import { useRef, useEffect,useState } from 'react';
import styles from "../styles/Layout.module.css";
import Image from 'next/image';
import App from './api';
// import markerImg from "../public/mugcup_tabaco.png";

export default function SearchBox({ map,firstCenter,setDestination,currentLocation,createMap}) {
  const inputRef = useRef(null);
  const markers = useRef([]); //マーカーを使う際のref定義
  const index = useRef([]);
  const [url, setUrl] = useState("");
  const [places,setPlaces] = useState({});
  const [toggle,setToggle] = useState(false);
  const [markerPositions, setMarkerPositions] = useState([]); // マーカーの位置を保存するstate
  const [showCafeToggle,setShowCafeToggle] = useState(false);


  useEffect(() => {
    if (map != null && inputRef.current) {
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
        setToggle(false);


        // if(toggle && !places[0]){
        //   setToggle(prevToggle => !prevToggle);
        // }

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

          // マーカーを作成して地図上に表示する。(Maekerメソッド) markerメソッドは後で色々工夫したいから
          //ドキュメントを読む必要あり。。。一度試してみたが苦戦しそうな模様なので一旦はデフォで
          const marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            // url: markerImg.src,
            // scaledSize: new google.maps.Size(50, 50),
          });

          markers.current.push(marker);

          
          if(places.length = 1){
            google.maps.event.addListener(marker,"click",()=>{
              setToggle(prevToggle => !prevToggle);
              if(!toggle){
                setPlaces(places[0]);
                if (place.photos && place.photos.length > 0) {
                  setUrl(place.photos[0].getUrl({ maxWidth: 400, maxHeight: 300 }));
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
          setDestination(place.geometry.location); // 目的地を設定
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
  if(showCafeToggle==false){setShowCafeToggle(true);}else{setShowCafeToggle(false);}
}
const hydeNearCafes = () => {
  setShowCafeToggle(false);
}


  useEffect(()=>{
    // console.log(places);
    // console.log(places.name);
    // console.log(places.formatted_address);
    // console.log(places.formatted_phone_number);
    if(url){
      // console.log(url);
    }
  },[places])
  return(<>
    <input onClick={showNearCafes} onBlur={hydeNearCafes} className={styles.searchBox} ref={inputRef} type="text" placeholder="現在地から近い順"/>
    
      {showCafeToggle &&(
        <App
        showCafeToggle={showCafeToggle}
        firstCenter={firstCenter}
        />
      )}
    {toggle && (
        <div className={styles.shopsInfo}>
          <div>名前: {places.name}</div>
          <div>住所: {places.formatted_address}</div>
          <div>電話番号: {places.formatted_phone_number}</div>
          {url && <Image src={url} alt="説明" width={500} height={300} />}
        </div>
      )}
    </>
  );
}