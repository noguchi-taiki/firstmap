import { useEffect, useState } from "react";
import styles from "../styles/Layout.module.css"

export default function App({showCafeToggle,firstCenter}){
    const [data,setData] = useState([]);
    let lat = firstCenter.lat;
    let lng = firstCenter.lng;

    useEffect(()=>{
        fetch(`http://127.0.0.1:8000/api?lat=${lat}&lng=${lng}`)
            .then((res) => res.json())
            .then((data) => setData(data))
            .catch((error) => console.error('Error:', error));
    }, []);

    return (
        <>
            {(data.length > 0)&&(showCafeToggle) &&  (
                <>
                    <ul className={styles.nearCafes}>
                        <li>{data[0].name}</li>
                        <li>{data[1].name}</li>
                        <li>{data[2].name}</li>
                        <li>{data[3].name}</li>
                        <li>{data[4].name}</li>
                    </ul>
                </>
            )}
        </>
    )
}