var osmosis = require('osmosis');
var jsonfile = require('jsonfile');
var fs = require('fs');
var parsing = require('./parsing.js');
var Scrapper = require('./Scrapper.js');
var Logger = require('../Logger.js');

class NewsScrapper extends Scrapper {
    constructor(preventSync) {
        super(preventSync);
    }

    getFileName() {
        return __filename
            .replace(__dirname, '')
            .replace("Scrapper.js", "");
    }

    run() {
        var events = [];
        var me = this;
        osmosis
        .get('http://www.fi.uba.ar/es')
        .find('.view-novedades .view-content .views-row')
        .set({
            'title': 'h2.node-title a',
            'link': '.node-title a @href',
            'created': 'p.submitted time',
            'thumbnail': '.field-type-image .field-item img @src'
        })
        .follow('a @href')
        .set({
            'text': '.field-type-text-with-summary .field-item',
            'img': '.field-type-image img @src'
        })
        .data(function(data) {
            if (Object.keys(data).length > 0) {
                data.link = "http://www.fi.uba.ar" + data.link;
                events.push(data);
            }
        })
        .error(function(msg) {Logger.error(msg);})
        .debug(function(msg) {Logger.debug(msg);})
        .done(function() {
            console.log(events);
            me.finish(events);
        });
    }

    validateResults() {
        // TODO implement
        Logger.debug("MOCK: ASSERT SANITY OK");
        return true;
    }
}

module.exports = NewsScrapper;

var test = new NewsScrapper();
test.run();
