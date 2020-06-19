const Field = require("./Field");

class FieldsArray {
    constructor() {
        this.array = [];
    }

    add(field){
        if(field instanceof Field) return;
        if(field.name && field.value) {
            this.array.push(field);
        } else {
            throw new Error();
            return `Field object must have name and value defined.`
        }
    }

    getArray() {
        return this.array;
    }

}