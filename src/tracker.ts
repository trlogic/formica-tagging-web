//  ******************** TRACKER  ********************
import {Axios} from "axios";

declare type EventHandler = (mouseEvent: MouseEvent, variableValues: KeyValueMap) => void;
declare type KeyValueMap = { [key: string]: string };

const axios: Axios = new Axios();
const trackerConfig: TrackerConfig = {
  authServerUrl: "",
  httpEventGatewayUrl: "",
  trackers: []
}

export const run = (): void => {
  trackerConfig.trackers.forEach(tracker => tracker.triggers.forEach(triggerSchema => initListener(triggerSchema, tracker.variables, tracker.event)));
};

//  ******************** EVENT HANDLERS  ********************

const initListener = (triggerSchema: TriggerSchema, trackerVariableSchemas: TrackerVariableSchema[], eventSchema: EventSchema) => {
  document.addEventListener(triggerSchema.name, (e) => {
    const trackerVariables: KeyValueMap = {};
    trackerVariableSchemas.forEach(trackerVariableSchema => {
      trackerVariables[trackerVariableSchema.name]=resolveTrackerVariable(trackerVariableSchema, e as MouseEvent)
    });

    const validated: boolean = validate(e as MouseEvent, triggerSchema, trackerVariables);
    if (validated) {
      const event: Event = buildEvent(eventSchema, trackerVariables);
      sendEvent(event);
    }
  });
};

const validate = (e: MouseEvent, triggerSchema: TriggerSchema, trackerVariables: KeyValueMap): boolean => {
  switch (triggerSchema.name) {
    case "click":
      const clickOption: ClickOption = triggerSchema.option as ClickOption;
      // @ts-ignore
      if (clickOption.justLinks && !e.target.hasAttribute("href")) return false;
      else break;
    case "scroll":
      // TODO horizontal ve vertical flag kontrolleri yapılacak
      break
  }

  return triggerSchema.filters.length == 0 || triggerSchema.filters.every(filter => resolveFilter(filter, trackerVariables));
}


//  ******************** CLIENT ********************
const sendEvent = (event: Event) => {
  /*
    axios code
   */
  console.log(event);
}


//  ******************** CONFIG ********************
interface TrackerConfig {
  trackers: TrackerSchema[];
  httpEventGatewayUrl: string;
  authServerUrl: string;
}

//  ******************** EVENT ********************
interface Event {
  name: string;
  actor: string;
  variables: { [key: string]: string | number | boolean }
}

interface EventSchema {
  name: string;
  actorMapping: string;
  variableMappings: { name: string, value: string }[]
}

interface TrackerSchema {
  triggers: TriggerSchema[];
  variables: TrackerVariableSchema[];
  event: EventSchema;
}


//  ******************** TRIGGER ********************
declare type Operator =
  "isEquals" | "isEqualsIgnoreCase" | "notEquals" | "notEqualsIgnoreCase" |
  "isContains" | "isContainsIgnoreCase" | "notContains" | "notContainsIgnoreCase" |
  "isStartsWith" | "isStartsWithIgnoreCase" | "notStartsWith" | "notStartsWithIgnoreCase" |
  "isEndsWith" | "isEndsWithIgnoreCase" | "notEndsWith" | "notEndsWithIgnoreCase" |
  "isRegexMatch" | "isRegexMatchIgnoreCase" | "notRegexMatch" | "notRegexMatchIgnoreCase" |
  "lessThan" | "lessThanOrEquals" | "greaterThan" | "greaterThanOrEquals";

interface Filter {
  left: TrackerVariableSchema
  operator: Operator;
  right: string
}

declare type ClickOption = { justLinks: boolean }
declare type ScrollOptions = { horizontal: boolean; vertical: boolean; }

interface TriggerSchema {
  name: string;
  filters: Filter[];
  option: ClickOption | ScrollOptions,
}

//  ******************** TRACKER VARIABLE ********************
declare type TrackerVariableType = "url" | "cookie" | "element" | "visibility" | "javascript" | "trigger"; // | "ip" | "location"  |  "os" | "browser";
declare type TriggerVariableType = "element" | "history";
declare type URLSelection = "full" | "host" | "port" | "path" | "query" | "fragment" | "protocol";
declare type HistorySelection = "newUrl" | "oldUrl" | "newState" | "oldState" | "changeSource";

