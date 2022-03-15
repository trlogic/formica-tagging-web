import TriggerSchema from "./TriggerSchema";

interface CustomTriggerSchema extends TriggerSchema {

  readonly name: string;
}

export default CustomTriggerSchema;