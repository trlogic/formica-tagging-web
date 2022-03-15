import TrackerClient from "./TrackerClient";
import Event from "../event/Event";
import TrackerConfig from "../config/TrackerConfig";
import Tag from "../event/Tag";

class MockTrackerClient implements TrackerClient {

  private trackerConfig?: TrackerConfig;

  private constructor() {
  }

  public static create(): MockTrackerClient {
    const client: TrackerClient = new MockTrackerClient();
    client.init();
    return client;
  }

  public init(): void {
    this.trackerConfig = {
      authServerUrl: "",
      httpEventGatewayUrl: "",
      tags: []
    }
  }

  public getTags(): Array<Tag> {
    return this.trackerConfig!.tags;
  }

  public sendEvent(event: Event): void {
    console.log(event);
  }
}

export default MockTrackerClient;