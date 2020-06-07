const { Bot, Collection } = require('discord.js');

module.exports = class extends Bot {
    constructor(config) {
        super({
            disableEveryone: true,
            disabledEvents: ['TYPING_START']
        });

        this.commands = new Collection();

        this.queue = new Map();

        this.config = config;
    }
}