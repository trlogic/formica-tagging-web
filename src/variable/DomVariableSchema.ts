import TagVariableSchema from "./TagVariableSchema";

abstract class DomVariableSchema extends TagVariableSchema {

  readonly cssSelector: string;
}

export default DomVariableSchema;