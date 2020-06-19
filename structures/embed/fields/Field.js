class Field {
    constructor(name, value) {
        this.name = name;
        this.value = value;
    }

    getValue() {
        return this.value;
    }

    getName() {
        return this.name;
    }

    setValue(value) {
        this.value = value;
        return this;
    }

    setName(name) {
        this.name = name;
        return this;
    }

};

module.exports = Field;