import TrackerSchema from "../event/TrackerSchema";

interface TrackerConfig {

  readonly tags: Array<TrackerSchema>;

  readonly httpEventGatewayUrl: string;

  readonly authServerUrl: string;
}

export default TrackerConfig;