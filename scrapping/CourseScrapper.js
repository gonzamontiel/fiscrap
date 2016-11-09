var osmosis = require('osmosis');
var jsonfile = require('jsonfile');
var parsing = require('./parsing.js');
var Scrapper = require('./Scrapper.js');
var Logger = require('../Logger.js');

class CourseScrapper extends Scrapper {
    getFileName() {
        return __filename
            .replace(__dirname, '')
            .replace("Scrapper.js", "");
    }

    run() {
        var me = this;
        var collection = [];
        osmosis
        .get('http://www.fi.uba.ar/es/node/31')
        .find('#block-menu-block-2 .menu__item')
        .set('name', 'a.menu__link')
        .follow('a.menu__link')
        .set({
            'info': {
                'contacto': '.field-item p:first',
                'mailto': '.field-item p:first a',
                'autoridades': '.field-item p:nth-child(2)',
                'CA-docentes': '.field-item p:nth-child(4)',
                'CA-auxiliares': '.field-item p:nth-child(3)',
                'CA-graduados': '.field-item p:nth-child(5)',
                'CA-alumnos': '.field-item p:nth-child(6)'
            }
        })
        .find('#block-menu-block-2 .menu__item.first')
        .follow('a')
        .then(function(context, data) {
            var string = context.querySelector('div.field-item').innerHTML;
            string = parsing.removeHtmlChars(string);
            string = parsing.removeEmptyLines(string);
            var splitted = string.split('\n');
            data.courses = splitted.map(
                function(course) {
                    return parsing.parseCourse(course);
                }
            );
        })
        .data(function(data) {
            collection.push(data);
        })
        .error(function(msg) {Logger.error(msg);})
        .debug(function(msg) {Logger.debug(msg);})
        .done(function() {
            me.finish(collection);
        });
    }

    validateResults() {
        // TODO implement
        Logger.debug("MOCK: ASSERT SANITY OK");
        return true;
    }
}

module.exports = CourseScrapper;

// var test = new CourseScrapper();
// test.run();
