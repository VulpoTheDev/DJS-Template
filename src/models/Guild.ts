import {
	getModelForClass,
	ModelOptions,
	prop,
	Severity,
} from "@typegoose/typegoose";

@ModelOptions({
	options: {
		allowMixed: Severity.ALLOW,
	},
})
class GuildSchema {
	@prop({ required: true })
	public guildID: string;
	@prop({ default: "!!" })
	public prefix: string;
	@prop({
		default: {
			banLogChannel: null,
			kickLogChannel: null,
			modLogChannel: null,
			joinLogChannel: null,
			leaveLogChannel: null,
			channelLogChannel: null,
			messageLogChannel: null,
			userLogChannel: null,
			flagLogChannel: null,
			verificationLogChannel: null,
		},
	})
	public logging: ILoggingConfig;
	@prop({
		default: {
			botModRole: null,
			botManagerRole: null,
		},
	})
	public botSettings: IBotSettingsConfig;
	@prop({
		default: {
			rewards: [],
			baseScore: 1,
			multiplier: 1,
			minRandomXP: 1,
			maxRandomXP: 20,
			attachmentXP: 1,
			messageXP: 1,
			ignoreChannel: [],
		},
	})
	public leveling: ILevelingConfig;
}

export const Guild = getModelForClass(GuildSchema);

export interface ILoggingConfig {
	banLogChannel: string | null;
	kickLogChannel: string | null;
	modLogChannel: string | null;
	joinLogChannel: string | null;
	leaveLogChannel: string | null;
	channelLogChannel: string | null;
	messageLogChannel: string | null;
	userLogChannel: string | null;
	flagLogChannel: string | null;
	verificationLogChannel: string | null;
}

export interface ISettingsConfig {
	generalChannel: string | null;
	welcomeMessage: string | null;
	welcomeRole: string | null;
	muteRole: string | null;
	noMicChannel: string | null;
}

export interface IBotSettingsConfig {
	botModRole: string | null;
	botManagerRole: string | null;
}

export interface ILevelingConfig {
	baseScore: number;
	multiplier: number;
	minRandomXP: number;
	maxRandomXP: number;
	attachmentXP: number;
	messageXP: number;
	ignoreChannel: string[];
	rewards: { level: number; role: string }[];
}
