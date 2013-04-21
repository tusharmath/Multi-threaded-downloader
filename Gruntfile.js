var _config = {
	zip: {
		createPackage: {
			src: ['./node_modules',
				'./ui/*',
				'./lib',
				'Package.json'],
			dest: './bin/mt-downloader.nw'
		}
	}

};


module.exports = function(grunt) {
	grunt.initConfig(_config);
	grunt.loadNpmTasks('grunt-zip');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('default', ['zip:createPackage']);
};