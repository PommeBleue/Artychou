const Command = require("../structures/Command");
const got = require('got');
const CraftEmbed = require("../structures/models/embeds/CraftEmbed")

class SpaceMen extends Command {
    constructor(client) {
        super(client, {
            name: "spacemen",
            category: "Big Brain, Tiny Muscles",
            description: "Combien y a-t-il de personnes là-haut ?",
            usage: "tip spacemen",
            aliases: ["sm"],
            params: [""]
        });
    }

    async run(message, args, lvl, data) {
        const { channel, settings } = message;
        try {
            const { body } = await got('http://api.open-notify.org/astros.json');
            const obj = JSON.parse(body);
            const crafts = {};
            for (const person of obj.people) {
                if (crafts[person.craft]) crafts[person.craft].push(person.name);
                else crafts[person.craft] = [person.name];
            }
            const embed = new CraftEmbed(crafts, settings).build(obj);
            return await channel.send({embed});
        } catch (err) {
            throw err;
        }

    }
}

module.exports = SpaceMen;