const Parse = require('../structures/parse/Parse');

module.exports = class {
    constructor(client) {
        this.client = client;
    }



    async run(message) {

        //If the user is a bot, return;
        if(message.author.bot) return;
        const settings = this.client.config.defaultSettings;

        //We are linking some stuff to the message itself so it's easy to access in the command class.
        message.logger = this.client.logger;
        message.settings = this.client.settingsHandler.getSettings(message.guild);
        message.users = this.client.usermanager;
        message.func = this.client.func;
        message.songs = this.client.songs;
        let prefix = message.settings.prefix;

        if(message.guild && !message.channel.permissionsFor(message.guild.me).missing("SEND_MESSAGES")) return;

        if(!prefix) return;

        if(message.content.indexOf(message.settings.prefix) !== 0) {

            const packages = this.client.packages;

            await packages["ThreeMListener"].doAsync(message);
            await packages["AnotherWordListener"].doAsync(message);
            await packages["LyricsListener"].doAsync(message);

            const prefixMention = new RegExp(`^<@!?${this.client.user.id}> ?$`);
            if (message.content.match(prefixMention)) {
                return message.channel.send(`Mon nom à moi est **${this.client.user.tag}** ! ||C'est quoi ton numéro ?||`);
            }
            return;
        }

        const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();

        if(message.guild && !message.member) await this.client.users.fetch(message.author.id);

        const level = message.func.permlevel(message, this.client);

        const cmd = this.client.handler.commands.get(command) || this.client.handler.aliases.get(command);

        if (cmd && !message.guild && cmd.conf.guildOnly)
            return message.channel.send("Yo petite pute, cette commande ne peut pas être executée dans un DMChannel, il faut se rendre dans un serveur où j'existe pour ça.");

        if(!message.channel.guild) return;

        if(!cmd) return;

        if (level < this.client.levelCache[cmd.conf.permLevel]) {
            if (settings.systemNotice && settings.systemNotice === "true") {
                return message.channel.send(`You do not have permission to use this command.
                    Your permission level is ${level} (${this.client.config.permLevels.find(l => l.level === level).name})
                    This command requires level ${this.client.levelCache[cmd.conf.permLevel]} (${cmd.conf.permLevel})`);
            } else {
                console.log('no perms');
            }
        }

        const parse = new Parse(args, cmd.conf.params, message).init();

        if(!parse) {
            try {
                return cmd.run(message, args, level, undefined);
            } catch (e) {
                throw e;
            }
        }

        if(parse.defaults) {
            const argsData = parse.defaults.defaultFetch(cmd.conf.defaultFetch);
            try {
                return cmd.run(message, args, level, argsData);
            } catch (e) {

            }
        }

        const verify = parse.verify();
        if(verify) {
            const argData = parse.fetch();
            if(argData) {
                try {
                    return cmd.run(message, args, level, argData);
                } catch (e) {
                    throw e;
                }
            }
        }


    }
};