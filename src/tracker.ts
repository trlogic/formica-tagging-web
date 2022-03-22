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
  trackerConfig.trackers.forEach(tracker => initListeners(tracker));
};

//  ******************** EVENT HANDLERS  ********************
const initListeners = (tracker: TrackerSchema): void => {
  const eventSchema: EventSchema = tracker.event;
  const trackerVariableSchemas: TrackerVariableSchema[] = tracker.variables;

  tracker.triggers.forEach(triggerSchema => {
    const filters: Filter[] = triggerSchema.filters;
    switch (triggerSchema.type) {
      case "click": {
        const clickTriggerSchema: ClickTriggerSchema = triggerSchema as ClickTriggerSchema;
        const callbackfn: EventHandler = (mouseEvent, trackerVariables) => handleClick(clickTriggerSchema, eventSchema, trackerVariables);
        initListener("click", filters, trackerVariableSchemas, callbackfn)
        break;
      }
      case "scroll": {
        const scrollTriggerSchema: ScrollTriggerSchema = triggerSchema as ScrollTriggerSchema;
        const callbackfn: EventHandler = (mouseEvent, trackerVariables) => handleScroll(scrollTriggerSchema, eventSchema, trackerVariables);
        initListener("wheel", filters, trackerVariableSchemas, callbackfn)
        break;
      }
      case "submit": {
        const submitTriggerSchema: SubmitTriggerSchema = triggerSchema as SubmitTriggerSchema;
        const callbackfn: EventHandler = (mouseEvent, trackerVariables) => handleSubmit(submitTriggerSchema, eventSchema, trackerVariables);
        initListener("submit", filters, trackerVariableSchemas, callbackfn)
        break;
      }
      case "pageView": {
        const pageViewTriggerSchema: PageViewTriggerSchema = triggerSchema as PageViewTriggerSchema;
        const callbackfn: EventHandler = (mouseEvent, trackerVariables) => handlePageView(pageViewTriggerSchema, eventSchema, trackerVariables);
        initListener("pageview", filters, trackerVariableSchemas, callbackfn);
        break;
      }
      case "custom": {
        const customTriggerSchema: CustomTriggerSchema = triggerSchema as CustomTriggerSchema;
        const callbackfn: EventHandler = (mouseEvent, trackerVariables) => handleCustom(customTriggerSchema, eventSchema, trackerVariables);
        initListener(customTriggerSchema.name, filters, trackerVariableSchemas, callbackfn);
        break;
      }
    }
  });
};

const initListener = (type: string, filters: Filter[], trackerVariableSchemas: TrackerVariableSchema[], callbackFn: EventHandler) => {
  document.addEventListener(type, (e) => {
    const trackerVariables: KeyValueMap = {};
    trackerVariableSchemas.forEach(trackerVariableSchema => resolveTrackerVariable(trackerVariableSchema, e as MouseEvent));
    if (filters.length == 0 || filters.every(filter => resolveFilter(filter, trackerVariables))) {
      callbackFn(e as MouseEvent, trackerVariables);
    }
  });
};

const handleClick = (triggerSchema: ClickTriggerSchema, eventSchema: EventSchema, trackerVariables: KeyValueMap) => {
  const event: Event = buildEvent(eventSchema, trackerVariables);
  sendEvent(event);
};

const handleScroll = (triggerSchema: ScrollTriggerSchema, eventSchema: EventSchema, trackerVariables: KeyValueMap) => {
  const event: Event = buildEvent(eventSchema, trackerVariables);
  sendEvent(event);
};

const handleSubmit = (triggerSchema: SubmitTriggerSchema, eventSchema: EventSchema, trackerVariables: KeyValueMap) => {
  const event: Event = buildEvent(eventSchema, trackerVariables);
  sendEvent(event);
};

const handlePageView = (triggerSchema: PageViewTriggerSchema, eventSchema: EventSchema, trackerVariables: KeyValueMap) => {
  const event: Event = buildEvent(eventSchema, trackerVariables);
  sendEvent(event);
};

