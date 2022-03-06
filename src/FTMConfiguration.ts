import FTMFilter from "./FTMFilter";
import FTMTrigger from "./FTMTrigger";

interface FTMConfiguration {
  trigger:FTMTrigger;
  filters: Array<FTMFilter>
}



export default FTMConfiguration;
