const Command = require("../structures/Command");
const ErrorEmbed = require("../structures/models/embeds/ErrorEmebed");
const {getRandom, getMemberByMixed} = require("../utils/SearchUtils");
const { parse } = require("../utils/ParseUtils");
const {createCanvas, loadImage, registerFont} = require('canvas');
const request = require('node-superfetch');
const path = require('path');
registerFont(path.join(__dirname, '..', 'src', 'fnts', 'go-it.otf'), {family: 'George Italic'});

//const couple = [];

class Ship extends Command {
    constructor(client) {
        super(client, {
            name: "ship",
            description: "none",
            category: "image",
            usage: "tip ship",
            aliases: ["amour"],
            params: [],
            permLevel: "Bot Developer"
        });
    }

    async run(message, args, lvl, data) {
        const {client, calculateLevelText} = this;
        const {channel, guild, settings, author} = message;
        try {
            let first = author;
            let second;
            switch (args.length) {
                case 0:
                    do {
                        first = getRandom(client, guild).user;
                    } while (first.bot);
                    do {
                        const {user} = getRandom(client, guild);
                        second = user;
                    } while (second === first || second.bot);
                    break;
                default:
                    let result = parse(args, getMemberByMixed, 1, guild);
                    if (!result) {
                        result = parse(args, getMemberByMixed, 2, guild);
                        if(!result) throw new Error('User not found');
                        first = result[0]["user"];
                        second = result[1]["user"];
                        break;
                    }
                    second = result[0]["user"];
                /*case 1:
                    const name = args.join(' ');
                    if (!getMemberByMixed(name, guild)) throw new Error('User not found.');
                    second = getMemberByMixed(name, guild)["user"];
                    break;
                case 2:

                    first = getMemberByMixed(name1, guild)["user"];
                    second = getMemberByMixed(name2, guild)["user"];
                    break;*/
            }
            const level = Math.floor(Math.random() * 101);
            const firstAvatarURL = first.displayAvatarURL({format: 'png', size: 512});
            const secondAvatarURL = second.displayAvatarURL({format: 'png', size: 512});
            const firstAvatarData = await request.get(firstAvatarURL);
            const firstAvatar = await loadImage(firstAvatarData.body);
            const secondAvatarData = await request.get(secondAvatarURL);
            const secondAvatar = await loadImage(secondAvatarData.body);
            const base = await loadImage(path.join(__dirname, '..', 'src', 'img', 'ship3.png'));
            const heart = await loadImage(path.join(__dirname, '..', 'src', 'img', 'heart.png'));
            const multiplier = calculateLevelText(level);
            const heartCanvas = createCanvas(heart.width * multiplier, heart.height * multiplier);
            const hCtx = heartCanvas.getContext('2d');
            hCtx.textAlign = 'center';
            hCtx.fillStyle = 'white';
            hCtx.font = `${40 * multiplier}pt George Italic`;
            hCtx.drawImage(heart, 0, 0, heart.width * multiplier, heart.height * multiplier);
            hCtx.fillText(`${level}%`, heart.width * multiplier / 2, heart.height * multiplier / 2 + (15 * multiplier));
            const canvas = createCanvas(base.width, base.height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(firstAvatar, 70, 56, 400, 400);
            ctx.drawImage(secondAvatar, 730, 56, 400, 400);
            ctx.drawImage(base, 0, 0);
            ctx.drawImage(heartCanvas, (canvas.width - heartCanvas.width) / 2, (canvas.height - heartCanvas.height) / 2);
            //ctx.fillStyle = percentColor(level / 100, percentColors);
            /*ctx.fillText(this.calculateLevelText(level), 600, 196);
            ctx.font = '90px Pinky Cupid';
            ctx.fillText(level > 49 ? '❤️' : '💔', 600, 100);*/
            return channel.send({files: [{attachment: canvas.toBuffer(), name: 'ship2.png'}]});
        } catch (err) {
            const error = new ErrorEmbed(err.message, settings).build();
            return await channel.send({embed: error});
        }
    }

    calculateLevelText(level) {
        if (level === 0) return 0.7;
        if (level > 0 && level < 10) return 0.7;
        if (level > 9 && level < 20) return 0.7;
        if (level > 19 && level < 30) return 0.7;
        if (level > 29 && level < 40) return 0.8;
        if (level > 39 && level < 50) return 0.85;
        if (level > 49 && level < 60) return 0.9;
        if (level > 59 && level < 70) return 1.1;
        if (level > 69 && level < 80) return 1.2;
        if (level > 79 && level < 90) return 1.25;
        if (level > 89 && level < 100) return 1.3;
        if (level === 100) return 1.5;
    }
}

module.exports = Ship;