declare type HistoryOption = { selection: HistorySelection };
declare type ElementOption = { cssSelector: string, attribute?: string, urlSelection?: UrlOption }
declare type VisibilityOption = { cssSelector: string, thresholdPercentage: number }
declare type UrlOption = { selection: URLSelection }
declare type CookieOption = { cookieName: string; decodeUrlCookie: boolean; }
declare type JavascriptOption = { code: string; }
declare type TriggerOption = { type: TriggerVariableType, option: ElementOption | HistoryOption }

interface TrackerVariableSchema {
  type: TrackerVariableType;
  name: string;
  option: ElementOption | VisibilityOption | UrlOption | CookieOption | JavascriptOption | TriggerOption;
}

interface TriggerVariableSchema extends TrackerVariableSchema {
  variableType: TriggerVariableType;
  attribute?: string;
  text?: boolean;
  selection?: URLSelection;
}


// ******************** TRACKER UTILS ********************
const resolveFilter = (filter: Filter, variables: KeyValueMap): boolean => {
  const leftValue: string = resolveToken(filter.left, variables);
  const rightValue: string = resolveToken(filter.right, variables);
  return calculateFilter(leftValue, rightValue, filter.operator);
}

const resolveToken = (token: TrackerVariableSchema | string, variables: KeyValueMap): string => {
  return typeof token == "object" ? variables[(token as TrackerVariableSchema).name] : token;
}

const calculateFilter = (leftValue: string, rightValue: string, operator: Operator): boolean => {
  switch (operator) {
    case "isEquals":
      return leftValue == rightValue;
    case "isEqualsIgnoreCase":
      return leftValue.toLowerCase() == rightValue.toLowerCase();
    case "notEquals":
      return leftValue != rightValue;
    case "notEqualsIgnoreCase":
      return leftValue.toLowerCase() != rightValue.toLowerCase();
    case "isContains":
      return leftValue.includes(rightValue);
    case "isContainsIgnoreCase":
      return leftValue.toLowerCase().includes(rightValue.toLowerCase());
    case "notContains":
      return !leftValue.includes(rightValue);
    case "notContainsIgnoreCase":
      return !leftValue.toLowerCase().includes(rightValue.toLowerCase());
    case "isStartsWith":
      return leftValue.startsWith(rightValue);
    case "isStartsWithIgnoreCase":
      return leftValue.toLowerCase().startsWith(rightValue.toLowerCase());
    case "notStartsWith":
      return !leftValue.startsWith(rightValue);
    case "notStartsWithIgnoreCase":
      return !leftValue.toLowerCase().startsWith(rightValue.toLowerCase());
    case "isEndsWith":
      return leftValue.endsWith(rightValue);
    case "isEndsWithIgnoreCase":
      return leftValue.toLowerCase().endsWith(rightValue.toLowerCase());
    case "notEndsWith":
      return !leftValue.endsWith(rightValue);
    case "notEndsWithIgnoreCase":
      return !leftValue.toLowerCase().endsWith(rightValue.toLowerCase());
    case "lessThan":
      return (Number.parseFloat(leftValue) < Number.parseFloat(rightValue));
    case "lessThanOrEquals":
      return (Number.parseFloat(leftValue) <= Number.parseFloat(rightValue));
    case "greaterThan":
      return (Number.parseFloat(leftValue) > Number.parseFloat(rightValue));
    case "greaterThanOrEquals":
      return (Number.parseFloat(leftValue) >= Number.parseFloat(rightValue));
    case "isRegexMatch": {
      const result = new RegExp(`${rightValue}`, "g").exec(leftValue);
      return result != undefined && result.length > 0;
    }
    case "isRegexMatchIgnoreCase": {
      const result = new RegExp(`${rightValue}`, "g").exec(leftValue.toLowerCase());
      return result != undefined && result.length > 0;
    }
    case "notRegexMatch": {
      const result = new RegExp(`${rightValue}`, "g").exec(leftValue);
      return !(result != undefined && result.length > 0);
    }
    case "notRegexMatchIgnoreCase": {
      const result = new RegExp(`${rightValue}`, "g").exec(leftValue.toLowerCase());
      return !(result != undefined && result.length > 0);
    }
    default:
      return false;
  }
}

// -----

