class Song {
    constructor(song, lyrics) {
        this.song = song;
        this.lyrics = lyrics;
    }

    getTitle() {
        return this.song["title"];
    }

    getLyrics() {
        return this.lyrics;
    }

    getAuthor() {
        const artist = this.getPrimaryArtist();
        return artist.name;
    }

    getPrimaryArtist() {
        return this.song["primary_artist"];
    }

    getLyricsInArray() {
        const lyrics = this.lyrics.split(/\n/);
        return lyrics.filter(x => !(x[0] === "[" && x[x.length - 1] === "]"));
    }

    getFullTitle() {
        return this.song["full_title"];
    }

    getId() {
        return this.song["Id"];
    }

    getReleaseDate() {
        return this.song["release_date"];
    }

    getReleaseDateForDisplay() {
        return this.song["release_date_for_display"];
    }

    getImageUrl(){
        return this.song["song_art_image_url"];
    }

    getUrl() {
        return this.song["url"];
    }

    getAlbumObject() {
        return this.song["album"];
    }

}

module.exports = Song;