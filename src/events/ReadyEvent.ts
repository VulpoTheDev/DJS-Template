import { GuildApplicationCommandPermissionData } from "discord.js";
import VulpoClient from "../lib/VulpoClient";
import BaseEvent from "../structures/BaseEvent";

export default class ReadyEvent extends BaseEvent {
	constructor(client: VulpoClient) {
		super(client, {
			eventName: "ready",
		});
	}
	async run(client: VulpoClient) {
		const guild = client.guilds.cache.get(client.config.guildID);
		if (!guild) {
			console.error("Cannot find the guild!");
			process.exit();
		}
		client.user?.setActivity({
			name: "Moderation Tunes",
			type: "LISTENING",
		});
		console.info("Loading (/) Permission and Setting up");

		const fullPerms: GuildApplicationCommandPermissionData[] = [];
		await guild!.commands
			.set(client.arrayOfSlashCommands)
			.then(async (cmd) => {
				// console.log(`Adding ${cmd} to the Guild Slash Commands`)
				console.info("Setting (/) Permissions");
				const getRoles = (cmdName: string) => {
					const permsRequired = client.arrayOfSlashCommands.find(
						(x) => x.name === cmdName
					)!.userPermissions;
					if (permsRequired.length === 0) return;
					return guild?.roles.cache.filter(
						(x) => x.permissions.has(permsRequired) && !x.managed
					);
				};

				const checkOwner = (cmdName: string) => {
					return client.arrayOfSlashCommands.find(
						(x) => x.name === cmdName
					)!.ownerOnly;
				};

				cmd.forEach((command) => {
					if (checkOwner(command.name)) {
						fullPerms.push({
							id: command.id,
							permissions: [
								{
									id: client.config.ownerID,
									permission: true,
									type: "USER",
								},
							],
						});
					}

					const roles = getRoles(command.name);
					if (!roles) return;
					roles.forEach((role) => {
						let temp: GuildApplicationCommandPermissionData = {
							id: command.id,
							permissions: [
								{
									id: role.id,
									permission: true,
									type: "ROLE",
								},
							],
						};
						fullPerms.push(temp);
					});
				});
				guild?.commands.permissions.set({ fullPermissions: fullPerms });
			});

		client.users.cache.get(client.config.ownerID)?.send("READY");
		client.user?.setStatus("online");
		console.info("Completed");
	}
}
