import Event from "../event/Event";
import TrackerSchema from "../event/TrackerSchema";

interface TrackerClient {

  getTags(): Array<TrackerSchema>;

  sendEvent(event: Event): void
}

export default TrackerClient;