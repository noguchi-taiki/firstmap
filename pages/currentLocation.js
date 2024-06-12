
export function setCurrentLocationMarker(map, position){
    //縁の薄い青丸
    new google.maps.Circle({
        strokeColor: '#115EC3',
        strokeOpacity: 0.2,
        strokeWeight: 1,
        fillColor: '#115EC3',
        fillOpacity: 0.2,
        map: map,
        center: position,
        radius: 100
    });        
    //  中央の濃い青丸
    new google.maps.Marker({
        position: position,
        map: map,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: '#115EC3',
          fillOpacity: 1,
          strokeColor: 'white',
          strokeWeight: 2,
          scale: 7
        }, 
    });
}