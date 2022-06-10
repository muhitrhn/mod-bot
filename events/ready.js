const db = require("quick.db"),
	Discord = require("discord.js");

module.exports = class {

	constructor (client) {
		this.client = client;
	}

	async run () {

		const client = this.client;

		// Logs some informations using the logger file
		client.logger.log(`Loading a total of ${client.commands.size} command(s).`, "log");
		client.logger.log(`${client.user.tag}, ready to serve ${client.users.cache.size} users in ${client.guilds.cache.size} servers.`, "ready");

		try {
			let mainGuild = client.guilds.cache.get(client.config.server);
			await mainGuild.members.fetch();

			setInterval(async () => {
				mainGuild = client.guilds.cache.get(client.config.server);
				let membersFilter;

				if (db.get('config').matchType === 'exact') membersFilter = mainGuild.members.cache.filter(member => !member.permissions.has('ADMINISTRATOR') && (db.get("spamNames")?.find(name => member.user.username.toLowerCase() === name.toLowerCase()) || db.get("spamNames")?.find(name => member.displayName.toLowerCase() === name.toLowerCase())));
				if (db.get('config').matchType === 'wildcard') membersFilter = mainGuild.members.cache.filter(member => !member.permissions.has('ADMINISTRATOR') && (db.get("spamNames")?.find(name => member.user.username.toLowerCase().includes(name.toLowerCase())) || db.get("spamNames")?.find(name => member.displayName.toLowerCase().includes(name.toLowerCase()))));
				
				if (membersFilter.size === 0) return;

				return await Promise.all(membersFilter.map(async member => await client.modLogs(member)));
			}, 5 * 1000);
		} catch (err) {
			const errEmbed = new Discord.MessageEmbed()
				.setTitle('An Error Occurred.')
				.setDescription(`**Stack Trace:**\n\`\`\`${err.stack || err}\`\`\``);

			console.log(err);
            const supportErrorLog = client.channels.cache.get(db.get('config.errorsChannel').id);
			if (supportErrorLog) {
                await supportErrorLog.send({ embeds: [errEmbed] });
            }
		}
	}
};