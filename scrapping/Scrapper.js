const config = require("config");
const Logger = require("../Logger.js");
const Sync = require("../Sync.js");

class Scrapper {
    constructor(preventSync) {
        this.preventSync = preventSync || false;
        this.filePath = this.buildPathFromName(this.getFileName());
    }

    buildPathFromName(name) {
        return config.get('scrappers.output') + name + "." + config.get('scrappers.extension');
    }

    getFilePath() {
        return this.filePath;
    }

    getFileName() {
        throw Error('notImplemented: getFileName');
    }

    run(callback) {
        throw Error('notImplemented: run');
    }

    validateResults(content) {
        throw Error('notImplemented: validateResults');
    }

    finish(results, customFileName) {
        var path;
        if (customFileName) {
            path = this.buildPathFromName(customFileName);
        } else {
            path = this.getFilePath();
        }
        if (!results) {
            Logger.error('Scrapper finished round without any results. ' + path + ' was not modified');
        }
        if (!this.validateResults()) {
            Logger.error('Scrapper finished round with malformed results. ' + path + ' was not modified');
        }
        if (!this.preventSync) {
            var sync = new Sync(path, results);
            var result = sync.run(function(err, msg) {
                if (err) {
                    Logger.error(msg);
                } else {
                    Logger.info(msg);
                }
            });
        }
    }
}

module.exports = Scrapper;