const handleCustom = (triggerSchema: CustomTriggerSchema, eventSchema: EventSchema, trackerVariables: KeyValueMap) => {
  const event: Event = buildEvent(eventSchema, trackerVariables);
  sendEvent(event);
};


//  ******************** CLIENT ********************
const sendEvent = (event: Event) => {
  /*
    axios code
   */
  console.log(event);
}


//  ******************** CONFIG ********************
interface TrackerConfig {
  readonly trackers: TrackerSchema[];
  readonly httpEventGatewayUrl: string;
  readonly authServerUrl: string;
}

//  ******************** EVENT ********************
interface Event {
  readonly name: string;
  readonly actor: string;
  readonly variables: { [key: string]: string | number | boolean }
}

interface EventSchema {
  readonly name: string;
  readonly actorMapping: string;
  readonly variableMappings: { name: string, value: string }[]
}

interface TrackerSchema {
  readonly triggers: TriggerSchema[];
  readonly variables: TrackerVariableSchema[];
  readonly event: EventSchema;
}


//  ******************** TRIGGER ********************
declare type TriggerType = "click" | "scroll" | "submit" | "pageView" | "custom";
declare type Operator =
  "isEquals"
  | "isEqualsIgnoreCase"
  | "notEquals"
  | "notEqualsIgnoreCase"
  | "isContains"
  | "isContainsIgnoreCase"
  | "notContains"
  | "notContainsIgnoreCase"
  | "isStartsWith"
  | "isStartsWithIgnoreCase"
  | "notStartsWith"
  | "notStartsWithIgnoreCase"
  | "isEndsWith"
  | "isEndsWithIgnoreCase"
  | "notEndsWith"
  | "notEndsWithIgnoreCase"
  | "isRegexMatch"
  | "isRegexMatchIgnoreCase"
  | "notRegexMatch"
  | "notRegexMatchIgnoreCase"
  | "lessThan"
  | "lessThanOrEquals"
  | "greaterThan"
  | "greaterThanOrEquals";


interface Filter {
  readonly left: TrackerVariableSchema
  readonly operator: Operator;
  readonly right: string
}

interface TriggerSchema {
  readonly type: TriggerType;
  readonly filters: Filter[];
}

interface ClickTriggerSchema extends TriggerSchema {
  justLinks: boolean;
}

interface PageViewTriggerSchema extends TriggerSchema {
}

interface SubmitTriggerSchema extends TriggerSchema {
  readonly onlyValid: boolean;
}

interface ScrollTriggerSchema extends TriggerSchema {
  readonly horizontal: boolean;
  readonly vertical: boolean;
}

interface CustomTriggerSchema extends TriggerSchema {
  readonly name: string;
}


//  ******************** TRACKER VARIABLE ********************
declare type TriggerVariableType = "element" | "text" | "attribute";
declare type TrackerVariableType = "url" | "cookie" | "element" | "visibility" | "javascript" | "trigger"; // | "ip" | "location"  |  "os" | "browser";
declare type URLSelection = "full" | "host" | "port" | "path" | "query" | "fragment" | "protocol";

interface TrackerVariableSchema {
  readonly type: TrackerVariableType;
  readonly name: string;
}

interface DomVariableSchema extends TrackerVariableSchema {
  readonly cssSelector: string;
}

interface ElementVariableSchema extends DomVariableSchema {
  readonly attribute?: string
}

interface VisibilityVariableSchema extends DomVariableSchema {
  readonly thresholdPercentage: number;
}

interface UrlVariableSchema extends TrackerVariableSchema {
  readonly selection: URLSelection
}

interface CookieVariableSchema extends TrackerVariableSchema {
  readonly cookieName: string;
  readonly decodeUrlCookie: boolean;
}

interface JavascriptVariableSchema extends TrackerVariableSchema {
  readonly code: string;
}

interface TriggerVariableSchema extends TrackerVariableSchema {
  readonly variableType: TriggerVariableType;
  readonly attribute?: string;
  readonly text?: boolean;
  readonly selection?: URLSelection;
}


