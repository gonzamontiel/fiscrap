var scrappers = require("./scrapping/");

for (var i in scrappers) {
    scrapper = new scrappers[i]();
    scrapper.run();
}
