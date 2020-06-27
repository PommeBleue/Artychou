const Field = require("./Field");

class FieldsArray {
    constructor() {
        this.array = [];
    }

    add(field){
        if(!(field instanceof Field)) return;
        if(field.name && field.value) {
            this.array.push(field);
        } else {
            return `Field object must have name and value defined.`
            throw new Error();
        }
    }

    getArray() {
        return this.array;
    }

}

module.exports = FieldsArray;