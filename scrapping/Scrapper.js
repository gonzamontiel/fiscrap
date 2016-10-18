var config = require("config");

module.exports = class Scrapper {
    constructor() {
        this.file = config.get('scrappers.output') +
            this.getFileName() +
            "." + config.get('scrappers.extension');
    }

    getFileName() {
        throw Error('notImplemented');
    }
};
