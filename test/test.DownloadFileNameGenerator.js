var should = require('should');
var generator = require('../lib/core/DownloadFileNameGenerator');

describe('DownloadFileNameGenerator class', function() {

	it('should be a function', function() {
		generator.should.be.a('function');
	});
	var properties = ['name', 'fullName', 'extension'];

	it('should have properties: ' + properties.join(', '), function() {

		var fileName = new generator({});
		fileName.should.have.keys(properties);
		fileName.name.should.equal('download');
		fileName.extension.should.equal('');
		fileName.fullName.should.equal('download');

	});

	it('should return proper name', function() {

		var fileName = new generator({
			url: "http://r4---sn-gxap5ojx-cvhe.c.youtube.com/videoplayback?itag=37&key=yt1&ip=59.95.162.77&newshard=yes&ipbits=8&ratebypass=yes&ms=au&fexp=934400%2C914501%2C905611%2C910100%2C932402%2C927824%2C916626%2C930901%2C924605%2C901208%2C929123%2C929915%2C929906%2C925714%2C929119%2C931202%2C932802%2C928017%2C912518%2C911416%2C906906%2C904476%2C930807%2C919373%2C906836%2C933701%2C900345%2C912711%2C929606%2C910075&source=youtube&sver=3&mt=1368869307&id=0e6829bb77915435&cp=U0hVTVhUT19NT0NONV9QTlNHOldrX3B0YlkyQXo3&expire=1368891685&sparams=cp%2Cid%2Cip%2Cipbits%2Citag%2Cratebypass%2Csource%2Cupn%2Cexpire&mv=m&upn=Xe0hTV16esU&signature=3982D9AAEB3ED1DAE0D2AF7C171FDFEBE8811E31.28EFB3EA4BA97AB55BD2C6BA4B4B79A7949ED0DF&title=Tum%20Hi%20Ho%20Aashiqui%202%20Full%20Song%201080p%20HD%20(2013)",
			mime: 'video/x-flv'
		});

		fileName.name.should.equal("Tum Hi Ho Aashiqui 2 Full Song 1080p HD (2013)");
		fileName.extension.should.equal(".flv");
		fileName.fullName.should.equal("Tum Hi Ho Aashiqui 2 Full Song 1080p HD (2013).flv");
	});


});