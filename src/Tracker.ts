//  ******************** TRACKER  ********************
import {Axios} from "axios";

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
  const trackerVariableSchemas: Array<TrackerVariableSchema> = tracker.variables;

  tracker.triggers.forEach(triggerSchema => {
    const filters: Array<Filter> = triggerSchema.filters;
    switch (triggerSchema.type) {
      case TriggerType.CLICK: {
        const clickTriggerSchema: ClickTriggerSchema = triggerSchema as ClickTriggerSchema;
        const callbackfn: EventHandler = (e, trackerVariables: { [key: string]: string }) => handleClick(clickTriggerSchema, eventSchema, trackerVariables);
        initListener("click", filters, trackerVariableSchemas, callbackfn)
        break;
      }
      case TriggerType.SCROLL: {
        const scrollTriggerSchema: ScrollTriggerSchema = triggerSchema as ScrollTriggerSchema;
        const callbackfn: EventHandler = (e, trackerVariables: { [key: string]: string }) => handleScroll(scrollTriggerSchema, eventSchema, trackerVariables);
        initListener("scroll", filters, trackerVariableSchemas, callbackfn)
        break;
      }
      case TriggerType.FORM_SUBMISSION: {
        const formSubmissionTriggerSchema: FormSubmissionTriggerSchema = triggerSchema as FormSubmissionTriggerSchema;
        const callbackfn: EventHandler = (e, trackerVariables: { [key: string]: string }) => handleFormSubmission(formSubmissionTriggerSchema, eventSchema, trackerVariables);
        initListener("formsubmission", filters, trackerVariableSchemas, callbackfn)
        break;
      }
      case TriggerType.PAGE_VIEW: {
        const pageViewTriggerSchema: PageViewTriggerSchema = triggerSchema as PageViewTriggerSchema;
        const callbackfn: EventHandler = (e, trackerVariables: { [key: string]: string }) => handlePageView(pageViewTriggerSchema, eventSchema, trackerVariables);
        initListener("pageview", filters, trackerVariableSchemas, callbackfn);
        break;
      }
      case TriggerType.CUSTOM: {
        const customTriggerSchema: CustomTriggerSchema = triggerSchema as CustomTriggerSchema;
        const callbackfn: EventHandler = (e, trackerVariables: { [key: string]: string }) => handleCustom(customTriggerSchema, eventSchema, trackerVariables);
        initListener(customTriggerSchema.name, filters, trackerVariableSchemas, callbackfn);
        break;
      }
    }
  });
};

const initListener = (type: string, filters: Array<Filter>, trackerVariableSchemas: Array<TrackerVariableSchema>, callbackFn: EventHandler) => {
  document.addEventListener(type, (e) => {
    const trackerVariables: { [key: string]: string } = {};
    trackerVariableSchemas.forEach(trackerVariableSchema => resolveTrackerVariable(trackerVariableSchema));
    if (filters.length == 0 || filters.every(filter => resolveFilter(filter, trackerVariables))) {
      callbackFn(e, trackerVariables);
    }
  });
};

const handleClick = (triggerSchema: ClickTriggerSchema, eventSchema: EventSchema, trackerVariables: { [key: string]: string }) => {
  const event: Event = buildEvent(eventSchema, trackerVariables);
  sendEvent(event);
};

const handleScroll = (triggerSchema: ScrollTriggerSchema, eventSchema: EventSchema, trackerVariables: { [key: string]: string }) => {
  const event: Event = buildEvent(eventSchema, trackerVariables);
  sendEvent(event);
};

const handleFormSubmission = (triggerSchema: FormSubmissionTriggerSchema, eventSchema: EventSchema, trackerVariables: { [key: string]: string }) => {
  const event: Event = buildEvent(eventSchema, trackerVariables);
  sendEvent(event);
};

const handlePageView = (triggerSchema: PageViewTriggerSchema, eventSchema: EventSchema, trackerVariables: { [key: string]: string }) => {
  const event: Event = buildEvent(eventSchema, trackerVariables);
  sendEvent(event);
};

const handleCustom = (triggerSchema: CustomTriggerSchema, eventSchema: EventSchema, trackerVariables: { [key: string]: string }) => {
  const event: Event = buildEvent(eventSchema, trackerVariables);
  sendEvent(event);
};

declare type EventHandler = (e: any, variableValues: { [key: string]: string }) => void;


//  ******************** CLIENT ********************
const sendEvent = (event: Event) => {
  /*
    axios code
   */
  console.log(event);
}


//  ******************** CONFIG ********************
interface TrackerConfig {

  readonly trackers: Array<TrackerSchema>;

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

  readonly variableMappings: Array<{ name: string, value: string }>
}

interface TrackerSchema {

  readonly triggers: Array<TriggerSchema>;

  readonly variables: Array<TrackerVariableSchema>;

  readonly event: EventSchema;
}


//  ******************** TRIGGER ********************
enum TriggerType {

  CLICK = "click",

  SCROLL = "scroll",

  FORM_SUBMISSION = "submit",

  PAGE_VIEW = "pageView",

  CUSTOM = "custom",
}

enum Operator {

  IS_EQUALS,
  IS_EQUALS_IGNORE_CASE,

  NOT_EQUALS,
  NOT_EQUALS_IGNORE_CASE,

  IS_CONTAINS,
  IS_CONTAINS_IGNORE_CASE,

  NOT_CONTAINS,
  NOT_CONTAINS_IGNORE_CASE,

  IS_STARTS_WITH,
  IS_STARTS_WITH_IGNORE_CASE,

  NOT_STARTS_WITH,
  NOT_STARTS_WITH_IGNORE_CASE,

  IS_ENDS_WITH,
  IS_ENDS_WITH_IGNORE_CASE,

