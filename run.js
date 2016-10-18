var scrappers = require("./scrapping/");

console.log(scrappers);

for (var i in scrappers) {
    s = new scrappers[i]();
    s.run();
}
