var scrappers = require("./scrapping/");
var postToServer = require("postToServer.js");

for (var i in scrappers) {
    scrapper = new scrappers[i]();
    scrapper.run();
}

postToServer();
