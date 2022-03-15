import TagVariableSchema from "../variable/TagVariableSchema";
import Operator from "./Operator";

class Filter {

  readonly left: Filter | TagVariableSchema | string

  readonly operator: Operator;

  readonly right: Filter | TagVariableSchema | string
}

export default Filter;