const Command = require("../structures/Command");
const ErrorEmbed = require("../structures/models/embeds/ErrorEmebed");
const LyricsEmbed = require("../structures/models/embeds/LyricsEmbed");
const SongInfoEmbed = require("../structures/models/embeds/SongInfoEmbed");


class SongInfo extends Command {
    constructor(client) {
        super(client, {
            name: "song",
            description: "Cherches une musique sur Genius",
            usage: "tip song ![song]",
            aliases: ["s", "genius"],
            category: "music"
        });
    }

    async run(message, args, lvl, data) {
        const channel = message.channel;
        const settings = message.settings;
        const finder = this.client.packages["LyricsFinder"];
        const listener = this.client.packages["OneWordListeners"];

        if (args) {
            const name = args.join(' ');
            const song = await finder.getSong(name);
            console.log(song);
            if(!song ) {
                const error = new ErrorEmbed('Song not found.', message.settings).build();
                return channel.send({embed: error})
            }
            const lyrics = song.getLyricsInArray();
            const embed = new SongInfoEmbed(song, settings).build();
            await channel.send({embed});
            const listened = await listener.listenAsync(message, 'lyrics', 60000);
            if (listened && typeof listened === 'boolean') {
                if(lyrics.length === 1 || lyrics.length === 0) {
                    const error = new ErrorEmbed('J\'ai pas pu charger les paroles, ou bien ta chanson n\'en a pas, ou bien Genius codent leur api avec leur derrière, ou bien t\'es juste con.', message.settings).build();
                    return await channel.send({embed: error});
                }
                if (lyrics.join('').length < 4096) {
                    if (lyrics.join('').length > 2048) {
                        const lyrics1 = lyrics.slice(0, 50);
                        const lyrics2 = lyrics.slice(30, lyrics.length);
                        const embed = new LyricsEmbed(lyrics1, message.settings).build();
                        const embed2 = new LyricsEmbed(lyrics2, message.settings, "La suite mon chou.").build();
                        await channel.send({embed});
                        await channel.send({embed: embed2});
                    } else {
                        const embed = new LyricsEmbed(lyrics, message.settings).build();
                        await channel.send({embed});
                    }
                } else {
                    const error = new ErrorEmbed("Les paroles de cette chanson ne peut pas être affichée puisque trop longue.", message.settings).build();
                    return await channel.send({embed: error});
                }

                return false;
            }
        }
    }
}

module.exports = SongInfo;