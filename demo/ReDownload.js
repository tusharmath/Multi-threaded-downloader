var mtd = require('../lib/TaskExecuter');

var options = {
    timeout: 5000,
    onStart: function(meta) {
        console.log('Download Started', meta);
    },
    onData: function(threads) {
        //console.log('Data was written to the file');
    },
    onEnd: function(err, result) {
        if (err) console.error(err);
        console.log('Download Complete');
    },
    //TODO : Implement
    retry: true
};

var file = '/Users/tusharmathur/Desktop/temp/Gadget_the_pug_expressive_eyes.jpg.mtd';
var downloader = new mtd(file, null, options);
downloader.start();