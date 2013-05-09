var _options = {
	packageFile: './bin/app.nw',
	applicationPath: './bin/mt-downloader.app/Contents/Resources'

};
var _config = {
	release: {
		options: {
			//bump: false, //default: true
			//file: 'component.json', //default: package.json
			//add: false, //default: true
			//commit: false, //default: true
			//tag: false, //default: true
			//push: false, //default: true
			//pushTags: false, //default: true
			//npm: false, //default: true
			//tagName: 'some-tag-<%= version %>', //default: '<%= version %>'
			//commitMessage: 'check out my release <%= version %>', //default: 'release <%= version %>'
			//tagMessage: 'tagging version <%= version %>' //default: 'Version <%= version %>'
		}
	},
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
	},
	nodeunit: {
		all: ['test'],
		core: ['test/core.js'],
		threads: ['test/threads.js'],
		youtube: ['test/youtube.js']
	}
};

module.exports = function(grunt) {
	grunt.initConfig(_config);
	//grunt.loadNpmTasks('grunt-zip');
	grunt.loadNpmTasks('grunt-release');
	//grunt.loadNpmTasks('grunt-contrib-copy');
	//grunt.loadNpmTasks('grunt-contrib-watch');
	//grunt.loadNpmTasks('grunt-contrib-nodeunit');
	grunt.registerTask('default', ['zip:createPackage', 'copy:copyPackage']);
};