  NOT_ENDS_WITH,
  NOT_ENDS_WITH_IGNORE_CASE,

  IS_REGEX_MATCH,
  IS_REGEX_MATCH_IGNORE_CASE,

  NOT_REGEX_MATCH,
  NOT_REGEX_MATCH_IGNORE_CASE,

  LESS_THAN,
  LESS_THAN_OR_EQUALS,
  GREATER_THAN,
  GREATER_THAN_OR_EQUALS,
}

interface Filter {

  readonly left: TrackerVariableSchema

  readonly operator: Operator;

  readonly right: string
}

interface TriggerSchema {

  readonly type: TriggerType;

  readonly filters: Array<Filter>;
}

interface ClickTriggerSchema extends TriggerSchema {

  justLinks: boolean;
}

interface PageViewTriggerSchema extends TriggerSchema {
}

interface FormSubmissionTriggerSchema extends TriggerSchema {

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
enum TrackerVariableType {

  URL = "url",

  COOKIE = "cookie",

  ELEMENT = "element",

  VISIBILITY = "visibilty",

  JAVASCRIPT = "javascript",

  OS = "os",

  IP = "ip",

  LOCATION = "",

  BROWSER = "browser",

  DEVICE = "device"
}

enum TriggerVariableType {

  ELEMENT = "element",

  ID = "id",

  CLASS = "class",

  TARGET = "target",

  URL = "url",

  TEXT = "text"
}

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

  readonly selection: "full" | "host" | "port" | "path" | "query" | "fragment" | "protocol"
}

interface CookieVariableSchema extends TrackerVariableSchema {

  readonly cookieName: string;

  readonly decodeUrlCookie: boolean;
}

interface JavascriptVariableSchema extends TrackerVariableSchema {

  readonly code: string;
}

interface TriggerVariableSchema extends TrackerVariableSchema {

}


// ******************** TRACKER UTILS ********************
const resolveFilter = (filter: Filter, variables: { [key: string]: string }): boolean => {
  const leftValue: string = resolveToken(filter.left, variables);
  const rightValue: string = resolveToken(filter.right, variables);
  return calculateFilter(leftValue, rightValue, filter.operator);

}

const resolveTrackerVariable = (trackerVariableSchema: TrackerVariableSchema): string => {
  switch (trackerVariableSchema.type) {
    case TrackerVariableType.URL:
      return resolveUrlVariable(trackerVariableSchema as UrlVariableSchema);
    case TrackerVariableType.COOKIE:
      return resolveCookieVariable(trackerVariableSchema as CookieVariableSchema);
    case TrackerVariableType.ELEMENT:
      return resolveElementVariable(trackerVariableSchema as ElementVariableSchema)
    case TrackerVariableType.VISIBILITY:
      return resolveVisibilityVariable(trackerVariableSchema as VisibilityVariableSchema);
    case TrackerVariableType.JAVASCRIPT:
      return resolveJavascriptVariable(trackerVariableSchema as JavascriptVariableSchema)
    default :
      return "";
  }
};

const buildEvent = (eventSchema: EventSchema, trackerVariables: { [key: string]: string }): Event => {
  const name: string = eventSchema.name;
  const actor: string = resolveMapping(eventSchema.actorMapping, trackerVariables);
  const variables: { [key: string]: string } = {};
  eventSchema.variableMappings.forEach(variableMapping => variables[variableMapping.name] = resolveMapping(variableMapping.value, trackerVariables));
  return {name, actor, variables}
};

const resolveMapping = (mapping: string, trackerVariables: { [key: string]: string }): string => {
  const matches: Array<string> = findMatches(mapping, /`.*?`/g);
  matches.forEach(match => {
    const variableName: string = match.substring(1, match.length - 1);
    const variableValue: string = trackerVariables[variableName];
    mapping.replace(match, variableValue);
  });

  return mapping;
}

const resolveToken = (token: TrackerVariableSchema | string, variables: { [key: string]: string }): string => {
  if (typeof token == "object") {
    const variable: TrackerVariableSchema = token as TrackerVariableSchema;
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
      let parts: Array<string> = location.href.split("#");
      return parts.length > 1 ? parts[1] : "";
    case "protocol":
      return location.search.substring(0, location.search.length - 2);
    default:
      return "";
  }
}

const resolveCookieVariable = (cookieVariableSchema: CookieVariableSchema): string => {
  const cookieName: string = cookieVariableSchema.cookieName;

  const cookies: Array<string> = document.cookie.split(';')
    .map(cookie => cookie.trim())
    .filter(cookie => cookie.substring(0, cookieName.length) == cookieName)
    .map(cookie => cookieVariableSchema.decodeUrlCookie ? decodeURIComponent(cookie.substring(cookieName.length)) : cookie);

  return cookies[0] ?? "";
}

const resolveElementVariable = (elementVariableSchema: ElementVariableSchema): string => {
  const element: Element | null = document.querySelector(elementVariableSchema.cssSelector);
  return !element ? "" : !elementVariableSchema.attribute ? element.textContent ?? "" : element.getAttribute(elementVariableSchema.attribute) ?? "";
}

const resolveVisibilityVariable = (visibilityVariableSchema: VisibilityVariableSchema) => {
  return ""; //TODO yapılacak
}

const resolveJavascriptVariable = (javascriptVariableSchema: JavascriptVariableSchema) => {
  try {
    return eval(javascriptVariableSchema.code);
  } catch (error) {
    console.error(error);
    return "";
  }
}

const findMatches = (string: string, regex: RegExp): Array<string> => {
  const matches: Array<string> = new Array<string>();
  let regExpExecArray: RegExpExecArray | null;
  while ((regExpExecArray = regex.exec(string)) != undefined) {
    const match = regExpExecArray[0];
    matches.push(match)
  }

  return matches;
}
