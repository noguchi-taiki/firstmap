import { Wrapper } from "@googlemaps/react-wrapper";
import Map from "./map";
import styles from "../styles/Layout.module.css";

export default function Test(){
  return (
    <>
      <div className={styles.mapContainer}>
        <Wrapper libraries={['places']} apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY} >
          <Map/>
        </Wrapper>
      </div>
  </>
  );
}