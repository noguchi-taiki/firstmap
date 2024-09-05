// "use client"

// import { useEffect, useState } from "react";

// export default function ShowCafes({map,position}){
//     const [cafes,setcafes] = useState([]);
//     useEffect(()=>{
//         if(position){
//             const serves = new google.maps.places.PlacesService(map);
//             const request = {
//                 location: position,
//                 language: 'ja',
//                 radius: 1500,
//                 type: ['cafe'],
//             }

//             setcafes(serves.nearbySearch(request));
//         }

//         console.log(cafes);
//     },[map,position])
//     return(<></>);
// }