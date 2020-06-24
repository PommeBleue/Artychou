class Command {
    constructor(client, {
        name = null,
        description = 'Pas de description',
        category = 'Pas de catégorie',
        usage = 'Pas de format recommendé',
        enabled = true,
        guildOnly = false,
        args =  {},
        aliases = [],
        params = [],
        permLevel = "User"
    }) {
        this.client = client;
        this.conf = { enabled, guildOnly, aliases, permLevel, args, params };
        this.help = { name, description, category, usage };
    }
}

module.exports = Command;