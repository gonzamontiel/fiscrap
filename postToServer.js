var config = require('config');
var request = require('request');
var jsonfile = require('jsonfile');
var input = 'collections/coursesCol.json';

console.log(config.get('server.host'), "host");
console.log(config.get('server.port'), "port");
console.log(config.get('server.api'), "api");

request.post(
    config.server.host,
    jsonfile.readFileSync(input),
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);
        } else {
            console.log(error, "error");
        }
    }
);
