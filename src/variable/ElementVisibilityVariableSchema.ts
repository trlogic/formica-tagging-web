import DomVariableSchema from "./DomVariableSchema";

interface ElementVisibilityVariableSchema extends DomVariableSchema {

  readonly thresholdPercentage: number;
}

export default ElementVisibilityVariableSchema;