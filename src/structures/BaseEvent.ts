import { ClientEvents } from "discord.js";
import VulpoClient from "../lib/VulpoClient";

export default abstract class BaseEvent {
	public client: VulpoClient;
	public eventName: keyof ClientEvents;
	constructor(
		client: VulpoClient,
		options: { eventName: keyof ClientEvents }
	) {
		this.client = client;
		this.eventName = options.eventName;
	}

	abstract run(client: VulpoClient, ...args: any): void;
}
