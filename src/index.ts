import * as dotenv from "dotenv";
import VulpoClient from "./lib/VulpoClient";
dotenv.config();

const client = new VulpoClient({
	intents: 32767,
	partials: ["CHANNEL", "GUILD_MEMBER", "MESSAGE", "USER"],
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
