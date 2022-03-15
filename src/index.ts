import { Partials } from "discord.js";
import * as dotenv from "dotenv";
import VulpoClient from "./lib/VulpoClient";
dotenv.config();

const client = new VulpoClient({
	intents: 32767,
	partials: [
		Partials.Channel,
		Partials.GuildMember,
		Partials.GuildScheduledEvent,
		Partials.Message,
		Partials.Reaction,
		Partials.ThreadMember,
		Partials.User,
	],
});

client.loadCommands();
client.loadEvents();
client.connectDB();

process.on("uncaughtException", async (e) => {
	console.error(
		e instanceof Error ? `${e.message}\n${e.stack}` : (e as string)
	);
});

process.on("unhandledRejection", async (e) => {
	console.error(
		e instanceof Error ? `${e.message}\n${e.stack}` : (e as string)
	);
});

client.login(process.env.TOKEN as string);
