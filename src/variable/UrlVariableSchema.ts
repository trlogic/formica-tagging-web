import TagVariableSchema from "./TagVariableSchema";

interface UrlVariableSchema extends TagVariableSchema {

  readonly selection: "full" | "host" | "port" | "path" | "query" | "fragment" | "protocol"
}

export default UrlVariableSchema;