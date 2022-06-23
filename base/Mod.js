const { MessageEmbed, Util, Client, Collection, Intents, MessageActionRow, MessageButton } = require("discord.js");

const util = require("util"),
	path = require("path"),
	moment = require("moment"),
	db = require("quick.db");

moment.relativeTimeThreshold("s", 60);
moment.relativeTimeThreshold("ss", 5);
moment.relativeTimeThreshold("m", 60);
moment.relativeTimeThreshold("h", 60);
moment.relativeTimeThreshold("d", 24);
moment.relativeTimeThreshold("M", 12);

// Creates Mod class
class Mod extends Client {

	constructor () {
		super({
			intents: [
				Intents.FLAGS.GUILDS,
				Intents.FLAGS.GUILD_MEMBERS,
				Intents.FLAGS.GUILD_MESSAGES,
				Intents.FLAGS.GUILD_PRESENCES,
				Intents.FLAGS.DIRECT_MESSAGES
			],
			partials: ['MESSAGE', 'CHANNEL', 'GUILD_MEMBER', 'USER']
		});
		this.config = require("../config"); // Load the config file
		this.commands = new Collection(); // Creates new commands collection
		this.aliases = new Collection(); // Creates new command aliases collection
		this.logger = require("../helpers/logger"); // Load the logger file
		this.wait = util.promisify(setTimeout); // client.wait(1000) - Wait 1 second
		this.functions = require("../helpers/functions"); // Load the functions file
		this.knownGuilds = [];
		this.runningCommands = [];

		if (!db.get("spamNames")) this.spamNames = db.set("spamNames", { exact: [], wildcard: [] });
		
		if (!db.get("config")) {
			this.botConfig = db.set("config", {
				prefix: '+',
				logsChannel: null,
				errorsChannel: null,
				banStat: false,
				wildcardStat: false
			});
		}

	}

	printDate(date, format, locale){
		if(!locale) locale = this.defaultLanguage;
		const languageData = this.languages.find((language) => language.name === locale || language.aliases.includes(locale));
		if(!format) format = languageData.defaultMomentFormat;
		return moment(new Date(date))
			.locale(languageData.moment)
			.format(format);
	}

	// This function is used to load a command and add it to the collection
	loadCommand (commandPath, commandName) {
		try {
			const props = new (require(`.${commandPath}${path.sep}${commandName}`))(this);
			this.logger.log(`Loading Command: ${props.help.name}. 👌`, "log");
			props.conf.location = commandPath;
			if (props.init){
				props.init(this);
			}
			this.commands.set(props.help.name, props);
			props.help.aliases.forEach((alias) => {
				this.aliases.set(alias, props.help.name);
			});
			return false;
		} catch (e) {
			return `Unable to load command ${commandName}: ${e}`;
		}
	}

	// This function is used to unload a command (you need to load them again)
	async unloadCommand (commandPath, commandName) {
		let command;
		if(this.commands.has(commandName)) {
			command = this.commands.get(commandName);
		} else if(this.aliases.has(commandName)){
			command = this.commands.get(this.aliases.get(commandName));
		}
		if(!command){
			return `The command \`${commandName}\` doesn't seem to exist, nor is it an alias. Try again!`;
		}
		if(command.shutdown){
			await command.shutdown(this);
		}
		delete require.cache[require.resolve(`.${commandPath}${path.sep}${commandName}.js`)];
		return false;
	}

	async modLogs (member) {
		let isSpammer = db.get("spamNames")?.exact.find(name => member.user.username.toLowerCase(name.toLowerCase())) || db.get("spamNames")?.wildcard.find(name => member.user.username.toLowerCase(name.toLowerCase()));
		
		if (!db.get('config.wildcardStat')) isSpammer = db.get("spamNames")?.exact.find(name => member.user.username.toLowerCase(name.toLowerCase()));

		if (isSpammer) {
			const memberId = member.id;
			const memberName = member.user.tag;
			const initDateTime = `<t:${Math.round(new Date().getTime() / 1000)}>`;
			const modLogsChannel = this.channels.cache.get(db.get('config.logsChannel')?.id);

			if (db.get('config').banStat) await member.ban();
			
			if (modLogsChannel) {
				await modLogsChannel.send({
					embeds: [{
						title: `Prevented spammer!`,
						fields: [
							{
								name: `Id -`,
								value: `\`${memberId}\``
							},
							{
								name: `Username -`,
								value: `\`${memberName}\``
							},
							{
								name: `Time -`,
								value: initDateTime
							}
						],
						color: 15548997,
						footer: {
							text: this.user.username,
							icon_url: this.user.displayAvatarURL({ dynamic: true })
						},
						author: {
							name: member.guild.name,
							icon_url: member.guild.iconURL({ dynamic: true })
						}
					}]
				});
			}
		}

		return await this.wait(100);
	}
}

module.exports = Mod;
