import TrackerClient from "./TrackerClient";
import TrackerConfig from "../config/TrackerConfig";
import Event from "../event/Event";
import {Axios, AxiosRequestConfig, AxiosResponse} from "axios";
import Tag from "../event/Tag";

class AxiosTrackerClient implements TrackerClient {

  private readonly trackerApiUrl: string
  private readonly axios: Axios;
  private trackerConfig: TrackerConfig;

  private readonly queue: Array<Event>;

  private constructor(trackerApiUrl: string, username: string, password: string) {
    this.trackerApiUrl = trackerApiUrl;
    this.axios = new Axios();
    this.queue = new Array<Event>();
    this.init(username, password);
  }

  public static create(trackerApiUrl: string, username: string, password: string): TrackerClient {
    return new AxiosTrackerClient(trackerApiUrl, username, password);
  }

  public getTags(): Array<Tag> {
    return this.trackerConfig!.tags;
  }

  public sendEvent(event: Event): void {

  }

  private init(username: string, password: string) {
    const basicAuth: string = Buffer.from(`${username}:${password}`).toString("base64");
    const requestConfig: AxiosRequestConfig = {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json; charset=UTF-8",
        "Authorization": `Basic ${basicAuth}`
      }
    }

    this.axios.get(this.trackerApiUrl, requestConfig)
      .then((response: AxiosResponse<TrackerConfig>) => this.trackerConfig = response.data)
      .catch(reason => {
        throw new Error(reason)
      });
  }
}

export default AxiosTrackerClient;