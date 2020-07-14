const Command = require("../structures/Command");
const { getMemberByMixed } = require("../utils/SearchUtils");
const { shortenText } = require("../utils/UtilCanvas");
const { createCanvas, loadImage, registerFont } = require('canvas');
const ErrorEmbed = require("../structures/models/embeds/ErrorEmebed");
const request = require('node-superfetch');
const path = require('path');
registerFont(path.join(__dirname, '..', 'src', 'fnts', 'Noto-Regular.ttf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', 'src', 'fnts', 'Noto-CJK.otf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', 'src', 'fnts', 'Noto-Emoji.ttf'), { family: 'Noto' });

class Steam extends Command {
    constructor(client) {
        super(client, {
            name: "steam",
            description: "none",
            category: "image",
            usage: "tip steam @[game] @[user]",
            aliases: ["steam-playing"],
            defaultFetch: ({str}) => str,
            params: [
                {
                    name: "game",
                    alias: ["g"],
                    type: ["str"],
                    spacedString: true,
                    optional: true,
                    iParse: ({input, ov}) => input,
                    defaultParse: ({ov}) => 'Solving Riemann Hypothesis',
                },
                {
                    name: "user",
                    alias: ["u"],
                    type: ["str"],
                    spacedString: true,
                    optional: true,
                    iParse : ({input, ov}) => getMemberByMixed(input, ov.guild),
                    defaultParse: ({ov}) => ov.user
                }
            ]
        });
    }

    async run(message, args, lvl, data) {
        const { sendImage } = this;
        if(data && data.defaults) {
            return await sendImage(undefined, data["defaults"], message);
        }
        if(data && typeof data === 'object') {
            const { user } = data["user"];
            const game = data["game"];
            return await sendImage(user, game, message);
        }
        return await sendImage(undefined, 'Minecraft', message);
    }

    async sendImage(member, game, message) {
        const { channel, settings, author } = message;
        const user = member ? member : author;
        try {
            const avatarURL = user.displayAvatarURL({ format: 'png', size: 64 });
            const base = await loadImage(path.join(__dirname, '..', 'src', 'img', 'steam.png'));
            const { body } = await request.get(avatarURL);
            const avatar = await loadImage(body);
            const canvas = createCanvas(base.width, base.height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(base, 0, 0);
            ctx.drawImage(avatar, 26, 26, 41, 42);
            ctx.fillStyle = '#90b93c';
            ctx.font = '14px Noto';
            ctx.fillText(user.username, 80, 34);
            ctx.fillText(shortenText(ctx, game, 200), 80, 70);
            return await channel.send({ files: [{ attachment: canvas.toBuffer(), name: 'wsh-je-jou-a.png' }] });
        } catch (err) {
            const error = new ErrorEmbed(err.message, settings).build();
            return await channel.send({embed: error});
        }
    }
}

module.exports = Steam;