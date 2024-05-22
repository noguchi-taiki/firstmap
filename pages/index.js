import { Wrapper} from "@googlemaps/react-wrapper";
import Map from "./map";

export default function Test(){
  return (
  <Wrapper apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY}><Map/></Wrapper>
)}
