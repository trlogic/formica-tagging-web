import TagVariableSchema from "../variable/TagVariableSchema";
import TriggerSchema from "../trigger/TriggerSchema";
import EventSchema from "./EventSchema";

interface TrackerSchema {

  readonly triggers: Array<TriggerSchema>;

  readonly variables: Array<TagVariableSchema>;

  readonly event: EventSchema;
}

export default TrackerSchema;