class Command {
    constructor(client, {
        name = null,
        description = 'Pas de description',
        category = 'Pas de catégorie',
        usage = 'Pas de format recommendé',
        enabled = true,
        guildOnly = false,
        aliases = [],
        permLevel = "User"
    }) {
        this.client = client;
        this.conf = { enabled, guildOnly, aliases, permLevel };
        this.help = { name, description, category, usage };
    }
}

module.exports = Command;