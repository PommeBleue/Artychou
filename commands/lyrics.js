const Command = require("../structures/Command");
const ErrorEmbed = require("../structures/models/embeds/ErrorEmebed");
const LyricsEmbed = require("../structures/models/embeds/LyricsEmbed");
const SongsListEmbed = require("../structures/models/embeds/SongsListEmbed");

class LyricsCommand extends Command {
    constructor(client) {
        super(client, {
            name: "lyrics",
            description: "Flemme de la mettre mtn lol",
            category: "fun",
            usage: "lyrics @[song] or @![user]",
            aliases: ["paroles", "l"],
            defaultFetch: ({str}) => str,
            params: [
                {
                    name: "set",
                    alias: ["s"],
                    type: ["music"],
                    spacedString: true,
                    optional: true,
                    iParse: ({input, ov}) => input
                },
                {
                    name: "remove",
                    alias: ["r"],
                    type: [],
                    spacedString: true,
                    optional: true,
                    iParse: ({input, ov}) => input
                }
            ]
        });
    }

    async run(message, args, lvl, data) {
        const guild = message.guild;
        const channel = message.channel;
        const author = message.author;
        const id = author.id;
        const songs = this.client.songs[`songsarray_${guild.id}`].getArray(id);
        //const finder = message.packages["LyricsFinder"];

        if(data && data.defaults) {
            const fetched = data.defaults;
            const arg = fetched[0];
        }

        if (data && typeof data === 'object') {
            if(data["set"]){
                if(songs !== undefined && songs.length > 9) {
                    const error = new ErrorEmbed('Vous avez atteint la limite de paroles pouvant être enregistrées.', message.settings).build();
                    return await channel.send({embed: error});
                }
                const msg = await message.channel.send('Je vous prie de patienter pendant que je cherche les lyrics sur l\'Internet connecté.');
                const response = await this.client.songs[`songsarray_${guild.id}`].setSongInArray(id, data["set"]);
                if(typeof response === 'string' && response === 'error' ) await this.notFound(msg, message);
                if(!response) {
                    if(msg.deletable) await msg.delete();
                    const error = new ErrorEmbed("Tu as déjà cette musique dans ta liste" , message.settings).build();
                    return await message.channel.send({embed: error});
                }
                const listener = this.client.packages["YesNoListener"];
                const lyrics = response.getLyricsInArray();
                console.log(lyrics);
                if(lyrics === 'error' || lyrics.length === 0) {
                    this.client.songs[`songsarray_${guild.id}`].pop(id);
                    return await this.notFound(msg, message);
                }
                if(lyrics.join('').length < 4096) {
                    if(msg.deletable) await msg.delete();
                    if(lyrics.join('').length > 2048) {
                        const lyrics1 = lyrics.slice(0, 50);
                        const lyrics2 = lyrics.slice(30, lyrics.length);
                        const embed = new LyricsEmbed(lyrics1, message.settings).build();
                        const embed2 = new LyricsEmbed(lyrics2, message.settings, "La suite mon chou.").build();
                        await message.channel.send({embed});
                        await message.channel.send({embed: embed2});
                    } else {
                        const embed = new LyricsEmbed(lyrics, message.settings).build();
                        await message.channel.send({embed});
                    }
                } else {
                    const error = new ErrorEmbed("Cette chanson ne peut pas être ajoutée puisque trop longue." , message.settings).build();
                    this.client.songs[`songsarray_${guild.id}`].pop(id);
                    return await message.channel.send({embed: error});
                }
                const listened = await listener.listenAsync(message, `Est-ce que c'est bien ce que tu cherchais mou chou ?`);
                if(typeof listened === 'string')
                {
                    if(listened === 'error') {
                        this.client.songs[`songsarray_${guild.id}`].pop(id);
                        return await message.channel.send(`Oups, il semblerait que tu n'aies pas saisi de réponse.`);
                    }
                    if(listened === 'response_not_valid') {
                        this.client.songs[`songsarray_${guild.id}`].pop(id);
                        return false;
                    }
                    return false;
                }
                if(listened) {
                    await message.channel.send(`Génial ! ${response.getTitle()} by ${response.getAuthor()} a été ajouté à votre liste.`);
                    const title = String(response.getTitle());
                    const newArray = this.client.songGuildManger.getUserSongsArray(guild, id);
                    newArray.push(`${title}`);
                    this.client.songGuildManger.setSongsArray(newArray, guild, id);
                    return;
                } else if(listened ===  'response_not_valid') {
                    await message.channel.send(`Pas compris ta réponse :(`);
                    this.client.songs[`songsarray_${guild.id}`].pop(id);
                } else {
                    await message.channel.send(`Ça marche.`);
                    this.client.songs[`songsarray_${guild.id}`].pop(id);
                }
                return;
            }

            if(data["remove"]) {
                const argument = data["remove"];
                let song = null;
                for(let i=0; i<songs.length; i++){
                    const s = songs[i];
                    if(s.getTitle().toLowerCase() === argument.toLowerCase()){
                        song = s;
                        break;
                    }
                    if(String(i+1) === argument) {
                        song = s;
                        break;
                    }
                    song = false;
                }
                if(!song){
                    const error = new ErrorEmbed(`${String(data["remove"])} n'est pas un argument valide. Il est conseillé de faire \`tip lyrics\` 
                    pour voir sa liste de paroles enregistrées et voir quel est le bon titre à mettre en argument. La position de ce dernier peut être resneignée en remplacement.`, message.settings).build();

                    return await channel.send({embed: error});
                }
                console.log(song.getTitle());
                const bool = this.client.songs[`songsarray_${guild.id}`].removeSongFromArray(id, song.getTitle());
                if(bool) return await channel.send(`${song.getTitle()} by ${song.getAuthor()} a été supprimé de la liste.`);
                return console.log('error');


            }

            return;
        }

        const embed = new SongsListEmbed(songs, message.settings).build();
        await channel.send({embed});
    }

    async notFound(msg, message){
        if(msg.deletable) await msg.delete();
        const error = new ErrorEmbed("Je n'ai pas trouvé de lyrics pour ta chanson. Elle doit puer la merde.", message.settings).build();
        return await message.channel.send({embed: error});
    }
}

module.exports = LyricsCommand;