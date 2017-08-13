var osmosis = require('osmosis');
var cheerio = require('cheerio');
var Logger = require('./Logger.js');
var jsonfile = require('jsonfile');
var fs = require('fs');

let body = fs.readFileSync('./examDatesSample.html');
let outputHtml = "";
let $ = cheerio.load(body);

$('body > table').each(function(index, table) {
    var detalle = $('body > .detalle:nth-of-type('+ (index + 1) + ')');
    var newElement = $(detalle).clone().append(table);
    outputHtml += '<div class="detalle">'+newElement.html()+'</div>';
});

console.log(outputHtml);

var datesForPlan = [];
osmosis.parse(outputHtml)
.find('.detalle')
.set({
    'year': '.detalle_contenido:icontains("año") .detalle_resaltado[1]',
    'turn': '.detalle_contenido:icontains("turno") .detalle_resaltado[1]',
    'course': '.detalle_contenido:icontains("materia") .detalle_resaltado[1]',
    'dates':  [
        osmosis
        .find('table tr.normal')
        .set({
            name: 'td[1]',
            date: 'td[2]',
            type: 'td[3]',
            inscriptionStartDate: 'td[4]',
            inscriptionEndDate: 'td[5]'
        })
    ]
})
.data(function(data){
    data.course.trim().replace(/\(([^\)]*)\)(.*)$/, function(orig, code, name) {
        data.courseCode = code;
        data.courseName = name.trim();
    });
    delete data.course;
})
.data(function(data){
    datesForPlan.push(data);
})
.error(function(msg) {Logger.error(msg);})
.debug(function(msg) {Logger.debug(msg);})
.done(function(data) {
    console.log(datesForPlan);
    jsonfile.writeFileSync('./osmosisTestResults.json', datesForPlan, {flag: 'w+', spaces: 2});
});
