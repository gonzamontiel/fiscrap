var osmosis = require('osmosis');
var cheerio = require('cheerio');
var jsonfile = require('jsonfile');
var parsing = require('./parsing.js');
var Logger = require('../Logger.js');
var Scrapper = require('./Scrapper.js');
var request = require('request');
var source = __dirname + '/ExamDatesSource.json';

const MAIN_URL = 'http://guaranigrado.fi.uba.ar/autogestion/';
const POST_URL = 'http://guaranigrado.fi.uba.ar/autogestion/a_general/fechasExamen.php?qs=asdasd';
const REFERRER_URL = 'http://guaranigrado.fi.uba.ar/autogestion/a_general/elegirTurnoCarrera.php?qs=5820a1e82cb2d0.66080101';

class ExamDatesScrapper extends Scrapper {
    constructor() {
        super();
        this.cookie = null;
    }

    run() {
        var me = this;
        if (!this.cookie) {
            Logger.info('Obtaining new cookie...');
            request(
                MAIN_URL,
                function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        me.cookie = me.extractCookie(response);
                        me.postToAll();
                        Logger.info('I have the cookie! ' + me.cookie);
                    } else {
                        throw error;
                    }
                }
            );
        } else {
            Logger.info('I\'m using an existing cookie! ' + this.cookie);
            this.postToAll();
        }
    }

    postToAll() {
        var plans = jsonfile.readFileSync(source);
        for (var i = 0; i < plans.length; i++) {
            this.makePost(plans[i].name, plans[i].option);
        }
    }

    extractCookie(response) {
        var cookies = response.headers['set-cookie'];
        var matchingCookies = cookies.filter(function(el) {
            return el.match(/PHPSESSID=[^\s;]+$/);
        });
        return matchingCookies[0];
    }

    getTurnByDate() {
        var turns = ["JULIO-AGOSTO", "DICIEMBRE-FEBRERO"];
        return turns[(new Date()).getMonth() <= 8 ? 0 : 1];
    }

    makePost(planName, option) {
        var turn = this.getTurnByDate(),
        me = this,
        postData = {
            'anio_academico': (new Date()).getFullYear(),
            'turno_examen': turn,
            'carrera': option
        };
        Logger.info("START: " + planName + " on period: " + turn);
        request.post(
            {
                url: POST_URL,
                headers: this.getHeadersData(this.cookie),
                formData: postData
            },
            function(err, httpResponse, body) {
                if (err) {
                    return Logger.error('post failed:', err);
                }
                if (body) {
                    me.scrap(body, planName, turn);
                } else {
                    Logger.error("Could not fetch data from server");
                }
            });
        }

        getHeadersData(cookie) {
            return {
                'Cookie': cookie,
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
        }

        escape(name) {
            return name.replace(/[^a-zA-Z0-9ñáéíóúÁÉÍÓÚ]+/g, '');
        }

        getFileName() {
            return __filename
            .replace(__dirname, '')
            .replace("Scrapper.js", "");
        }

        validateResults() {
            // TODO implement
            Logger.debug("MOCK: ASSERT SANITY OK");
            return true;
        }

        scrap(body, planName, turn) {
            let filename = this.getFileName() + '_' + this.escape(planName);
            let $ = cheerio.load(body);
            var examDates = $('body > .detalle').map(
                function(index, element) {
                    var course = $(element).find('.detalle_contenido:icontains("materia") .detalle_resaltado:first-child').text().trim();
                    let courseCode, courseName;
                    course.trim().replace(/\(([^\)]*)\)(.*)$/, function(orig, code, name) {
                        courseCode = code;
                        courseName = name.trim();
                    });
                    var info = {
                        'year': $(element).find('.detalle_contenido:icontains("año") .detalle_resaltado:first-child').text().trim(),
                        'turn': $(element).find('.detalle_contenido:icontains("turno") .detalle_resaltado:first-child').text().trim(),
                        'courseCode': courseCode,
                        'courseName': courseName,
                    };
                    // Locate table at the same position of details
                    var table = $('body > table:nth-of-type('+ (index + 1) + ')');
                    var dates = $(table).find('tr.normal').map(function(idx, row) {
                        return  {
                            name: $(row).find('td:nth-child(1)').text().trim(),
                            date: $(row).find('td:nth-child(2)').text().trim(),
                            type: $(row).find('td:nth-child(3)').text().trim(),
                            inscriptionStartDate: $(row).find('td:nth-child(4)').text().trim(),
                            inscriptionEndDate: $(row).find('td:nth-child(5)').text().trim()
                        };
                    }).get();
                    info.dates = dates;
                    return info;
                });
                this.finish(examDates.get(), filename);
                Logger.info("DONE: " + planName + " on period: " + turn);
            }

            // DEPRECATED Osmosis version
            // scrap(body) {
            //     var datesForPlan = {};
            //     osmosis.parse(body)
            //     .find('.detalle')
            //     .set({
            //         'year': '.detalle_contenido:icontains("año") .detalle_resaltado[1]',
            //         'turn': '.detalle_contenido:icontains("turno") .detalle_resaltado[1]',
            //         'course': '.detalle_contenido:icontains("materia") .detalle_resaltado[1]',
            //         'dates':  [
            //             osmosis
            //             .find(':before(table) table tr.normal')
            //             .set({
            //                 name: 'td[1]',
            //                 date: 'td[2]',
            //                 type: 'td[3]',
            //                 inscriptionStartDate: 'td[4]',
            //                 inscriptionEndDate: 'td[5]'
            //             })
            //         ]
            //     })
            //     .data(function(data){
            //         data.course.trim().replace(/\(([^\)]*)\)(.*)$/, function(orig, code, name) {
            //             data.courseCode = code;
            //             data.courseName = name.trim();
            //         });
            //         delete data.course;
            //     })
            //     .data(function(data){
            //         if (!datesForPlan[data.courseCode]) {
            //             datesForPlan[data.courseCode] = [];
            //         }
            //         datesForPlan[data.courseCode].push(data);
            //     })
            //     .error(function(msg) {Logger.error(msg);})
            //     .debug(function(msg) {Logger.debug(msg);})
            //     .done(function(data) {
            //         Logger.info("DONE: " + planName + " on period: ");
            //         console.log(datesForPlan);
            //         me.finish(datesForPlan, me.getFileName() + '_' + me.escape(planName));
            //     });
            // }
        }

        module.exports = ExamDatesScrapper;

        var test = new ExamDatesScrapper();
        test.run();
