import TagVariableSchema from "./TagVariableSchema";

interface JavascriptVariableSchema extends TagVariableSchema{

  readonly code: string;
}

export default JavascriptVariableSchema;