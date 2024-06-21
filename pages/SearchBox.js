import { useRef, useEffect } from 'react';

export default function SearchBox({ map,firstCenter,setDestination}) {
  const inputRef = useRef(null);
  const markers = useRef([]); // マーカーを使う際のref定義

  useEffect(() => {
    if (map && inputRef.current) {
      const autocompleteService = new google.maps.places.AutocompleteService();
      const input = inputRef.current;

      const searchBox = new google.maps.places.SearchBox(input, {
        types: ['cafe'], // カフェのみを検索する
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
        // markers.current = [];

        const bounds = new google.maps.LatLngBounds();
        places.forEach((place) => {
          if (!place.geometry || !place.geometry.location) {
            return;
          }

          // カフェ以外の場所を選択した場合はクリア
          if (!place.types.includes('cafe')) {
            input.value = '';
            map.setCenter(firstCenter);
            input.placeholder = 'こちらはカフェもしくは喫茶店ではありません。';
            return;
          }

          // マーカーを作成して地図上に表示する。(Maekerメソッド) 
          const marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
          });

          markers.current.push(marker);

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
    };
  }, [map,setDestination]);

  return <input ref={inputRef} type="text" placeholder=" カフェを検索" style={{ width: "350px", marginBottom: "5px" ,marginRight: "25px"}} />;
}
