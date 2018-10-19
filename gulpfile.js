/*

	title: gulpfile.js
	desc: Gulp task definitions
	author: David Whynot
	email: davidmwhynot@gmail.com
	Project: stripe_sandbox
	Created: 10/19/18
	Updated: 10/19/18

*/


/* XXX IMPORTS XXX */
// vendor
const browserSync = require('browser-sync');
const nodemon = require('gulp-nodemon');

const gulp = require('gulp');

const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');

// const babel = require('gulp-babel');
// const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const inject = require('gulp-inject');
const injectString = require('gulp-inject-string');

const gzip = require('gulp-gzip');
const gunzip = require('gulp-gunzip');

const tar = require('gulp-tar');
const untar = require('gulp-untar');

const del = require('del');


const puppeteer = require('puppeteer');

// self
const scrubsql = require('./build/scrubsql');




/* XXX CONFIG XXX */
require('dotenv').config();
const DB = {
	database: process.env.STRIPESANDBOX_DB_DATABASE,
	host: process.env.STRIPESANDBOX_DB_HOST,
	user: process.env.STRIPESANDBOX_DB_USER,
	password: process.env.STRIPESANDBOX_DB_PASSWORD,
	configUser: process.env.STRIPESANDBOX_MYSQL_USER,
	configPassword: process.env.STRIPESANDBOX_MYSQL_PASSWORD
}
const AREA = process.env.STRIPESANDBOX_AREA;
const AUTOPREFIXER_BROWSERS = [
	'> 1%',
	'last 2 versions'
];




/* XXX DEV TASKS XXX */

	// setup
		gulp.task('setup_dev', (done) => {
			// TODO: basically the same as 'setup_prod', except for dev environment

			// setup environment variables FIXME: does not save after gulp exits for production
			// require('dotenv').config();

			done();
		});

	// html
		// gulp.task('html', () => { TODO: find out if any gulp modules help with pug template preprocessing
		// 	return gulp.src('./src/public/*.html')
		// 		.pipe(gulp.dest('./dist/pub'));
		// });

	// sql
		gulp.task('db', () => {
			if(AREA == 'dev') {
				gulp.src('./src/db/_config.sql')
					.pipe(inject(
						gulp.src('./src/db/schemas/*.sql', {read: false}), {
							starttag: '-- INJECT TABLES --',
							endtag: '-- ENDINJECT --',
							removeTags: true,
							transform: (fp) => {
								return `source schemas/${fp.match(/(?<=\/)\w*\.sql$/g)[0]};`;
							}
						}
					))
					.pipe(injectString.replace('{{{DATABASE}}}', DB.database))
					.pipe(injectString.replace('{{{USER}}}', DB.user))
					.pipe(injectString.replace('{{{HOST}}}', DB.host))
					.pipe(injectString.replace('{{{PASSWORD}}}', DB.password))
					.pipe(scrubsql())
					.pipe(gulp.dest('./dist/db'));
			} else {
				gulp.src('./src/db/_config.sql')
					.pipe(inject(
						gulp.src('./src/db/schemas/*.sql', {read: false}), {
							starttag: '-- INJECT TABLES --',
							endtag: '-- ENDINJECT --',
							removeTags: true,
							transform: (fp) => {
								return `source schemas/${fp.match(/(?<=\/)\w*\.sql$/g)[0]};`;
							}
						}
					))
					.pipe(injectString.replace('{{{DATABASE}}}', DB.database))
					.pipe(injectString.replace('{{{USER}}}', DB.user))
					.pipe(injectString.replace('{{{HOST}}}', DB.host))
					.pipe(injectString.replace('{{{PASSWORD}}}', DB.password))
					.pipe(scrubsql())
					.pipe(gulp.dest('./dist/db'));
				gulp.src('./src/db/.config')
					.pipe(injectString.replace('{{{user}}}', DB.configUser))
					.pipe(injectString.replace('{{{password}}}', DB.configPassword))
					.pipe(gulp.dest('./dist/db'));
			}
			return gulp.src('./src/db/schemas/*.sql')
				.pipe(scrubsql())
				.pipe(gulp.dest('./dist/db/schemas'));
		});

	// js
		gulp.task('scripts', () => {
			return gulp.src('./src/public/js/*.js')
				.pipe(concat('main.js'))
				// .pipe(babel({ FIXME
				// 	presets: ['env']
				// }))
				// .pipe(uglify())
				.pipe(gulp.dest('./dist/pub/js'));
		});

	// sass
		gulp.task('sass', () => {
			return gulp.src('./src/public/sass/*.scss')
				.pipe(sass().on('error', sass.logError))
				.pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
				.pipe(gulp.dest('./dist/pub/css'));
		});

	// media
		gulp.task('media_del', media_del);

		gulp.task('media_move_src', media_move_src);
		gulp.task('media_move_dist', media_move_dist);

		gulp.task('media_pack', media_pack);
		gulp.task('media_unpack', media_unpack);

		gulp.task('media_compress', media_compress);
		gulp.task('media_decompress', media_decompress);

		function media_del() {
			return del(['media'], {force: true});
		}

		function media_move_src() {
			return gulp.src('media/**/*', {allowEmpty: true})
				.pipe(gulp.dest('./src/public/media/'));
		}
		function media_move_dist() {
			return gulp.src('media/**/*', {allowEmpty: true})
				.pipe(gulp.dest('./dist/pub/media/'));
		}

		function media_pack() {
			return gulp.src('./src/public/media/**/*')
				.pipe(tar('media.tar'))
				.pipe(gulp.dest('.'));
		}
		function media_unpack() {
			return gulp.src('media.tar')
				.pipe(untar())
				.pipe(gulp.dest('media'));
		}

		function media_compress() {
			return gulp.src('media.tar')
				.pipe(gzip())
				.pipe(gulp.dest('.'));
		}
		function media_decompress() {
			return gulp.src('media.tar.gz')
				.pipe(gunzip())
				.pipe(gulp.dest('.'));
		}


