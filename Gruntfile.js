var _options = {
	packageFile: './bin/app.nw',
	applicationPath: './bin/mt-downloader.app/Contents/Resources'

};
var _config = {
	zip: {
		createPackage: {
			src: ['./node_modules',
				'./ui/*',
				'./lib',
				'Package.json'],
			dest: _options.packageFile
		}
	},
	copy: {
		copyPackage: {
			files: [{
				src: [_options.packageFile],
				//dest:'/Users/tusharmathur/Desktop/Temp/node-webkit-v0.5.0-osx-ia32/node-webkit.app/Contents/Resources',
				dest: _options.applicationPath,
				filter: 'isFile',
				expand: true,
				flatten: true
			}]
		}
	}
};

module.exports = function(grunt) {
	grunt.initConfig(_config);
	grunt.loadNpmTasks('grunt-zip');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('default', ['zip:createPackage', 'copy:copyPackage']);
};