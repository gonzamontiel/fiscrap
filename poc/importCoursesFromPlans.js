var config = require('config');
var request = require('request');
var jsonfile = require('jsonfile');
var input = 'collections/coursesCol.json';

request.post(
    config.server.host,
    data,
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);
        } else {
            console.log(error, "error");
        }
    }
);
