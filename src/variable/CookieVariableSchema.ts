import TagVariableSchema from "./TagVariableSchema";

class CookieVariableSchema extends TagVariableSchema {

  readonly cookieName: string;

  readonly decodeUrlCookie: boolean;
}

export default CookieVariableSchema;