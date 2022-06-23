const db = require("quick.db"),
	{ MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const xpCooldown = {},
	cmdCooldown = {};

module.exports = class {
	constructor (client) {
		this.client = client;
	}

	async run (message) {

		// If the messagr author is a bot
		if(message.author.bot) return;

		const client = this.client;

		// Check if the bot was mentionned
		if(message.content.match(new RegExp(`^<@!?${client.user.id}>( |)$`))){
			if(message.guild){
				return message.channel.send(`Hello ${message.author.username}, my prefix is ${client.config.prefix}.`);
			} else {
				return message.author.send(`Hello ${message.author.username}, no need to use prefix here.`);
			}
		}

		// Gets the prefix
		const prefix = client.functions.getPrefix(message, db.get('config'));
		if(!prefix){
			return;
		}

		const args = message.content.slice((typeof prefix === "string" ? prefix.length : 0)).trim().split(/ +/g);
		const command = args.shift().toLowerCase();
		const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));

		if(!cmd && message.guild) return;

		let uCooldown = cmdCooldown[message.author.id];
		if(!uCooldown){
			cmdCooldown[message.author.id] = {};
			uCooldown = cmdCooldown[message.author.id];
		}
		const time = uCooldown[cmd.help.name] || 0;
		if(time && (time > Date.now())){
			return message.channel.send(`Please wait ${Math.ceil((time-Date.now())/1000)} seconds before using this command again.`).then(async msg => {
				if (message.deletable) await message.delete();
				
				setTimeout(async () => {
					if (msg.deletable) await msg.delete();
				}, 5000);
			})
		}
		cmdCooldown[message.author.id][cmd.help.name] = Date.now() + cmd.conf.cooldown;

		client.logger.log(`${message.author.username} (${message.author.id}) ran command ${cmd.help.name}`, "cmd");

		try {
			cmd.run(message, args);
		} catch(e){
			console.error(e);
			return message.channel.send("Opps! An error has occured.");
		}
	}
}