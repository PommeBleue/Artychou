const solenolyrics = require('solenolyrics');
const {cleanDiacritics, capitalize} = require("underscore.string");
const {MONTHS} = require("./types/TypeUtil");

/**
 *
 * @param time
 * @returns {Promise<unknown>}
 * @description Waits {time} and then returns a {Promise}.
 */
module.exports.delayAsync = async (time) => {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, time);
    });
};


/**
 *
 * @param message
 * @param client
 * @returns {number}
 * @description Calculates the level of the user that sent the message. Voilà c'est tout ce que j'ai à dire là-dessus,
 * ET PUIS QUOI ENCORE HEIN, JE DOIS TOUT EXPLIQUER ? VOUS SAVEZ LIRE NON, ALORS LISEZ CE CODE POUR LE COMPRENDRE.
 */
module.exports.permlevel = (message, client) => {
    let permlvl = 0;

    const permOrder = client.config.permLevels.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);

    while (permOrder.length) {
        const currentLevel = permOrder.shift();
        if (message.guild && currentLevel.guildOnly) continue;
        if (currentLevel.check(message)) {
            permlvl = currentLevel.level;
            break;
        }
    }
    return permlvl;
};

/**
 *
 * @param numberAnyType
 * @description Formats numbers.
 */
module.exports.numberFormat = (numberAnyType) => {
    return String(numberAnyType).replace(/(.)(?=(\d{3})+$)/g, '$1,');
};


/**
 *
 * @param text
 * @returns {Promise<string>}
 * @description "Clean" removes @everyone pings, as well as tokens, and makes code blocks
 escaped so they're shown more easily. As a bonus it resolves promises
 and stringifies objects!
 This is mostly only used by the Eval and Exec commands.
 */
module.exports.cleanTextAsync = async (text) => {
    if (text && text.constructor.name == "Promise")
        text = await text;
    if (typeof text !== "string")
        text = require("util").inspect(text, {depth: 1});

    text = text
        .replace(/`/g, "`" + String.fromCharCode(8203))
        .replace(/@/g, "@" + String.fromCharCode(8203))
        .replace(this.token, "mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0");

    return text;
};

/**
 *
 * @param message
 * @param question
 * @param limit
 * @returns {Promise<string|boolean>}
 * @description A simple way to grab a single reply, from the user that initiated
 the command. Useful to get "precisions" on certain things...
 USAGE
 const response = await client.awaitReply(msg, "Favourite Color?");
 msg.reply(`Oh, I really love ${response} too!`);
 */
module.exports.awaitReplyAsync = async (message, question, limit = 6000) => {
    const filter = m => m.author.id === message.author.id && !(m.author.bot);
    if (question) await message.channel.send(question);
    try {
        const collected = await message.channel.awaitMessages(filter, {max: 1, time: limit, errors: ["time"]});
        return collected.first().content;
    } catch (e) {
        return false;
    }
};

module.exports.parseInt = (number) => {
    const supportedFormat = ["k", "m"];
    console.log(number);
    const str = typeof number !== 'string' ? String(number) : number;
    let multiplier = null;
    if (supportedFormat.some(e => {
        multiplier = e;
        return e === str[str.length - 1].toLowerCase();
    })) {
        const newStr = str.slice(0, str.length - 1);
        const newNumber = Number(newStr);
        return newNumber * (supportedFormat.indexOf(multiplier) === 0 ? 1000 : 1000000);
    }
};

module.exports.parseTime = (time) => {
    const hours = Math.floor(time / 1000 / 60 / 60)
    const minutes = Math.floor((time - (hours * 1000 * 60 * 60)) / 1000 / 60);
    const seconds = Math.floor((time - (hours * 1000 * 60 * 60) - (minutes * 1000 * 60)) / 1000);
    return `${hours} Heure(s) ${minutes} minute(s) et ${seconds} seconde(s)`;
};


module.exports.isDay = (str) => {
    if (/\d{2}/) {
        const day = Number(str);
        return !(day > 31 || day < 1);
    }
    return false;
};

const isMonth = (str) => {
    const month = cleanAll(str);
    return MONTHS.some(x => x.indexOf(month));
};

module.exports.isYear = (str) => {
    return /\d{4}/.test(str);
};

module.exports.percentColor = (pct, percentColors) => {
    let i = 1;
    for (i; i < percentColors.length - 1; i++) {
        if (pct < percentColors[i].pct) {
            break;
        }
    }
    const lower = percentColors[i - 1];
    const upper = percentColors[i];
    const range = upper.pct - lower.pct;
    const rangePct = (pct - lower.pct) / range;
    const pctLower = 1 - rangePct;
    const pctUpper = rangePct;
    const color = {
        r: Math.floor((lower.color.r * pctLower) + (upper.color.r * pctUpper)).toString(16).padStart(2, '0'),
        g: Math.floor((lower.color.g * pctLower) + (upper.color.g * pctUpper)).toString(16).padStart(2, '0'),
        b: Math.floor((lower.color.b * pctLower) + (upper.color.b * pctUpper)).toString(16).padStart(2, '0')
    };
    return `#${color.r}${color.g}${color.b}`;
};


const cleanAll = (str) => {
    return capitalize(cleanDiacritics(str), true);
};

module.exports.returnMonth = (str) => {
    const m = cleanAll(str);
    if (!isMonth(m)) return false;
    for (let i = 0, len = MONTHS.length; i < len; i++) {
        const month = MONTHS[i];
        if(month.includes(m)) return i + 1;
    }
};

module.exports.random = (max)  => {
    return Math.floor(Math.random() * max);
};

module.exports.shorten = (text, maxLen = 2000) => {
    return text.length > maxLen ? `${text.substr(0, maxLen - 3)}...` : text;
};

module.exports.getMonth  = (index) => {
  return MONTHS[index][2];
};