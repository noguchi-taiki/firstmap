"use cliant"//wrapperだけでは勝手にCSRになってくれないらしいからビルド時にエラーが発生するっぽい。（Next.js13はデフォルトがgaSSR）

import { Wrapper } from "@googlemaps/react-wrapper";
import Map from "./map";
import styles from "../styles/Layout.module.css";

const Main = () => {
  return (
    <div className={styles.mapContainer}>
      {/* <Wrapper libraries={['places']} apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY}> */}
      <Wrapper libraries={['places']} apiKey="AIzaSyDg7bMsZ6b1kdCCLxc8mp-kggQsatJ_u64">
        <Map />
      </Wrapper>
    </div>
  );
};

export default Main;
