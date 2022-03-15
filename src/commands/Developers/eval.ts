import beautify from "beautify";
import { CommandInteraction, MessageEmbed } from "discord.js";
import VulpoClient from "../../lib/VulpoClient";
import BaseSlashCommand from "../../structures/BaseCommand";

export default class EvalCommand extends BaseSlashCommand {
	constructor(client: VulpoClient) {
		super(client, {
			name: "eval",
			shortDescription: "Evaluate some Node.js Code!",
			args: [
				{
					name: "code",
					description: "NodeJS Code you'd want to evaluate",
					type: "STRING",
					required: true,
				},
			],
			cooldown: 0,
			userPermissions: [],
			type: "CHAT_INPUT",
			botPermissions: [],
			ownerOnly: true,
		});
	}
	async run(interaction: CommandInteraction) {
		const script = interaction.options.getString("code", true);
		if (script?.includes("token"))
			return interaction.reply("Request Denied!");
		try {
			const evaluated = eval(script);
			const evaled = require("util").inspect(evaluated, { depth: 5 });
			const promisedEval: any = await Promise.resolve(evaluated);
			let res;
			if (evaled.toString().length >= 1024) {
				res = "Result too big, check the console";
			} else {
				res = evaled;
			}
			let promisedResult;
			if (promisedEval.toString().length >= 1024) {
				promisedResult = "Result too big, check the console";
			} else {
				promisedResult = promisedEval;
			}

			// Process the output
			const embed = new MessageEmbed()
				.setAuthor({
					name: interaction.user.tag,
					iconURL: interaction.user.displayAvatarURL({
						dynamic: true,
					}),
				})
				.setTitle("Evaluated Code")
				.setColor("#ff1493"!)
				.setTimestamp()
				.addField(
					":inbox_tray: Input: ",
					`\`\`\`ts\n${beautify(script, { format: "js" })} \`\`\``
				)
				.addField(":outbox_tray: Output", `\`\`\`ts\n${res}\`\`\``)
				.setFooter({ text: `User ID: ${interaction.user.id}`})
				.setThumbnail(
					this.client!.user?.displayAvatarURL({ dynamic: true })!
				);

			if (evaluated && evaluated.then) {
				embed.addField(
					":outbox_tray: Promise Output",
					`\`\`\`js\n${promisedResult}\`\`\``
				);
			}

			// Add a type of what is the type of what's evaluated
			embed.addField("Type of: ", `\`\`\`${typeof evaluated}\`\`\``);

			// Sends the embed
			await interaction.reply({ embeds: [embed], ephemeral: true });
		} catch (err: any) {
			// If any errors occurred... then, send the error instead
			throw new Error(err);
		}
	}
}
