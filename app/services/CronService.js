var cron = require('node-schedule');
module.exports = {
    start: function () {
        console.log("fuck");
        var cron = require('node-schedule');
        /* run the job at 18:55:30 on Dec. 14 2018*/
        var date = new Date(2018, 5, 1, 13, 53, 30);
        cron.scheduleJob(date, function () {
            console.log(new Date(), "Somthing important is going to happen today!");
        });

        var rule = new cron.RecurrenceRule();
        rule.second = 30;
        cron.scheduleJob(rule, function () {
            console.log(new Date(), 'The 30th second of the minute.');
        });

        var j = cron.scheduleJob('42 * * * * *', function () {
            console.log('The answer to life, the universe, and everything!');
        });
    }

}
