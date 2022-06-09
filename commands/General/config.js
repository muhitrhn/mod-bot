const Command = require("../../base/Command.js"),
	fetch = require("node-fetch"),
	db = require("quick.db"),
	{ MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

class Config extends Command {
	constructor (client) {
		super(client, {
			name: "config",
			dirname: __dirname,
			enabled: true,
			guildOnly: true,
			aliases: [],
			memberPermissions: [],
			botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
			nsfw: false,
			ownerOnly: false,
			cooldown: 2000
		});
	}

	async run (message, args) {
		try {
			/*if (!message.member.permissions.has('ADMINISTRATOR')) {
				return await message.channel.send({
					embeds: [{
						title: 'Opps!',
						description: 'This command can only be used by admins.'
					}]
				});
			}*/

			const action = args[0];

			if (action === 'stats') {				
				return await message.channel.send({
					embeds: [{
						fields: [
							{
								name: 'Prefix',
								value: `${db.get('config').prefix}`
							},
							{
								name: 'Match Type',
								value: `${db.get('config').matchType}`
							},
							{
								name: 'Ban Stat',
								value: `${db.get('config').banStat ? 'Enabled' : 'Disabled'}`
							},
							{
								name: 'Logs Channel',
								value: `${message.guild.channels.cache.get(db.get('config').logsChannel?.id)}`
							},
							{
								name: 'Errors Channel',
								value: `${message.guild.channels.cache.get(db.get('config').errorsChannel?.id)}`
							}
						]
					}]
				});
			}

			if (action === 'logs') {
				const logsChannel = message.mentions.channels?.first();

				if (!logsChannel) {
					return await message.channel.send({
						embeds: [{
							title: 'Opps!',
							description: 'Please mention a valid channel.'
						}]
					});
				}

				db.set('config.logsChannel', logsChannel);
				
				return await message.channel.send({
					embeds: [{
						description: `Successfully set logs channel to ${logsChannel.toString()}`
					}]
				});
			}

			if (action === 'errors') {
				const errorsChannel = message.mentions.channels?.first();

				if (!errorsChannel) {
					return await message.channel.send({
						embeds: [{
							title: 'Opps!',
							description: 'Please mention a valid channel.'
						}]
					});
				}

				db.set('config.errorsChannel', errorsChannel);
				
				return await message.channel.send({
					embeds: [{
						description: `Successfully set errors channel to ${errorsChannel.toString()}`
					}]
				});
			}

			if (action === 'prefix') {
				const newPrefix = args[1];

				if (!newPrefix) {
					return await message.channel.send({
						embeds: [{
							title: 'Opps!',
							description: 'Please enter new prefix.'
						}]
					});
				}

				db.set('config.prefix', newPrefix);
				
				return await message.channel.send({
					embeds: [{
						description: `Successfully set prefix to \`${newPrefix}\``
					}]
				});
			}

			if (action === 'banStat') {
				const banStat = args[1];

				if (!banStat || banStat !== 'on' || banStat !== 'off') {
					return await message.channel.send({
						embeds: [{
							title: 'Opps!',
							description: 'Please enter either `on`/`off (Default)`.'
						}]
					});
				}
				
				if (banStat === 'on' && db.get('config.banStat')) {
					return await message.channel.send({
						embeds: [{
							title: 'Opps!',
							description: 'Ban is already enabled.'
						}]
					});
				}

				if (banStat === 'off' && !db.get('config.banStat')) {
					return await message.channel.send({
						embeds: [{
							title: 'Opps!',
							description: 'Ban is already disabled.'
						}]
					});
				}

				if (banStat === 'on') {
					db.set('config.banStat', true);
				
					return await message.channel.send({
						embeds: [{
							description: `Successfully enabled ban.`
						}]
					});
				}

				if (banStat === 'off') {
					db.set('config.banStat', false);
				
					return await message.channel.send({
						embeds: [{
							description: `Successfully disabled ban.`
						}]
					});
				}
			}

			if (action === 'matchType') {
				const matchType = args[1];

				if (!matchType || matchType !== 'exact' || matchType !== 'wildcard') {
					return await message.channel.send({
						embeds: [{
							title: 'Opps!',
							description: 'Please enter either `exact (Default)`/`wildcard`.'
						}]
					});
				}
				
				if (matchType === 'exact' && db.get('config.matchType') === 'exact') {
					return await message.channel.send({
						embeds: [{
							title: 'Opps!',
							description: 'Match type is already `exact`.'
						}]
					});
				}

				if (matchType === 'wildcard' && db.get('config.matchType') === 'wildcard') {
					return await message.channel.send({
						embeds: [{
							title: 'Opps!',
							description: 'Match type is already `wildcard`.'
						}]
					});
				}

				if (matchType === 'exact') {
					db.set('config.matchType', 'exact');
				
					return await message.channel.send({
						embeds: [{
							description: `Successfully set match type to \`exact\`.`
						}]
					});
				}

				if (matchType === 'wildcard') {
					db.set('config.matchType', 'wildcard');
				
					return await message.channel.send({
						embeds: [{
							description: `Successfully set match type to \`wildcard\`.`
						}]
					});
				}
			}
		} catch (err) {
			const errEmbed = new MessageEmbed()
				.setTitle('An Error Occurred.')
				.setDescription(`**Stack Trace:**\n\`\`\`${err.stack || err}\`\`\``);

			console.log(err);
            const supportErrorLog = message.client.channels.cache.get(db.get('config.errorsChannel').id);
			if (supportErrorLog) {
                await supportErrorLog.send({ embeds: [errEmbed] });
            }
		}
	}
}

module.exports = Config;