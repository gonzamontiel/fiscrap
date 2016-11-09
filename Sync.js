const md5File = require('md5-file');
const jsonfile = require('jsonfile');
const path = require('path');
const fs = require('fs');
const logger = require('./Logger.js');
const JsDiff = require('diff');

const TEMP_FOLDER = "/tmp";

class Sync {
    constructor(fileName, newContent) {
        this.savedFileName = fileName;
        this.newContent = newContent;
    }

    calculateDiff(oldContent) {
        return JsDiff.diffJson(
            oldContent,
            this.newContent
        );
    }

    contentChanged() {
        if (!fs.accessSync(this.savedFileName, fs.constants.F_OK)) {
            return true;
        }
        var oldContent = jsonfile.readFileSync(this.savedFileName);
        var diff = this.calculateDiff(oldContent);
        return diff.added || diff.removed;
    }

    updateFile() {
        jsonfile.writeFileSync(
            this.savedFileName,
            this.newContent,
            {spaces: 2, flag: 'w+'}
        );
    }

    run(callback) {
        var savedFileExists = true, me = this;
        fs.open(this.savedFileName, 'r', (err, fd) => {
            if (err) {
                if (err.code === "ENOENT") {
                    savedFileExists = false;
                } else {
                    throw err;
                }
            }
            if (!savedFileExists) {
                me.updateFile();
                callback(false, 'Scrapper finished correctly. ' + me.savedFileName + ' has been created and updated.');
            } else if (me.contentChanged()) {
                fs.rename(me.savedFileName, me.savedFileName + ".old");
                me.updateFile();
                callback(false, 'Scrapper finished correctly. ' + me.savedFileName + ' has been updated. Old contents were stored in ' + me.savedFileName + '.old');
            } else {
                callback(false, 'Scrapper finished correctly but with no changes. ' + me.savedFileName + ' has not been changed');
            }
        });
    }
}

// return 'Scrapper finished corectly. ' + this.savedFileName + ' has been updated';
module.exports = Sync;
