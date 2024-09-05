import { useEffect, useState } from "react";
import styles from "../styles/Layout.module.css"

export default function App(){
    const [data,setData] = useState([]);

    useEffect(()=>{
        fetch('http://127.0.0.1:8000/api')
            .then((res) => res.json())
            .then((data) => setData(data))
            .catch((error) => console.error('Error:', error));
    }, []);

    return (
        <>
            {data.length > 0 ? (
                <h1 className={styles.api}>{data[0].name}</h1>
            ) : (
                <h1>Loading...</h1>
            )}
        </>
    )
}