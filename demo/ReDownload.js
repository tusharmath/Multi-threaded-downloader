var mtd = require('../lib/TaskExecuter');

var options = {

    onStart: function(meta) {
        console.log('Download Started', meta);
    },
    onEnd: function(err, result) {
        if (err) console.error(err);
        console.log('Download Complete');
    }
};

var file = '/Users/tusharmathur/Desktop/temp/Gadget_the_pug_expressive_eyes.jpg.mtd';

var downloader = new mtd(file, null, options);
downloader.start();