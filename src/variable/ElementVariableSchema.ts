import DomVariableSchema from "./DomVariableSchema";

interface ElementVariableSchema extends DomVariableSchema {

  readonly attribute?: string
}

export default ElementVariableSchema;