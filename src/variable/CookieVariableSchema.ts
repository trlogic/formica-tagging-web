import TagVariableSchema from "./TagVariableSchema";

interface CookieVariableSchema extends TagVariableSchema {

  readonly cookieName: string;

  readonly decodeUrlCookie: boolean;
}

export default CookieVariableSchema;