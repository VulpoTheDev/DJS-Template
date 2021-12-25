import {
	ApplicationCommandData,
	ApplicationCommandOptionData,
	Client,
	ClientOptions,
	Collection,
} from "discord.js";
import fs from "fs";
import BaseCommand from "../structures/BaseCommand";
import * as config from "../config.json";
import { mongoose } from "@typegoose/typegoose";

export default class VulpoClient extends Client {
	public commands: Collection<string, BaseCommand>;
	public aliases: Collection<string, string>;
	public config: typeof config;
	public arrayOfSlashCommands: (BaseCommand & ApplicationCommandData)[];
	constructor(clientOpts: ClientOptions) {
		super(clientOpts);
		this.commands = new Collection();
		this.aliases = new Collection();
		this.arrayOfSlashCommands = [];
		this.config = require("./../config.json");
	}

	public async loadCommands() {
		console.info(`Loading Slash Commands`);
		fs.readdirSync("dist/commands/").forEach((category) => {
			console.info(`Loading (/) Category: ${category}`);
			fs.readdirSync(`dist/commands/${category}`).forEach((command) => {
				console.info(`Loading (/) Command: ${command}`);
				const file: BaseCommand =
					new (require(`../commands/${category}/${command}`).default)(
						this
					);
				if (!file || !file.name) return;
				this.commands.set(file.name, file);
				if (file.userPermissions.length > 0 || file.ownerOnly)
					file.defaultPermission = false;
				const commandOptions: ApplicationCommandOptionData[] = [];
				file.args?.forEach((arg) => {
					// @ts-expect-error
					commandOptions.push({
						name: arg.name,
						description: arg.description,
						type: arg.type as any,
						autocomplete: false,
						choices: arg.choices,
						options: arg.options,
						required: arg.required,
					});
				});
				this.arrayOfSlashCommands.push({
					...file,
					options: commandOptions,
					run: file.run,
				});
			});
		});
	}

	public async loadEvents() {
		console.info(`Loading Events`);
		fs.readdirSync("dist/events/").forEach((evt) => {
			try {
				const event = new (require(`../events/${evt}`).default)(this);
				this.on(event.eventName, event.run.bind(null, this));
			} catch (e) {
				console.error(`Error Loading ${evt.split(".")[0]} ${e}`);
			}
		});
	}

	public async connectDB() {
		console.info("Connecting to Databse");
		mongoose.connect(process.env.MONGO_URI as string, {}, (err) => {
			if (err) throw new Error(err.message);
		});
	}
}
