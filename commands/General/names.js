const Command = require("../../base/Command.js"),
	fetch = require("node-fetch"),
	db = require("quick.db"),
	{ MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

class Names extends Command {
	constructor (client) {
		super(client, {
			name: "names",
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
			if (!message.member.permissions.has('ADMINISTRATOR')) {
				return await message.channel.send({
					embeds: [{
						title: 'Opps!',
						description: 'This command can only be used by admins.'
					}]
				});
			}

			const action = args[0];

			if (!action) return await message.channel.send({ embeds: [{ title: 'Opps!', description: 'Please provide action.' }] });

			const banNames = args.splice(1).map(arg => arg.replace('+', ' '));

			if (action === 'aexact') {
				if (!banNames) return await message.channel.send({ embeds: [{ title: 'Opps!', description: 'Please provide names to ban.' }] });
				
				for (const name of banNames) {
					if (!db.get("spamNames").exact.find(bname => bname === name)) {
						db.push("spamNames.exact", name)
					}
				}
	
				return await message.channel.send({
					embeds: [{
						title: 'Successful!',
						description: `Added \`${banNames.map(name => name).join(", ")}\` to ban list successfully!`
					}]
				}); 
			}

			if (action === 'awild') {
				if (!banNames) return await message.channel.send({ embeds: [{ title: 'Opps!', description: 'Please provide names to ban.' }] });
				
				for (const name of banNames) {
					if (!db.get("spamNames").wildcard.find(bname => bname === name)) {
						db.push("spamNames.wildcard", name)
					}
				}
	
				return await message.channel.send({
					embeds: [{
						title: 'Successful!',
						description: `Added \`${banNames.map(name => name).join(", ")}\` to ban list successfully!`
					}]
				}); 
			}

			if (action === 'rexact') {
				if (!banNames) return await message.channel.send({ embeds: [{ title: 'Opps!', description: 'Please provide names to remove from ban list.' }] });
				
				const updateNameList = db.get("spamNames").exact.filter(name => !banNames.includes(name));
				db.set("spamNames.exact", updateNameList)
	
				return await message.channel.send({
					embeds: [{
						title: 'Successful!',
						description: `Removed \`${banNames.map(name => name).join(", ")}\` from ban list successfully!`
					}]
				}); 
			}

			if (action === 'rwild') {
				if (!banNames) return await message.channel.send({ embeds: [{ title: 'Opps!', description: 'Please provide names to remove from ban list.' }] });
				
				const updateNameList = db.get("spamNames").wildcard.filter(name => !banNames.includes(name));
				db.set("spamNames.wildcard", updateNameList)
	
				return await message.channel.send({
					embeds: [{
						title: 'Successful!',
						description: `Removed \`${banNames.map(name => name).join(", ")}\` from ban list successfully!`
					}]
				}); 
			}
			
			if (action === 'list') {	
				return await message.channel.send({
					embeds: [{
						title: 'Banned Names List',
						fields: [
							{
								name: 'Exact',
								value: `\`${db.get("spamNames").exact.length > 0 ? db.get("spamNames").exact.map(name => name).join(", ") : 'Exact list is empty.'}\``
							},
							{
								name: 'Wildcard',
								value: `\`${db.get("spamNames").wildcard.length > 0 ? db.get("spamNames").wildcard.map(name => name).join(", ") : 'Wildcard list is empty.'}\``
							}
						]
					}]
				}); 
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

module.exports = Names;