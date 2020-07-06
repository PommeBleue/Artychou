class Command {
    constructor(client, {
        name = null,
        description = 'Pas de description',
        category = 'Pas de catégorie',
        usage = 'Pas de format recommendé',
        enabled = true,
        guildOnly = false,
        aliases = [],
        params = [],
        defaultFetch = (...args) => args,
        permLevel = "User"
    }) {
        this.client = client;
        this.conf = { enabled, guildOnly, permLevel, params, defaultFetch};
        this.help = { name, description, category, usage, aliases };
    }
}

module.exports = Command;