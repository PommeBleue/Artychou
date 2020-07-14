const Command = require("../structures/Command");
const ErrorEmbed = require("../structures/models/embeds/ErrorEmebed");
const { getMemberByMixed } = require("../utils/SearchUtils");
const { createCanvas, loadImage } = require('canvas');
const GIFEncoder = require('gifencoder');
const request = require('node-superfetch');
const path = require('path');
const { streamToArray } = require('../utils/UtilFunctions');
const { drawImageWithTint } = require("../utils/UtilCanvas");
const coord1 = [-25, -33, -42, -14];
const coord2 = [-25, -13, -34, -10];
const coord1bis = [-20, -28, -27, -9];
const coord2bis = [218-5, 218-3, 218-7, 218-2];

class Triggered extends Command {
    constructor(client) {
        super(client, {
            name: "triggered",
            description: "pouet pouet",
            category: "image",
            usage: "tip triggered @[user]",
            aliases: ["lgsur"],
            params: []
        });
    }

    async run(message, args, lvl, data) {
        const { getUser } = this;
        const { channel, settings } = message;
        try {
            const { user } = getUser(args, message);
            const avatarURL = user.displayAvatarURL({ format: 'png', size: 512 });
            const base = await loadImage(path.join(__dirname, '..', 'src', 'img', 'lgsur.png'));
            const { body } = await request.get(avatarURL);
            const avatar = await loadImage(body);
            const encoder = new GIFEncoder(base.width, base.width);
            const canvas = createCanvas(base.width, base.width);
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, base.width, base.width);
            const stream = encoder.createReadStream();
            encoder.start();
            encoder.setRepeat(0);
            encoder.setDelay(50);
            encoder.setQuality(200);
            for (let i = 0; i < 4; i++) {
                drawImageWithTint(ctx, avatar, 'red', coord1[i], coord2[i], 300, 300);
                ctx.drawImage(base, coord1bis[i], coord2bis[i], 256*1.2, 38*1.2);
                encoder.addFrame(ctx);
            }
            encoder.finish();
            const buffer = await streamToArray(stream);
            return await channel.send({ files: [{ attachment: Buffer.concat(buffer), name: 'triggered.gif' }] });
        } catch (err) {
            const error = new ErrorEmbed(err.message, settings).build();
            return await channel.send({embed: error});
        }
    }

    getUser(args, message) {
        const { author, guild } = message;
        if(args.length) {
            const name = args[0];
            const member = getMemberByMixed(name, guild);
            if(!member) throw new Error('User not found.');
            return member;
        }
        const user = author;
        return { user };
    }
}

module.exports = Triggered;