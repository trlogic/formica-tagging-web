import TrackerClient from "./client/TrackerClient";
import MockTrackerClient from "./client/MockTrackerClient";
import ClickTriggerSchema from "./trigger/ClickTriggerSchema";
import ScrollTriggerSchema from "./trigger/ScrollTriggerSchema";
import FormSubmissionTriggerSchema from "./trigger/FormSubmissionTriggerSchema";
import PageViewTriggerSchema from "./trigger/PageViewTriggerSchema";
import CustomTriggerSchema from "./trigger/CustomTriggerSchema";
import TagVariableSchema from "./variable/TagVariableSchema";
import {resolveFilter, resolveVariable} from "./TrackerUtils";
import Filter from "./filter/Filter";
import Event from "./event/Event";
import Tag from "./event/Tag";
import EventSchema from "./event/EventSchema";
import UrlVariableSchema from "./variable/UrlVariableSchema";
import CookieVariableSchema from "./variable/CookieVariableSchema";
import JavascriptVariableSchema from "./variable/JavascriptVariableSchema";
import ElementVisibilityVariableSchema from "./variable/ElementVisibilityVariableSchema";
import ElementVariableSchema from "./variable/ElementVariableSchema";

class Tracker {

  private static instance: Tracker;

  private readonly client: TrackerClient;

  private constructor(url: string, username: string, password: string) {
    this.client = MockTrackerClient.create();
    //this.client = AxiosTrackerClient.create(url, username, password);
  }

  public static start(url: string, username: string, password: string): void {
    if (!Tracker.instance) {
      Tracker.instance = new Tracker(url, username, password)
      Tracker.instance.run();
      console.info("Tracker started successfully")
    } else {
      console.warn("Tracker has already started")
    }
  }

  private run(): void {
    this.client.getTags().forEach(tag => this.initListeners(tag));
  }

  private initListeners(tag: Tag): void {
    const eventSchema: EventSchema = tag.event;
    const tagVariableSchemas: Array<TagVariableSchema> = tag.variables;

    tag.triggers.forEach(triggerSchema => {
      const filter: Filter | undefined = triggerSchema.filter;
      if (triggerSchema instanceof ClickTriggerSchema) {
        const callbackfn: EventHandler = (e, tagVariables: { [key: string]: string }) => this.handleClick(eventSchema, tagVariables);
        this.addListener("click", filter, tagVariableSchemas, callbackfn)
      } else if (triggerSchema instanceof ScrollTriggerSchema) {
        const callbackfn: EventHandler = (e, tagVariables: { [key: string]: string }) => this.handleScroll(eventSchema, tagVariables);
        this.addListener("scroll", filter, tagVariableSchemas, callbackfn)
      } else if (triggerSchema instanceof FormSubmissionTriggerSchema) {
        const callbackfn: EventHandler = (e, tagVariables: { [key: string]: string }) => this.handleFormSubmission(eventSchema, tagVariables);
        this.addListener("formsubmission", filter, tagVariableSchemas, callbackfn)
      } else if (triggerSchema instanceof PageViewTriggerSchema) {
        const callbackfn: EventHandler = (e, tagVariables: { [key: string]: string }) => this.handlePageView(eventSchema, tagVariables);
        this.addListener("pageview", filter, tagVariableSchemas, callbackfn);
      } else if (triggerSchema instanceof CustomTriggerSchema) {
        const callbackfn: EventHandler = (e, tagVariables: { [key: string]: string }) => this.handleCustom(eventSchema, tagVariables);
        this.addListener(triggerSchema.name, filter, tagVariableSchemas, callbackfn);
      }
    });
  }

  private addListener(type: string, filter: Filter | undefined, tagVariableSchemas: Array<TagVariableSchema>, callbackFn: EventHandler) {
    document.addEventListener(type, (e) => {
      const tagVariables: { [key: string]: string } = this.resolveTagVariables(tagVariableSchemas);
      if (filter == undefined || resolveFilter(filter, tagVariables)) {
        callbackFn(e, tagVariables);
      }
    });
  }

  private resolveTagVariables(tagVariableSchemas: Array<TagVariableSchema>): { [key: string]: string } {
    const tagVariables: { [key: string]: string } = {};
    tagVariableSchemas.forEach(tagVariableSchema => {
      if (tagVariableSchema instanceof UrlVariableSchema) {
        switch (tagVariableSchema.selection) {
          case "full":
            break;
          case "host":
            break;
          case "port":
            break;
          case "path":
            break;
          case "query":
            break;
          case "fragment":
            break;
          case "protocol":
            break;
        }
      } else if (tagVariableSchema instanceof CookieVariableSchema) {

      } else if (tagVariableSchema instanceof JavascriptVariableSchema) {

      } else if (tagVariableSchema instanceof ElementVisibilityVariableSchema) {

      } else if (tagVariableSchema instanceof ElementVariableSchema) {
      }
    });

    return tagVariables;
  }

  private buildEvent(eventSchema: EventSchema, tagVariables: { [key: string]: string }): Event {
    const name: string = eventSchema.name;
    const actor: string = resolveVariable(eventSchema.actorMapping, tagVariables);
    const variables: { [key: string]: string } = {};
    eventSchema.variableMappings.forEach(variableMapping => variables[variableMapping.name] = resolveVariable(variableMapping.value, tagVariables));
    return {name, actor, variables}
  }


  // HANDLERS
  private handleClick(triggerSchema: ClickTriggerSchema, eventSchema: EventSchema, tagVariables: { [key: string]: string }) {
    const event: Event = this.buildEvent(eventSchema, tagVariables);
    this.client.sendEvent(event);
  }

  private handleScroll(triggerSchema: ScrollTriggerSchema, eventSchema: EventSchema, tagVariables: { [key: string]: string }) {
    const event: Event = this.buildEvent(eventSchema, tagVariables);
    this.client.sendEvent(event);
  }

  private handleFormSubmission(triggerSchema: FormSubmissionTriggerSchema, eventSchema: EventSchema, tagVariables: { [key: string]: string }) {
    const event: Event = this.buildEvent(eventSchema, tagVariables);
    this.client.sendEvent(event);
  }

  private handlePageView(triggerSchema: PageViewTriggerSchema, eventSchema: EventSchema, tagVariables: { [key: string]: string }) {
    const event: Event = this.buildEvent(eventSchema, tagVariables);
    this.client.sendEvent(event);
  }

  private handleCustom(triggerSchema: CustomTriggerSchema, eventSchema: EventSchema, tagVariables: { [key: string]: string }) {
    const event: Event = this.buildEvent(eventSchema, tagVariables);
    this.client.sendEvent(event);
  }
}

declare type EventHandler = (e: any, variableValues: { [key: string]: string }) => void;

export default Tracker;