const resolveTrackerVariable = (trackerVariableSchema: TrackerVariableSchema, mouseEvent: MouseEvent): string => {
  switch (trackerVariableSchema.type) {
    case "url":
      return resolveUrlVariable(trackerVariableSchema);
    case "cookie":
      return resolveCookieVariable(trackerVariableSchema);
    case "element":
      return resolveElementVariable(trackerVariableSchema)
    case "visibility":
      return resolveVisibilityVariable(trackerVariableSchema);
    case "javascript":
      return resolveJavascriptVariable(trackerVariableSchema)
    case "trigger":
      return resolveTriggerVariable(trackerVariableSchema, mouseEvent)
    default :
      return "";
  }
};

const resolveUrlVariable = (trackerVariableSchema: TrackerVariableSchema): string => {
  const location: Location = window.location;
  const option: UrlOption = trackerVariableSchema.option as UrlOption;
  switch (option.selection) {
    case "full":
      return location.href;
    case "host":
      return location.hostname;
    case "port":
      return location.port;
    case "path":
      return location.pathname;
    case "query":
      return location.search.substring(1);
    case "fragment":
      let parts: string[] = location.href.split("#");
      return parts.length > 1 ? parts[1] : "";
    case "protocol":
      return location.search.substring(0, location.search.length - 2);
    default:
      return "";
  }
}

const resolveCookieVariable = (trackerVariableSchema: TrackerVariableSchema): string => {
  const option: CookieOption = trackerVariableSchema.option as CookieOption;
  const cookieName: string = option.cookieName;
  const cookies: string[] = document.cookie.split(';')
    .map(cookie => cookie.trim())
    .filter(cookie => cookie.substring(0, cookieName.length) == cookieName)
    .map(cookie => option.decodeUrlCookie ? decodeURIComponent(cookie.substring(cookieName.length)) : cookie);

  return cookies[0] ?? "";
}

const resolveElementVariable = (trackerVariableSchema: TrackerVariableSchema): string => {
  const option: ElementOption = trackerVariableSchema.option as ElementOption;
  const element: Element | null = document.querySelector(option.cssSelector);
  return !element ? "" : !option.attribute ? element.textContent ?? "" : element.getAttribute(option.attribute) ?? "";
}

const resolveVisibilityVariable = (trackerVariableSchema: TrackerVariableSchema): string => {
  const option: VisibilityOption = trackerVariableSchema.option as VisibilityOption;
  return ""; //TODO yapılacak
}

const resolveJavascriptVariable = (trackerVariableSchema: TrackerVariableSchema): string => {
  const option: JavascriptOption = trackerVariableSchema.option as JavascriptOption;
  try {
    return eval(option.code) ?? "";
  } catch (error) {
    console.error(error);
    return "";
  }
}

const resolveTriggerVariable = (trackerVariableSchema: TrackerVariableSchema, mouseEvent: MouseEvent): string => {
  const option: TriggerOption = trackerVariableSchema.option as TriggerOption;
  switch (option.type) {
    case "element": {
      const elementOption: ElementOption = option.option as ElementOption;
      const parent: Element = document.createElement("div") as Element;
      parent.append(mouseEvent.target.cloneNode(true));
      const element: Element = parent.querySelector(elementOption.cssSelector) as Element;
      // @ts-ignore
      return element ? elementOption.attribute ? element.getAttribute(elementOption.attribute) : element.innerText : "";
    }
    case "history": {
      //TODO yapılacak
      return "";
    }
    default:
      return "";
  }
}

// -----

const buildEvent = (eventSchema: EventSchema, trackerVariables: KeyValueMap): Event => {
  const name: string = eventSchema.name;
  const actor: string = resolveMapping(eventSchema.actorMapping, trackerVariables);
  const variables: KeyValueMap = {};
  eventSchema.variableMappings.forEach(variableMapping => variables[variableMapping.name] = resolveMapping(variableMapping.value, trackerVariables));
  return {name, actor, variables}
};

const resolveMapping = (mapping: string, trackerVariables: KeyValueMap): string => {
  const matches: string[] = findMatches(mapping, /`.*?`/g);
  matches.forEach(match => {
    const variableName: string = match.substring(1, match.length - 1);
    const variableValue: string = trackerVariables[variableName];
    mapping = mapping.replace(match, variableValue);
  });

  return mapping;
}

const findMatches = (string: string, regex: RegExp): string[] => {
  const matches: string[] = [];
  let regExpExecArray: RegExpExecArray | null;
  while ((regExpExecArray = regex.exec(string)) != undefined) {
    const match = regExpExecArray[0];
    matches.push(match)
  }

  return matches;
}
