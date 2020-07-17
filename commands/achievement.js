const path = require('path');
const Command = require("../structures/Command");
const ErrorEmbed = require("../structures/models/embeds/ErrorEmebed");

const { shortenText } = require("../utils/UtilCanvas");
const { createCanvas, loadImage, registerFont } = require('canvas');

registerFont(path.join(__dirname, '..', 'src', 'fnts', 'Minecraftia.ttf'), { family: 'Minecraftia' });

class Achievement extends Command {
    constructor(client) {
        super(client, {
            name: "achievement",
            description: "none",
            category: "image",
            usage: "tip achievement [text]",
            aliases: ["ach"],
            defaultFetch: ({str}) => str,
            params: []
        });
    }

    async run(message, args, lvl, data) {
        const { channel } = message;
        let text = 'Il manque un argument à ta commande.';
        if(args.length) text = args.join(' ');
        const base = await loadImage(path.join(__dirname, '..', 'src', 'img', 'achievement.png'));
        const canvas = createCanvas(base.width, base.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(base, 0, 0);
        ctx.font = '10px Minecraftia';
        ctx.fillStyle = '#ffff00';
        ctx.fillText('Tu as enfin accompli quelque chose.', 55, 35);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(shortenText(ctx, text, 230), 55, 50);
        return await channel.send({ files: [{ attachment: canvas.toBuffer(), name: 'achievement.png' }] });
    }
}

module.exports = Achievement;