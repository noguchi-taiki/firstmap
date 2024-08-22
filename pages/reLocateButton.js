import styles from "../styles/Layout.module.css"
export default function ReLocateButton({firstCenter,currentLocation,createMap}){

    const reLocate = () => {
        if(currentLocation){
            createMap(currentLocation);
            console.log(currentLocation);
        } else {
            createMap(firstCenter);
        }
    }

    return(
        <>
            <button onClick={reLocate} className={styles.reLocateButton}>現在地へ</button>
        </>
    );
}