/* XXX COMBOS XXX */
	// media TODO
		var media_move_src_del = gulp.series(media_move_src, media_del);
		var media_move_dist_del = gulp.series(media_move_dist, media_del);

		var media_deflate = gulp.series(media_pack, media_compress);
		var media_inflate = gulp.series(media_decompress, media_unpack);

		// gulp.task('media', gulp.series(media_deflate, media_inflate, media_move_dist_del)); TODO: FIXME "Received non-Vinly object in 'dest()'" BUG
		gulp.task('media', () => {
			return gulp.src('./src/public/media/**/*')
				.pipe(gulp.dest('./dist/pub/media/'));
		});
		gulp.task('media_fast', gulp.series(media_pack, media_unpack, media_move_dist_del));
		gulp.task('media_setup', gulp.series(media_inflate, media_move_src_del));

		gulp.task('media_move_src_del', media_move_src_del);
		gulp.task('media_move_dist_del', media_move_dist_del);

		gulp.task('media_deflate', media_deflate);
		gulp.task('media_inflate', media_inflate);

	// default
		// gulp.task('default', gulp.series('db', 'scripts', 'sass', 'media', 'html')); TODO

		// gulp.task('watch', () => { TODO
		// 	gulp.watch('./src/public/db/*.sql', ['db']);
		// 	gulp.watch('./src/public/js/*.js', ['scripts']);
		// 	gulp.watch('./src/public/sass/**/*.scss', ['sass']);
		// 	gulp.watch('./src/public/*.html', ['html']);
		// });

	// front
		gulp.task('front', gulp.series('scripts', 'sass'));

		gulp.task('watch_front', () => {
			gulp.watch('./src/public/js/*.js', gulp.series('scripts'));
			gulp.watch('./src/public/sass/**/*.scss', gulp.series('sass'));
		});


/* XXX DEPLOY TASKS XXX */
// setup tasks
gulp.task('setup_prod', gulp.series('front', 'media', 'db', (done) => {
	// TODO: run this gulp task to setup environment variables based on the 'secrets.json' file
	// should also create database and tables
	// basically perform all tasks necessary to deploy the app to a production environment

	// setup environment variables FIXME: does not save after gulp exits for production
	// require('dotenv').config();

	done();
}));


// other
gulp.task('nodemon', (cb) => {

	var started = false;

	return nodemon({
		script: './app.js',
		watch: ['./app.js', './src/routes/*.*', './src/db/models/*.*']
	}).on('start', function () {
		// to avoid nodemon being started multiple times
		// thanks @matthisk
		if (!started) {
			cb();
			started = true;
		}
	});
});

gulp.task('browsersync', (done) => {
	console.log('browsersync init...');
	browserSync.init(null, {
		proxy: 'http://localhost:5000',
		files: ['./src/public/**/*.*', './src/views/**/*.*'],
		port: 7000
	});
	done();
});

gulp.task('app', gulp.series('nodemon', 'browsersync'));

gulp.task('default', gulp.series('app', () => {
	gulp.watch('./src/public/**/*.*', gulp.series('front'));
	gulp.watch('./app.js', gulp.series('front'));
	gulp.watch('./src/routes/*.*', gulp.series('front'));
}));




/* XXX FUNCTIONS XXX */
function error(e) {
	console.error(e);
	throw e;
}

function log(s) {
	console.log(s);
}
