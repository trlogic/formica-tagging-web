import TagVariableSchema from "./TagVariableSchema";

interface DomVariableSchema extends TagVariableSchema {

  readonly cssSelector: string;
}

export default DomVariableSchema;