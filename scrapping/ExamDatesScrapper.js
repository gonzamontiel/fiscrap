var osmosis = require('osmosis');
var jsonfile = require('jsonfile');
var parsing = require('./parsing.js');
var Scrapper = require('./Scrapper.js');

class ExamDatesScrapper extends Scrapper {
    run() {
        jsonfile.writeFile(this.file, '');
        osmosis
        .get('http://guaranigrado.fi.uba.ar/autogestion/inicial.php')
        .then(function(context, data) {
                console.log(context.querySelector('frameset').innerHTML);
        })
        .find('.menuItem li:contains("Fechas de examen")')
        .find('div.detalle div.detalle_contenido:contains("Materia")')
        .set('nombre', 'span.detalle_resaltado')
        .data(function(data) {
            console.log(data);
        })
        .error(console.log)
        .debug(console.log);
    }

    getFileName() {
        return __filename
            .replace(__dirname, '')
            .replace("Scrapper.js", "");
    }
}

module.exports = ExamDatesScrapper;
