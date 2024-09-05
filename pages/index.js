"use cliant"//wrapperだけでは勝手にCSRになってくれないらしいからビルド時にエラーが発生する（Next.js13はデフォルトがSSR）

import { Wrapper } from "@googlemaps/react-wrapper";
import Map from "./Map";
import styles from "../styles/Layout.module.css";

export default function Main(){
  return (
    <div className={styles.mapContainer}>
      <Wrapper libraries={['places']} apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY}>
        <Map />
      </Wrapper>
    </div>
  );
};