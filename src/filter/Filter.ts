import TagVariableSchema from "../variable/TagVariableSchema";
import Operator from "./Operator";

interface Filter {

  readonly left: TagVariableSchema

  readonly operator: Operator;

  readonly right: string
}

export default Filter;