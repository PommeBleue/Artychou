class Song {
    constructor({lyrics, title, author}) {
        this.lyrics = lyrics;
        this.title = title;
        this.author = author;
    }

    getAuthor(){
        return this.author;
    }

    getTitle(){
        return this.title;
    }

    getLyricsInArray(){
        const lyrics = this.lyrics;
        return Array.isArray(lyrics) ? lyrics : lyrics.split(/\n/);
    }

    setLyrics(lyrics){
        this.lyrics = lyrics;
        return this;
    }

    setTitle(title){
        this.title = title;
        return this;
    }

    setAuthor(author){
        this.author = author;
        return this;
    }
}

module.exports = Song;