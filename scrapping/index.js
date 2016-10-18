require('fs').readdirSync(__dirname + '/').forEach(function(file) {
  if (file.match(/\.*Scrapper.js$/) !== null) {
    var name = file.replace('.js', '');
    if (name !== "Scrapper") {
        exports[name] = require('./' + file);
    }
  }
});
