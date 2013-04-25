var core = require('../lib/core');


var options = {
	path: './test/Carbuyer.mp4',
	url: 'http://r9---sn-cvh7sn7s.c.youtube.com/videoplayback?expire=1366897416&upn=B2D0rdoYr_Y&ipbits=8&ms=nxu&fexp=914501%2C905611%2C910100%2C932402%2C927824%2C916626%2C930901%2C911931%2C932000%2C932004%2C906383%2C904479%2C902000%2C901208%2C929903%2C925714%2C929119%2C931202%2C900821%2C900823%2C912518%2C911416%2C904476%2C908529%2C904830%2C930807%2C919373%2C930803%2C906836%2C929602%2C930101%2C900824%2C912711%2C910075&mv=m&key=yt1&itag=5&source=youtube&sparams=algorithm%2Cburst%2Ccp%2Cfactor%2Cid%2Cip%2Cipbits%2Citag%2Csource%2Cupn%2Cexpire&burst=40&mt=1366874529&newshard=yes&ip=123.236.41.61&cp=U0hVS1hUVV9GUENONV9QTllFOlhrX3ByYlk4WXM4&sver=3&factor=1.25&algorithm=throttle-factor&id=b1ec7c6bc4e22d2e&signature=6756E7C178AF5B809BBDC21F53295ADDAA126970.A76E3718299DBEBD569965AE1ED94FEFE6C370D6&title=Peugeot%20308%202013%20review%20-%20CarBuyer&redirect_counter=1&cms_redirect=yes',
	threadCount: 6,
	increasing: true
};
var downloader = new core(options);
downloader.download();