import TriggerSchema from "./TriggerSchema";

interface ScrollTriggerSchema extends TriggerSchema {

  readonly horizontal: boolean;

  readonly vertical: boolean;
}

export default ScrollTriggerSchema;