import { useEffect, useState } from "react";
import styles from "../styles/Layout.module.css"

export default function App({firstCenter}){
    const [data,setData] = useState([]);
    console.log(firstCenter)

    useEffect((firstCenter)=>{
        if(firstCenter){
        async function fetchData() {
            const url = 'http://127.0.0.1:8000/api?lat=35.6895&lng=139.6917';
            // const url = `http://127.0.0.1:8000/api?lat=${firstCenter.lat}&lng=${firstCenter.lng}`;
            await fetch(url)
            .then((res) => res.json())
            .then((data) => setData(data))
            // .then((data)=> (Object.values(data)))//できれば配列として受け取りたいがオブジェクトにての実装も可能なので、一旦保留
            .catch((error) => console.error('Error:', error));   
        }
        fetchData();
        }
    }, [firstCenter]);
    return (
        <>
            {data.length > 0 ? (
                        <ul className={styles.nearCafes}>
                        <li>{data[0].name}</li>
                        <li>{data[1].name}</li>
                        <li>{data[2].name}</li>
                        <li>{data[3].name}</li>
                        <li>{data[4].name}</li>
                      </ul>
            ) : (
                <h1>Loading...</h1>
            )}
        </>
    )
}