import Filter from "../filter/Filter";

interface TriggerSchema {

  readonly type: string;

  readonly filters: Array<Filter>;
}

export default TriggerSchema