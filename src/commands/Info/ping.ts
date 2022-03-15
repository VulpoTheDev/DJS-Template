import { ColorResolvable, CommandInteraction, MessageEmbed } from "discord.js";
import VulpoClient from "../../lib/VulpoClient";
import BaseCommand from "../../structures/BaseCommand";

export default class PingCommand extends BaseCommand {
	constructor(client: VulpoClient) {
		super(client, {
			name: "ping",
			botPermissions: [],
			shortDescription: "Ping the bot!",
			userPermissions: [],
			args: [],
			type: "CHAT_INPUT",
			cooldown: 100,
			extendedDescription: "Ping the bot and get it's latency",
		});
	}
	async run(interaction: CommandInteraction) {
		const reply = await interaction.channel!.send("Pinging");
		const embed = new MessageEmbed()
			.setAuthor({
				name: interaction.user.tag,
				iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
			})
			.setColor(this.client.config.color as ColorResolvable)
			.addField(
				"Message Latency",
				`${Math.floor(
					reply.createdTimestamp - interaction.createdTimestamp
				)}ms`
			)
			.addField("API Latency", `${this.client.ws.ping}ms`)
			.setFooter({
				text: `If there's an Issue please report them to ${
					this.client.users.cache.get(this.client.config.ownerID)?.tag
				}`
			});
		reply.delete();
		interaction.reply({ embeds: [embed] });
	}
}
