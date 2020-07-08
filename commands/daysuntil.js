const Command = require("../structures/Command");
const ErrorEmbed = require("../structures/models/embeds/ErrorEmebed");
const { returnMonth, isDay, isYear, getMonth } = require("../utils/UtilFunctions");
const moment = require('moment');
require('moment-duration-format');

class ISSCommand extends Command {
    constructor(client) {
        super(client, {
            name: "whereisiss",
            description: "Vous combien de temps reste-il avant une certaine date.",
            category: "until",
            usage: "tip daysuntil [day] [month]",
            aliases: ["du"],
            params: []
        });
    }

    async run(message, args, lvl, data) {
        const { channel, settings } = message;
        const now = new Date();
        const day = isDay(args[0]) ? Number(args[0]) : false;
        const month = args[1] ? returnMonth(args[1]) : now.getMonth();
        console.log(month);
        const year = args[2] ? isYear(args[2]) ? Number(args[2]) : false : now.getFullYear();
        if(!year || !month || !day) {
            const error = new ErrorEmbed('Not so valid inputs, bitch', settings).build();
            return await channel.send({embed: error});
        }
        const future = new Date(`${month}/${day}/${year}`);
        const time = moment.duration(future - now);
        return await channel.send(`Il reste **${time.years() ? `${time.years() === 1 ? `une année ` : `${time.years()} années `}` : ''}${time.months() ? `${time.months()} mois ` : ''}${time.days() ? time.days() === 1 ? `${time.months() || time.years() ?  'et un jour ' : 'un jour '}` : `${time.months() || time.years() ?  `et ${time.days()} jours ` : `${time.days()} jours `}` : ''}**avant le ${future.getDate()} ${getMonth(future.getMonth())} ${future.getFullYear()}!`);
    }
}

module.exports = ISSCommand;