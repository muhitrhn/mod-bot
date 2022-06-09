const Discord = require("discord.js");

module.exports = class {

	constructor (client) {
		this.client = client;
	}

	async run (member) {
		const client = this.client;

        try {
			await client.modLogs(member);
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