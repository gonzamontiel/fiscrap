var config = require('config');
var request = require('request');
var jsonfile = require('jsonfile');
var fs = require('fs');
var Logger = require("./Logger.js");

var host =  config.get('server.host');
var port = config.get('server.port');
var serverUrl = host + ':' + port;
var apiBasePath = config.get('server.api');

const FILES_PATH = __dirname + "/scrapping/out/";

function ressponse_callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        Logger.info(body);
    } else {
        console.log(error);
    }
}

module.exports = function() {
    var excludes = ".old";
    var inputs = {
        "events": "Calendar.json",
        "news": "News.json",
        "exams": /ExamDates.*\.json/
    };

    /*
    * We are making POST to urls such us:
    * server/api/load/courses
    *
    */
    for (var collecionName in inputs) {
        var fileRegexp = inputs[collecionName];
        fs.readdirSync(FILES_PATH).forEach(function(file) {
            if (file.match(fileRegexp) !== null && !file.match(excludes)) {
                var data = jsonfile.readFileSync(FILES_PATH + file);
                console.log("Posting " + file);
                request(
                    {
                        url: "http://" + serverUrl + apiBasePath + collecionName,
                        method: 'POST',
                        json: true,
                        body: data
                    },
                    ressponse_callback
                );
            }
        });
    }
}

doPost = module.exports;
doPost();
