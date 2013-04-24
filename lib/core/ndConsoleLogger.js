exports.logInline = function(str,color) {
	process.stdout.clearLine(); // clear current text
	process.stdout.cursorTo(0); // move cursor to beginning of line
	process.stdout.write(str.toString()); // write text
};