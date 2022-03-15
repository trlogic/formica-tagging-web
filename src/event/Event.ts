interface Event {

  readonly name: string;

  readonly actor: string;

  readonly variables: { [key: string]: string | number | boolean }
}

export default Event;