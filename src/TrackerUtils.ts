import Filter from "./filter/Filter";
import TagVariableSchema from "./variable/TagVariableSchema";
import Operator from "./filter/Operator";

export const resolveFilter = (filter: Filter, variables: { [key: string]: string }): boolean => {
  const leftValue: string = resolveToken(filter.left, variables);
  const rightValue: string = resolveToken(filter.right, variables);
  return calculateFilter(leftValue, rightValue, filter.operator);
}

export const resolveVariable = (mapping: string, tagVariables: { [key: string]: string }): string => {
  const matches: Array<string> = findMatches(mapping, /`.*?`/g);
  matches.forEach(match => {
    const variableName: string = match.substring(1, match.length - 1);
    const variableValue: string = tagVariables[variableName];
    mapping.replace(match, variableValue);
  });

  return mapping;
}

const resolveToken = (token: TagVariableSchema | string, variables: { [key: string]: string }): string => {
  if (typeof token == "object") {
    const variable: TagVariableSchema = token as TagVariableSchema;
    return variables[variable.name];
  } else {
    return token;
  }
}

const calculateFilter = (leftValue: string, rightValue: string, operator: Operator): boolean => {
  leftValue = leftValue ?? "";
  rightValue = rightValue ?? "";

  switch (operator) {
    case Operator.IS_EQUALS:
      return leftValue == rightValue;
    case Operator.IS_EQUALS_IGNORE_CASE: {
      return leftValue.toLowerCase() == rightValue.toLowerCase();
    }
    case Operator.NOT_EQUALS:
      return leftValue != rightValue;
    case Operator.NOT_EQUALS_IGNORE_CASE: {
      return leftValue.toLowerCase() != rightValue.toLowerCase();
    }
    case Operator.IS_CONTAINS: {
      return leftValue.includes(rightValue);
    }
    case Operator.IS_CONTAINS_IGNORE_CASE: {
      return leftValue.toLowerCase().includes(rightValue.toLowerCase());
    }
    case Operator.NOT_CONTAINS: {
      return !leftValue.includes(rightValue);
    }
    case Operator.NOT_CONTAINS_IGNORE_CASE: {
      return !leftValue.toLowerCase().includes(rightValue.toLowerCase());
    }
    case Operator.IS_STARTS_WITH: {
      return leftValue.startsWith(rightValue);
    }
    case Operator.IS_STARTS_WITH_IGNORE_CASE: {
      return leftValue.toLowerCase().startsWith(rightValue.toLowerCase());
    }
    case Operator.NOT_STARTS_WITH: {
      return !leftValue.startsWith(rightValue);
    }
    case Operator.NOT_STARTS_WITH_IGNORE_CASE: {
      return !leftValue.toLowerCase().startsWith(rightValue.toLowerCase());
    }
    case Operator.IS_ENDS_WITH: {
      return leftValue.endsWith(rightValue);
    }
    case Operator.IS_ENDS_WITH_IGNORE_CASE: {
      return leftValue.toLowerCase().endsWith(rightValue.toLowerCase());
    }
    case Operator.NOT_ENDS_WITH: {
      return !leftValue.endsWith(rightValue);
    }
    case Operator.NOT_ENDS_WITH_IGNORE_CASE: {
      return !leftValue.toLowerCase().endsWith(rightValue.toLowerCase());
    }
    case Operator.IS_REGEX_MATCH: {
      const result = new RegExp(`${rightValue ?? ""}`, "g").exec(leftValue);
      return result != undefined && result.length > 0;
    }
    case Operator.IS_REGEX_MATCH_IGNORE_CASE: {
      const result = new RegExp(`${rightValue ?? ""}`, "g").exec(leftValue.toLowerCase());
      return result != undefined && result.length > 0;
    }
    case Operator.NOT_REGEX_MATCH: {
      const result = new RegExp(`${rightValue ?? ""}`, "g").exec(leftValue);
      return !(result != undefined && result.length > 0);
    }
    case Operator.NOT_REGEX_MATCH_IGNORE_CASE:
      const result = new RegExp(`${rightValue ?? ""}`, "g").exec(leftValue ?? "".toLowerCase());
      return !(result != undefined && result.length > 0);
    case Operator.LESS_THAN: {
      return (Number.parseFloat(leftValue) < Number.parseFloat(rightValue));
    }
    case Operator.LESS_THAN_OR_EQUALS: {
      return (Number.parseFloat(leftValue) <= Number.parseFloat(rightValue));
    }
    case Operator.GREATER_THAN: {
      return (Number.parseFloat(leftValue) > Number.parseFloat(rightValue));
    }
    case Operator.GREATER_THAN_OR_EQUALS: {
      return (Number.parseFloat(leftValue) >= Number.parseFloat(rightValue));
    }
    default: {
      return false;
    }
  }
}

export const findMatches = (string: string, regex: RegExp): Array<string> => {
  const matches: Array<string> = new Array<string>();
  let regExpExecArray: RegExpExecArray | null;
  while ((regExpExecArray = regex.exec(string)) != undefined) {
    const match = regExpExecArray[0];
    matches.push(match)
  }

  return matches;
}

