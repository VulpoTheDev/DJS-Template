import {
	ColorResolvable,
	ChatInputCommandInteraction,
	EmbedBuilder,
	ApplicationCommandType,
} from "discord.js";
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
      type: ApplicationCommandType.ChatInput,
      cooldown: 100,
      extendedDescription: "Ping the bot and get it's latency",
    });
	}
	async run(interaction: ChatInputCommandInteraction) {
		const reply = await interaction.channel!.send("Pinging");
		const embed = new EmbedBuilder()
			.setAuthor({
				name: interaction.user.tag,
				iconURL: interaction.user.displayAvatarURL(),
			})
			.setColor(this.client.config.color as ColorResolvable)
			.addFields({
				name: "Message Latency",
				value: `${Math.floor(
					reply.createdTimestamp - interaction.createdTimestamp
				)}ms`
			}, {
				name: "API Latency",
				value: `${Math.floor(
					reply.createdTimestamp - interaction.createdTimestamp
				)}ms`

			})
			.setFooter({
				text: `If there's an Issue please report them to ${
					this.client.users.cache.get(this.client.config.ownerID)?.tag
				}`,
			});
		reply.delete();
		interaction.reply({ embeds: [embed] });
	}
}
