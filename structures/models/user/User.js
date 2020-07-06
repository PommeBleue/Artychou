class User {
    constructor(id, username) {

        this.username = username;

        this.id = id;

        this.bal = 200;

        this.botOwner = false;

        this.daily = 0;

        this.ccount = 0;

        this.registeredAt = Date.now();

        this.experience = 0;

    }

    getUserId(){
        return this.id;
    }


    getUsername(){
        return this.username;
    }

    isBotOwner(){
        return this.botOwner;
    }

    getBalance(){
        return this.bal;
    }

    setBalance(amount){
        this.bal = amount;
        return this;
    }

    getDaily(){
        return this.daily;
    }

    setDaily(number){
        this.daily = number;
        return this;
    }

    setCommandCount(number){
        this.ccount = number;
        return this;
    }

    setExperience(exp){
        this.experience = exp;
        return this;
    }

    setBotOwner(boolean = false) {
        this.botOwner = boolean;
        return this;
    }

    setUserName(name){
        if(typeof name === 'string'){
            this.username = name;
            return this;
        }
        throw new Error();
    }

    setRegisteredAt(date) {
        this.registeredAt = date;
        return this;
    }

}

module.exports = User;