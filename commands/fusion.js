const Command = require("../structures/Command");
const { getMemberByMixed } = require("../utils/SearchUtils");
const { random } = require("../utils/UtilFunctions");
const { loadImage, createCanvas } = require("canvas");
const request = require('node-superfetch');


class Fusion extends Command {
    constructor(client) {
        super(client, {
            name: "fusion",
            description: "fusionne deux photos de profil.",
            category: "image",
            usage: "tip fusion [user1] [user2]",
            params: []
        });
    }

    async run(message, args, lvl, data) {
        const { fusion } = this;
        const { channel, author } = message;
        const { user } = this.client;
        if(args.length) {
            let base;
            let overlay;
            if(args.length === 1) {
                base = getMemberByMixed(args[0]);
                overlay = author;
            } else {
                base = getMemberByMixed(args[0]);
                overlay = getMemberByMixed(args[1]);
            }
            return await fusion(base, overlay, channel);
        }
        const base = user;
        const overlay = author;
        return random(2) === 1 ? await fusion(base, overlay, channel) : await fusion(overlay, base, channel);
    }

    async fusion(base, overlay, channel) {
        const baseAvatarURL = base.displayAvatarURL({ format: 'png', size: 512 });
        const overlayAvatarURL = overlay.displayAvatarURL({ format: 'png', size: 512 });
        try {
            const baseAvatarData = await request.get(baseAvatarURL);
            const baseAvatar = await loadImage(baseAvatarData.body);
            const overlayAvatarData = await request.get(overlayAvatarURL);
            const overlayAvatar = await loadImage(overlayAvatarData.body);
            const canvas = createCanvas(baseAvatar.width, baseAvatar.height);
            const ctx = canvas.getContext('2d');
            ctx.globalAlpha = 0.5;
            ctx.drawImage(baseAvatar, 0, 0);
            ctx.drawImage(overlayAvatar, 0, 0, baseAvatar.width, baseAvatar.height);
            return await channel.send({ files: [{ attachment: canvas.toBuffer(), name: 'avatar-fusion.png' }] });
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = Fusion;