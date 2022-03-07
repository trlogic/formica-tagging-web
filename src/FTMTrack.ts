import FTMFilter from "./FTMFilter";
import FTMTrigger from "./FTMTrigger";

interface FTMTrack {
  trigger:FTMTrigger;
  filters: Array<FTMFilter>
}



export default FTMTrack;
