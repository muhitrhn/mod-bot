const Command = require("../../base/Command.js"),
	{ MessageEmbed, MessageActionRow, MessageButton } = require("discord.js"),
    Discord = require("discord.js"),
	db = require("quick.db");
const isAdmin = (userID, data) => {
    const exists = data.guild?.admins.find(admin => admin.id === userID);
    if (exists) {
        return true
    } else {
        return false
    }
};

class Help extends Command {
	constructor (client) {
		super(client, {
			name: "help",
			dirname: __dirname,
			enabled: true,
			guildOnly: false,
			aliases: [ "h", "commands" ],
			memberPermissions: [],
			botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
			nsfw: false,
			ownerOnly: false,
			cooldown: 5000
		});
	}

	async run (message, args, data) {
		 try {
            if (!message.member.permissions.has('ADMINISTRATOR')) {
				return await message.channel.send({
					embeds: [{
						title: 'Opps!',
						description: 'This command can only be used by admins.'
					}]
				});
			}
            
			const embed = new MessageEmbed()
				.addField('**prefix (admin only)**', `\nUsed to change prefix.\n**Usage:**\n**${db.get('config').prefix}prefix newPrefix**\n\n`)
                .addField('**names aexact/rexact (admin only)**', `\nUsed to add/remove names from exact ban list.\n**Usage:**\n**${db.get('config').prefix}names aexact/rexact names-seperated-by-space**\n\n`)
                .addField('**names awild/rwild (admin only)**', `\nUsed to add/remove names from wildcard ban list.\n**Usage:**\n**${db.get('config').prefix}names awild/rwild names-seperated-by-space**\n\n`)
                .addField('**names list (admin only)**', `\nUsed to check ban list.\n**Usage:**\n**${db.get('config').prefix}names list**\n\n`)
				.addField('**config stats (admin only)**', `\nUsed to check config status.\n**Usage:**\n**${db.get('config').prefix}config stats**\n\n`)
				.addField('**config logs (admin only)**', `\nUsed to set ban logs channel.\n**Usage:**\n**${db.get('config').prefix}config logs #channel**\n\n`)
				.addField('**config errors (admin only)**', `\nUsed to set error logs channel.\n**Usage:**\n**${db.get('config').prefix}config errors #channel**\n\n`)
				.addField('**config banStat (admin only)**', `\nUsed to enable/disable banning.\n**Usage:**\n**${db.get('config').prefix}config banStat on/off**\n\n`)
				.addField('**config wildcardStat (admin only)**', `\nUsed to enable/disable wildcardStat matching rules.\n**Usage:**\n**${db.get('config').prefix}config wildcardStat on/off**\n\n`);

            return message.channel.send({
                embeds: [embed]
            });
		} catch (err) {
			const errEmbed = new MessageEmbed()
				.setTitle('An Error Occurred.')
				.setDescription(`**Stack Trace:**\n\`\`\`${err.stack || err}\`\`\``);

			console.log(err);
			const logsChannel = message.client.channels.cache.get(db.get('config.errorsChannel').id);
			if (logsChannel) {
				logsChannel.send({ embeds: [errEmbed] });
			}
		}
	}
}

module.exports = Help;