import {useRef,useEffect,useState} from 'react';
import SearchBox from './SearchBox';

export default function Map(){
  const ref = useRef(null);
  const [map, setMap] = useState(null);
  const firstCenter = { lat: 35.6809591, lng: 139.7673068,};

 useEffect(() => {
  if (ref.current && !map) {
    setMap(new window.google.maps.Map(ref.current,{
      center: firstCenter,
      zoom:15,
      mapTypeControl: false,//航空写真とかのやつを非表示
      streetViewControl: false,//ストリートビュー
      fullscreenControl: false,//フルスクリーン（全画面表示）
    }));
  }
}, [ref, map]);

return(
  <div>
      <SearchBox map={map} firstCenter={firstCenter} style={{height: "30px" , width:"350px"}} />
      <div ref={ref} style={{ height: "320px", width: "350px" }} />
    </div>
  );
}
