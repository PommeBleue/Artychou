const EmbedBuilder = require('../../embed/EmbedBuilder');

class SettingsKeysEmbed extends EmbedBuilder {
    constructor(type, settings, path) {
        super();
        this.footer = settings["standard_footer"];
        this.color = (settings["colors"])["settings_color"];
        this.title = settings["titles"]["standard_settings_key_title"];
        this.message = type ? settings["messages"]["standard_settings_value_message"] : settings["messages"]["standard_settings_key_list_message"].replace("[path]", path);
    }

    build() {
        const title = this.title;
        const message = this.message;
        const footer = this.footer;
        const color = this.color;
        this.setTitle(title)
            .setDescription(message)
            .setColor(color)
            .setFooter(footer);

        return this;
    }
}

module.exports = SettingsKeysEmbed;