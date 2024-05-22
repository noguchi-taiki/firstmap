import {useRef,useEffect,useState} from 'react';

export default function Map(){
  const ref = useRef(null);
  const [map, setMap] = useState();

 useEffect(() => {
  if (ref.current && !map) {
    setMap(new window.google.maps.Map(ref.current,{
       center:{
          lat: 35.6809591,
          lng: 139.7673068,
      },
      zoom:8,
    }));

  }
}, [ref, map]);

return(
    <div ref={ref} style={{height:500, width:500}} />
  )
}
