var osmosis = require('osmosis');
var jsonfile = require('jsonfile')
var parsing = require('./parsing.js');
var file = 'assignatures.json'

jsonfile.writeFile(file, '')

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
    data.asignaturas = splitted.map(
        function(asignatura) {
            return parsing.parseAssignature(asignatura);
        }
    );
})
.data(function(data) {
    jsonfile.writeFile(file, data, {spaces: 2, flag: 'a'}, function(err) {
        if (err) throw err
    })
})
.error(console.log)
.debug(console.log)
