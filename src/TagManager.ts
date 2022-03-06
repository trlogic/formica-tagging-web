interface TagManager {

  initialize(): void

  loadConfiguration(): Array<any>

  listen(): void
}

export default TagManager;
