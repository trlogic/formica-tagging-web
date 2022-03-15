import Tag from "../event/Tag";

class TrackerConfig {

  readonly tags: Array<Tag>;

  readonly httpEventGatewayUrl: string;

  readonly authServerUrl: string;
}

export default TrackerConfig;