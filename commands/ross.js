const Command = require('../structures/Command');
const ErrorEmbed = require("../structures/models/embeds/ErrorEmebed");
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const path = require('path');
const { getMemberByMixed } = require('../utils/SearchUtils');
const { centerImagePart } = require('../utils/UtilCanvas');
const { parse } = require('../utils/ParseUtils');

class Ross extends Command {
    constructor(client) {
        super(client, {
            name: 'bob-ross',
            description: 'none',
            category: 'image',
            aliases: ['ross'],
            params: []

        });
    }

    async run(message, args, lvl, data) {
        const { channel, settings, author, guild } = message;
        let user = author;
        try {
            if(args.length) {
                const result = parse(args, getMemberByMixed, 1, guild);
                if(!result) throw new Error('User not found.');
                user = result[0]["user"];
            }
            const image = user.displayAvatarURL({format: 'png', size: 512});
            const base = await loadImage(path.join(__dirname, '..', 'src', 'img', 'ross.png'));
            const { body } = await request.get(image);
            const data = await loadImage(body);
            const canvas = createCanvas(base.width, base.height);
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, base.width, base.height);
            const { x, y, width, height } = centerImagePart(data, 440, 440, 15, 20);
            ctx.drawImage(data, x, y, width, height);
            ctx.drawImage(base, 0, 0);
            return await channel.send({ files: [{ attachment: canvas.toBuffer(), name: 'bob-ross.png' }] });
        } catch (err) {
            const error = new ErrorEmbed(`${err.message}${err.message[err.message.length - 1] === '.' ? '' : '.'}`, settings).build();
            await channel.send({embed: error});
        }
    }
}

module.exports = Ross;
