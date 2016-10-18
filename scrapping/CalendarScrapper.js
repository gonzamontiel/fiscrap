var parsing = require('./parsing.js');
var osmosis = require('osmosis');
var jsonfile = require('jsonfile');
var Scrapper = require('./Scrapper.js');
var fs = require('fs');

class CalendarScrapper extends Scrapper {
    run() {
        // Scraps event dates of the current month
        var today = new Date();
        var month = this.padding(today.getMonth() + 1, 2);
        var year = today.getFullYear();
        var isoString = year + "-" + month  + "-";

        // Parse all events of month by date
        var dateEvents = {};
        for(var i = 1; i <= this.monthDays(today); i++) {
            this.parseDayEvents(isoString + this.padding(i, 2), dateEvents);
        }

        jsonfile.writeFile(
            this.file,
            dateEvents,
            {spaces: 2},
            function(err) {
                if (err) throw err;
            }
        );
    }

    monthDays(date) {
        var d = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        return d.getDate();
    }

    padding(string, n) {
        return ("0".repeat(n-1) + string).slice(-n);
    }

    parseDayEvents(dateString, dateEvents) {
        console.log("Parsing events of " + dateString);
        dateEvents[dateString] = [];

        osmosis
        .get('http://www.fi.uba.ar/es/calendar-node-field-date/day/' + dateString)
        .find('.calendar .inner .item')
        .set({
            'event': {
                'title': '.dayview .contents a',
                'start': '.date-display-start',
                'end': '.date-display-end',
            }
        })
        .follow('.dayview .contents a')
        .then(function(context, data) {
            var string = context.querySelector('div.field-item.even').innerHTML;
            string = parsing.removeHtmlChars(string);
            string = parsing.removeEmptyLines(string);
            data.extraInfo = string;
        })
        .data(function(data)
        {
            console.log(data);
        })
        .error(console.log)
        .debug(console.log)
        .done();
    }

    getFileName() {
        return __filename
            .replace(__dirname, '')
            .replace("Scrapper.js", "");
    }
}

module.exports = CalendarScrapper;
