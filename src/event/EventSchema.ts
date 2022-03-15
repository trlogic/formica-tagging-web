interface EventSchema {

  readonly name: string;

  readonly actorMapping: string;

  readonly variableMappings: Array<{ name: string, value: string }>
}

export default EventSchema;