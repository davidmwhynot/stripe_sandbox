/*

	Title: scrubsql.js
	desc: Gulp plugin that scrubs comments from .sql source files
	Author: David Whynot
	Email: davidmwhynot@gmail.com
	Project: meta
	Updated: 9/25/18

*/


/* XXX IMPORTS XXX */
const through = require('through2');
const strip = require('sql-strip-comments');


/* XXX EXPORTS XXX */
module.exports = () => {
	return through.obj((vinylFile, encoding, callback) => {
		let transformedFile = vinylFile.clone();
		transformedFile.contents = new Buffer("" + strip(transformedFile.contents.toString('utf8')));
		callback(null, transformedFile);
	});
}
