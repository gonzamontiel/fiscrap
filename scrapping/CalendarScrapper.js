var parsing = require('./parsing.js');
var osmosis = require('osmosis');
var jsonfile = require('jsonfile');
var Scrapper = require('./Scrapper.js');
var Sync = require('../Sync.js');
var fs = require('fs');
var Logger = require('../Logger.js');

class CalendarScrapper extends Scrapper {
    run(callback) {
        // Scraps event dates of the current month
        var today = new Date();
        var month = this.padding(today.getMonth() + 1, 2);
        var year = today.getFullYear();
        var isoString = year + "-" + month  + "-";
        this.daysOfMonth = this.monthDays(today);
        // Parse all events of month by date
        this.dateEvents = [];
        this.processedDays = 1;
        for (var i = 1; i <= this.daysOfMonth; i++) {
            this.parseDayEvents(isoString + this.padding(i, 2));
        }
    }

    validateResults() {
        // TODO implement
        Logger.debug("MOCK: ASSERT SANITY OK");
        return true;
    }

    onEachDateDone(dateString) {
        Logger.info("Done parsing events of " + dateString);
        this.processedDays++;
        if (this.processedDays === this.daysOfMonth) {
            this.finish(this.dateEvents);
        }
    }

    monthDays(date) {
        var d = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        return d.getDate();
    }

    padding(string, n) {
        return ("0".repeat(n-1) + string).slice(-n);
    }

    parseDayEvents(dateString) {
        var me = this;
        osmosis
        .get('http://www.fi.uba.ar/es/calendar-node-field-date/day/' + dateString)
        .find('.calendar .inner .item')
        .set({
            'title': '.dayview .contents a',
            'start': '.date-display-start',
            'end': '.date-display-end',
            'extra': osmosis
                .follow('.dayview .contents a')
                .set(
                    {
                        'image': '.field-type-image img @src',
                        'info': '.field-type-text-with-summary div.field-item.even'
                    }
                )
        })
        .data(function(data)
        {
            data.parsedDate = dateString;
            me.dateEvents.push(data);
        })
        .done(function(){
            me.onEachDateDone(dateString);
        })
        .error(function(msg) {Logger.error(msg);})
        .debug(function(msg) {Logger.debug(msg);});
    }

    getFileName() {
        return __filename
            .replace(__dirname, '')
            .replace("Scrapper.js", "");
    }
}

module.exports = CalendarScrapper;

// testing
var c = new CalendarScrapper();
c.run();
