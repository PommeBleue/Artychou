const Command = require("../structures/Command");
const CanvasTextWrapper = require('canvas-text-wrapper').CanvasTextWrapper;
const {createCanvas, loadImage, registerFont} = require('canvas');
const CanvasWriter = require("../utils/classes/CanvasWriter");
const request = require('node-superfetch');
const path = require('path');
registerFont(path.join(__dirname, '..', 'src', 'fnts', 'cmunrm.ttf'), {family: 'CMU Serif'});

class Quote extends Command {
    constructor(client) {
        super(client, {
            name: "quote",
            description: "none",
            category: "image",
            usage: "tip quote",
            aliases: ["hp"],
            params: [],
        });
    }

    async run(message, args, lvl, data) {
        const {channel} = message;
        try {
            const max = args.join(' ').length;
            if (max > 150) throw new Error('no');
            //const phrase = cleanText(args);
            const base = await loadImage(path.join(__dirname, '..', 'src', 'img', 'quote2.png'));
            const canvas = new CanvasWriter(createCanvas(base.width, base.height));
            const { ctx } = canvas;
            ctx.drawImage(base, 0, 0);
            canvas.write(args.join(' '), 1400,{
                font: '80px "CMU Serif"',
                style: '#000000',
                maxLines: 4,
                //spacing: 35,
                align: 'left',
                x: 600,
                y: 150
            });
            /*ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            ctx.fillStyle = '#000000';
            ctx.font = '100px "CMU Serif"';*/
            //ctx.fillText(args.join(' '), 600, 250);
            console.log('');
            return channel.send({files: [{attachment: canvas.canvas.toBuffer(), name: 'happy_feet_ai_bo_wsh.png'}]});
        } catch (err) {
            throw err;
        }
    }
}

module.exports = Quote;