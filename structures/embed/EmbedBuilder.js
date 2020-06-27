const {MessageEmbed} = require("discord.js");
const FieldsArray = require("./fields/FieldsArray");

class EmbedBuilder extends MessageEmbed {
    constructor() {
        super();

        this.fields = [];
    }

    setFieldsArray(fieldsArray) {
        this.fields = fieldsArray;
        return this;
    }

    updateFields() {
        if (this.fields.length) {
            let name;
            let value;
            let field;
            for (let i = 0; i < this.fields.length; i++) {
                field = this.fields[i];
                name = field.name;
                value = field.value;
                this.addField(name, value);
            }
        }
        return this;
    }
};

module.exports = EmbedBuilder;