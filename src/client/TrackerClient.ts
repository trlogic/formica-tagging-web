import Event from "../event/Event";
import Tag from "../event/Tag";

interface TrackerClient {

  getTags(): Array<Tag>;

  sendEvent(event: Event): void
}

export default TrackerClient;