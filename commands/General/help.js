const Command = require("../../base/Command.js"),
	{ MessageEmbed, MessageActionRow, MessageButton } = require("discord.js"),
    Discord = require("discord.js");
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
                .addField('**names add (admin only)**', '\nUsed to add names to ban list.\n**Usage:**\n***names add names-to-ban**\n\n')
                .addField('**names remove (admin only)**', '\nUsed to remove names from ban list.\n**Usage:**\n***names remove names-to-remove**\n\n')
                .addField('**names list (admin only)**', '\nUsed to check ban list.\n**Usage:**\n***names list**\n\n');

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