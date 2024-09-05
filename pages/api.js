import { useEffect, useState } from "react";
import styles from "../styles/Layout.module.css"

export default function App(){
    const [data,setData] = useState('');

    useEffect(()=>{
        fetch('http://127.0.0.1:8000/api')
            .then((res) => res.json())
            .then((res) => setData(res))
            .catch((error) => console.error('Error:', error));
    }, []);

    return (
        <>
            <h1 className={styles.api}>{data[0].name}</h1>
        </>
    )
}