// ******************** TRACKER UTILS ********************
const resolveFilter = (filter: Filter, variables: { [key: string]: string }): boolean => {
  const leftValue: string = resolveToken(filter.left, variables);
  const rightValue: string = resolveToken(filter.right, variables);
  return calculateFilter(leftValue, rightValue, filter.operator);
}

const resolveToken = (token: TrackerVariableSchema | string, variables: { [key: string]: string }): string => {
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
      return resolveUrlVariable(trackerVariableSchema as UrlVariableSchema);
    case "cookie":
      return resolveCookieVariable(trackerVariableSchema as CookieVariableSchema);
    case "element":
      return resolveElementVariable(trackerVariableSchema as ElementVariableSchema)
    case "visibility":
      return resolveVisibilityVariable(trackerVariableSchema as VisibilityVariableSchema);
    case "javascript":
      return resolveJavascriptVariable(trackerVariableSchema as JavascriptVariableSchema)
    case "trigger":
      return resolveTriggerVariable(trackerVariableSchema as TriggerVariableSchema, mouseEvent)
    default :
      return "";
  }
};

const resolveUrlVariable = (urlVariableSchema: UrlVariableSchema): string => {
  const location: Location = window.location;
  switch (urlVariableSchema.selection) {
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

const resolveCookieVariable = (cookieVariableSchema: CookieVariableSchema): string => {
  const cookieName: string = cookieVariableSchema.cookieName;

  const cookies: string[] = document.cookie.split(';')
    .map(cookie => cookie.trim())
    .filter(cookie => cookie.substring(0, cookieName.length) == cookieName)
    .map(cookie => cookieVariableSchema.decodeUrlCookie ? decodeURIComponent(cookie.substring(cookieName.length)) : cookie);

  return cookies[0] ?? "";
}

const resolveElementVariable = (elementVariableSchema: ElementVariableSchema): string => {
  const element: Element | null = document.querySelector(elementVariableSchema.cssSelector);
  return !element ? "" : !elementVariableSchema.attribute ? element.textContent ?? "" : element.getAttribute(elementVariableSchema.attribute) ?? "";
}

const resolveVisibilityVariable = (visibilityVariableSchema: VisibilityVariableSchema): string => {
  return ""; //TODO yapılacak
}

const resolveJavascriptVariable = (javascriptVariableSchema: JavascriptVariableSchema): string => {
  try {
    return eval(javascriptVariableSchema.code) ?? "";
  } catch (error) {
    console.error(error);
    return "";
  }
}

const resolveTriggerVariable = (triggerVariableSchema: TriggerVariableSchema, mouseEvent: MouseEvent): string => {
  const type: TriggerVariableType = triggerVariableSchema.variableType;
  switch (type) {
    case "element":
      return "";
    case "text":
      // @ts-ignore
      return !mouseEvent!.target ? "" : mouseEvent.target.innerText;
    case "attribute":
      // @ts-ignore
      return !mouseEvent!.target ? "" : mouseEvent.target.getAttribute(triggerVariableSchema.attribute);
    default:
      return "";
  }
}

// -----

const buildEvent = (eventSchema: EventSchema, trackerVariables: { [key: string]: string }): Event => {
  const name: string = eventSchema.name;
  const actor: string = resolveMapping(eventSchema.actorMapping, trackerVariables);
  const variables: { [key: string]: string } = {};
  eventSchema.variableMappings.forEach(variableMapping => variables[variableMapping.name] = resolveMapping(variableMapping.value, trackerVariables));
  return {name, actor, variables}
};

const resolveMapping = (mapping: string, trackerVariables: { [key: string]: string }): string => {
  const matches: string[] = findMatches(mapping, /`.*?`/g);
  matches.forEach(match => {
    const variableName: string = match.substring(1, match.length - 1);
    const variableValue: string = trackerVariables[variableName];
    mapping.replace(match, variableValue);
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
