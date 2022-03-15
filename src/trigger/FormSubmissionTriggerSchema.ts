import TriggerSchema from "./TriggerSchema";

interface FormSubmissionTriggerSchema extends TriggerSchema {

  readonly onlyValid: boolean;
}

export default FormSubmissionTriggerSchema;