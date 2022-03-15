import TagVariableSchema from "./TagVariableSchema";

class UrlVariableSchema extends TagVariableSchema {

  readonly selection: "full" | "host" | "port" | "path" | "query" | "fragment" | "protocol"
}

export default UrlVariableSchema;