const Discord = require("discord.js");

module.exports = class {

	constructor (client) {
		this.client = client;
	}

	async run (oldMember, newMember) {
		const client = this.client;
		
		await client.modLogs(newMember);
	}
};