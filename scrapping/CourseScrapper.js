var osmosis = require('osmosis');
var jsonfile = require('jsonfile');
var parsing = require('./parsing.js');
var Scrapper = require('./Scrapper.js');

class CourseScrapper extends Scrapper {
    constructor() {
        super();
        this.collection = [];
        this.coursesCollection = [];
        this.departmentsCollection = [];
    }

    getFileName() {
        return __filename
            .replace(__dirname, '')
            .replace("Scrapper.js", "");
    }

    run() {
        var me = this;
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
            me.collection.push(data);
        })
        .error(console.log)
        .debug(console.log)
        .done(function() {
            jsonfile.writeFile(me.file, me.collection, {spaces: 2}, function(err) {
                if (err) throw err;
            });
        });
    }
}

// var test = new CourseScrapper();
// test.run();

module.exports =  CourseScrapper;
