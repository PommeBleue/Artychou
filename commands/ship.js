const Command = require("../structures/Command");
const { getRandom } = require("../utils/SearchUtils");
const { percentColor } = require("../utils/UtilFunctions");
const { createCanvas, loadImage, registerFont } = require('canvas');
const request = require('node-superfetch');
const path = require('path');
registerFont(path.join(__dirname, '..', 'src', 'fnts', 'Pinky Cupid.otf'), { family: 'Pinky Cupid' });
const percentColors = [
    { pct: 0.0, color: { r: 0, g: 0, b: 255 } },
    { pct: 0.5, color: { r: 255 / 2, g: 0, b: 255 / 2 } },
    { pct: 1.0, color: { r: 255, g: 0, b: 0 } }
];
//const couple = [];

class Ship extends Command {
    constructor(client) {
        super(client, {
            name: "ship",
            description: "none",
            category: "fun",
            usage: "tip neo",
            aliases: ["amour"],
            params: [],
            permLevel: "Bot Developer"
        });
    }

    async run(message, args, lvl, data) {
        const { client } = this;
        const { channel, guild } = message;
        let first = getRandom(client, guild).user;
        do {
            first = getRandom(client, guild).user;
        } while (first.bot);
        let second;
        /*if(couple.includes(first.id)) {
            second = couple[couple.indexOf(first.id) === 1 ? 0 : 1]
        }*/
        do {
            const { user } = getRandom(client, guild);
            second = user;
        } while (second === first);
        const level = Math.floor(Math.random() * 101);
        const firstAvatarURL = first.displayAvatarURL({ format: 'png', size: 512 });
        const secondAvatarURL = second.displayAvatarURL({ format: 'png', size: 512 });
        try {
            const firstAvatarData = await request.get(firstAvatarURL);
            const firstAvatar = await loadImage(firstAvatarData.body);
            const secondAvatarData = await request.get(secondAvatarURL);
            const secondAvatar = await loadImage(secondAvatarData.body);
            const base = await loadImage(path.join(__dirname, '..', 'src', 'img', 'ship2.png'));
            const canvas = createCanvas(base.width, base.height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(firstAvatar, 70, 56, 400, 400);
            ctx.drawImage(secondAvatar, 730, 56, 400, 400);
            ctx.drawImage(base, 0, 0);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillStyle = '#ff6c6c';
            ctx.font = '40px Pinky Cupid';
            ctx.fillText('Happy Feet sait qui sont les amoureux.', 600, 15);
            ctx.fillStyle = 'white';
            ctx.fillText(first.username, 270, 448);
            ctx.fillText(second.username, 930, 448);
            ctx.font = '60px Pinky Cupid';
            ctx.fillStyle = percentColor(level / 100, percentColors);
            ctx.fillText(`~${level}%~`, 600, 130);
            ctx.fillText(this.calculateLevelText(level), 600, 196);
            ctx.font = '90px Pinky Cupid';
            ctx.fillText(level > 49 ? '❤️' : '💔', 600, 100);
            return channel.send({ files: [{ attachment: canvas.toBuffer(), name: 'ship2.png' }] });
        } catch (err) {
            throw err;
        }
    }

    calculateLevelText(level) {
        if (level === 0) return 'Abysmal';
        if (level > 0 && level < 10) return 'Horrid';
        if (level > 9 && level < 20) return 'Awful';
        if (level > 19 && level < 30) return 'Very Bad';
        if (level > 29 && level < 40) return 'Bad';
        if (level > 39 && level < 50) return 'Poor';
        if (level > 49 && level < 60) return 'Average';
        if (level > 59 && level < 70) {
            if (level === 69) return 'Nice';
            return 'Fine';
        }
        if (level > 69 && level < 80) return 'Good';
        if (level > 79 && level < 90) return 'Great';
        if (level > 89 && level < 100) return 'Amazing';
        if (level === 100) return 'Soulmates';
        return '???';
    }
}

module.exports = Ship;