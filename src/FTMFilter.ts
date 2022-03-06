import FTMFilterOperator from "./FTMFilterOperator";
import FTMFilterCondition from "./FTMFilterCondition";

interface FTMFilter {
  condition: FTMFilterCondition;
  operator: FTMFilterOperator;
  value: any;
}

export default FTMFilter;
