var _options = {
	packageFile: './bin/mt-downloader.app/Contents/Resources/app.nw'
};

var _config = {
	zip: {
		createPackage: {
			src: ['./node_modules',
				'./ui/*',
				'./lib',
				'Package.json'],
			dest: _options.applicationPath
		}
	}
};

module.exports = function(grunt) {
	grunt.initConfig(_config);
	grunt.loadNpmTasks('grunt-zip');
	//grunt.loadNpmTasks('grunt-contrib-copy');
	//grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('default', ['zip:createPackage']);
};