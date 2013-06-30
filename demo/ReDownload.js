var mtd = require('../lib/TaskExecuter');

var file = '/Users/tusharmathur/Desktop/temp/Thyme-0.4.2.dmg.mtd';
var downloader = new mtd(file);
downloader.start();