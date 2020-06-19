module.exports = class {
    constructor(client) {
        this.client = client;
    }

    async run(message) {

        //If the user is a bot, return;
        if(message.author.bot) return;

        if(!this.client.dbHandler.exists(this.client.dbHandler.getUserById(message.author.id))){
            await this.client.dbHandler.createUser(this.client.dbHandler, message.author, this.client.config.defaultUser).saveNew();
        }

        if(message.guild && !message.channel.permissionsFor(message.guild.me).missing("SEND_MESSAGES")) return;

        const settings = this.client.config.defaultSettings;

        message.settings = settings;

        let prefix = message.settings.prefix;
        if(!prefix) return;

        if(message.content.indexOf(message.settings.prefix) !== 0) {
            const prefixMention = new RegExp(`^<@!?${this.client.user.id}> ?$`);
            if (message.content.match(prefixMention)) {
                return message.channel.send(`Mon nom à moi est **${this.client.user.tag}** ||C'est quoi ton numéro ?||`);
            }
            return;
        }

        const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();

        if(message.guild && !message.member) await this.client.users.fetch(message.author.id);

        const level = null;

        const cmd = this.client.handler.commands.get(command) || this.client.handler.aliases.get(command);

        if(!cmd) return;

        try {
            cmd.run(message, args, level);
        } catch (e) {

        }
    }
};