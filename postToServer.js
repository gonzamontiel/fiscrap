var config = require('config');
var request = require('request');
var jsonfile = require('jsonfile');
var fs = require('fs');
var Logger = require("./Logger.js");

const FILES_PATH = __dirname + "/scrapping/out/";

var excludes = ".old";
var inputs = {
    "events": "Calendar.json",
    "exams": /ExamDates.*\.json/,
    "news": "News.json"
    // "courses": "Course_courses.json",
    // "departments": "Course_departments.json",
};

/*
* We should be making POST to urls such us:
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
                    url: "http://localhost:3030/api/load/" + collecionName,
                    method: 'POST',
                    json: true,
                    body: data
                },
                ressponse_callback
            );
        }
    });
}

function ressponse_callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        Logger.info(body);
    } else {
        console.log(error);
    }
}
