import TrackerClient from "./TrackerClient";
import Event from "../event/Event";
import TrackerConfig from "../config/TrackerConfig";
import TrackerSchema from "../event/TrackerSchema";

class MockTrackerClient implements TrackerClient {

  private trackerConfig?: TrackerConfig;

  private constructor() {
    this.init();
  }

  public static create(): MockTrackerClient {
    return new MockTrackerClient();
  }

  private init(): void {
    this.trackerConfig = {
      authServerUrl: "",
      httpEventGatewayUrl: "",
      tags: []
    }
  }

  public getTags(): Array<TrackerSchema> {
    return this.trackerConfig!.tags;
  }

  public sendEvent(event: Event): void {
    console.log(event);
  }
}

export default MockTrackerClient;