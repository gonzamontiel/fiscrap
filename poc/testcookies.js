var request = require('request');
var osmosis = require('osmosis');
var Logger = require('../Logger.js');

// var COOKIE = "PHPSESSID=qiqmgpjorp1pir4juui61qe7j2";
var COOKIE = null;

const MAIN_URL = 'http://guaranigrado.fi.uba.ar/autogestion/';
const POST_URL = 'http://guaranigrado.fi.uba.ar/autogestion/a_general/fechasExamen.php?qs=asdasd';
const REFERRER_URL = 'http://guaranigrado.fi.uba.ar/autogestion/a_general/elegirTurnoCarrera.php?qs=5820a1e82cb2d0.66080101';

function getTurnByDate() {
    var turns = ["JULIO-AGOSTO","DICIEMBRE-FEBRERO"];
    return turns[(new Date()).getMonth() <= 8 ? 0 : 1];
}

function makePost() {
    var headersData = {
        'Cookie': COOKIE,
        'Origin': 'http://guaranigrado.fi.uba.ar',
        'Accept-Encoding': 'gzip, deflate' ,
        'Accept-Language': 'es-419,es;q=0.8,en-US;q=0.6,en;q=0.4',
        'Upgrade-Insecure-Requests': 1,
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.90 Safari/537.36',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Cache-Control': 'max-age=0',
        'Referer': REFERRER_URL,
        'Connection': 'keep-alive',
    };
    var postData = {
        'anio_academico': (new Date()).getFullYear(),
        'turno_examen': getTurnByDate(),
        'fecha_inicio': "15/08/2016",
        'fecha_fin': "30/11/2016",
        'carrera': '3N'
    };
    Logger.info("Getting contents for period: " + getTurnByDate());
    request.post(
        {
            url: POST_URL,
            headers: headersData,
            formData: postData
        },
        function(err, httpResponse, body) {
            if (err) {
                return Logger.error('post failed:', err);
            }
            if (body) {
                osmosis.parse(body)
                .find('.detalle')
                .set({
                    'year': '.detalle_contenido[1] .detalle_resaltado[1]',
                    'turn': '.detalle_contenido[1] .detalle_resaltado[2]',
                    'course': '.detalle_contenido[2] .detalle_resaltado[1]'
                })
                .find('table')
                .set({
                    'dates':  [
                        osmosis
                        .find('tr.normal')
                        .set({
                            name: 'td[1]',
                            date: 'td[2]',
                            type: 'td[3]',
                            inscriptionStartDate: 'td[4]',
                            inscriptionEndDate: 'td[5]',
                            catedra: 'td[6]'
                        })
                    ]
                })
                .data(function(data){
                    // Transform data a little bit
                    course.trim().replace(/\(([^\)]*)\)(.*)$/, function(orig, code, name) {
                        data.courseCode = code;
                        data.courseName = name.trim();
                    });
                })
                .error(function(msg) {Logger.error(msg);})
                .debug(function(msg) {Logger.debug(msg);});
            } else {
                Logger.error("Could not fetch data from server");
            }
        });
    }

    if (!COOKIE) {
        Logger.info('Obtaining new cookie...');
        request(
            MAIN_URL,
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var cookies = response.headers['set-cookie'];
                    var matchingCookies = cookies.filter(function(el) {
                        return el.match(/PHPSESSID=[^\s;]+$/);
                    });
                    COOKIE = matchingCookies[0];
                    makePost();
                    Logger.info('I have the cookie! ' + COOKIE);
                } else {
                    throw error;
                }
            }
        );
    } else {
        Logger.info('I\'m using an existing cookie! ' + COOKIE);
        makePost();
    }
