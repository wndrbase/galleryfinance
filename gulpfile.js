'use strict';

const gulp             = require('gulp');
const postcss          = require('gulp-postcss');
const autoprefixer     = require("autoprefixer");
const csso             = require("gulp-csso");
const browserReporter  = require('postcss-browser-reporter');

const mqpacker         = require("css-mqpacker");
const precss           = require("precss");
const sourcemaps       = require('gulp-sourcemaps');

const nunjucksRender   = require('gulp-nunjucks-render');

const rename           = require('gulp-rename');

const plumber          = require('gulp-plumber');
const server           = require('browser-sync').create();
const ftp              = require('gulp-ftp');
const replace          = require('gulp-replace');
const filter           = require('gulp-filter');

const del              = require('del');

const newer            = require('gulp-newer');

const debug            = require('gulp-debug');

const w3cjs            = require('gulp-w3cjs');

let config             = null;

const site             = 'Gallery Finance';
const domain           = 'gf.wndrbase.com';

try {

	config           = require('./config.json');

	config.ftp.remotePath += domain;


}catch(e){

	console.log("config the file doesn't exists");

}

gulp.task('html', function() {

	return gulp.src('src/**/index.html', {since: gulp.lastRun('html')})
		.pipe(plumber())
		.pipe(debug({title: 'html:'}))
		.pipe(nunjucksRender({
			data: {
				url: 'http://' + domain,
				site: site
			},
			path: 'src/'
		}))
		.pipe(w3cjs({
			verifyMessage: function(type, message) {

				// prevent logging error message
				if(message.indexOf('Attribute “loading” not allowed on element “img” at this point.') === 0) return false;

				if(message.indexOf('iframe') !== -1) return false;

				// allow message to pass through
				return true;
			}
		}))
		.pipe(w3cjs.reporter())
		.pipe(gulp.dest('build'))

});

gulp.task('html-touch', function() {

	return gulp.src('src/**/index.html')
		.pipe(plumber())
		.pipe(debug({title: 'html:'}))
		.pipe(nunjucksRender({
			data: {
				url: 'http://' + domain,
				site: site
			},
			path: 'src/'
		}))
		.pipe(w3cjs({
			verifyMessage: function(type, message) {

				// prevent logging error message
				if(message.indexOf('Attribute “loading” not allowed on element “img” at this point.') === 0) return false;

				if(message.indexOf('iframe') !== -1) return false;

				// allow message to pass through
				return true;
			}
		}))
		.pipe(w3cjs.reporter())
		.pipe(gulp.dest('build'))

});

gulp.task('css', function () {

	return gulp.src('src/css/style.css')
			.pipe(plumber())
			.pipe(sourcemaps.init())
			.pipe(postcss([
				precss(),
				mqpacker(),
				browserReporter()
			]))
			.pipe(sourcemaps.write())
			.pipe(rename('styles.css'))
			.pipe(gulp.dest('build/css'))
			.pipe(postcss([
				autoprefixer({
					browsers: 'Android >= 5'
				})
			]))
			.pipe(csso())
			.pipe(rename({suffix: ".min"}))
			.pipe(gulp.dest('build/css'))

});

gulp.task('serve', function() {

	server.init({
		server: 'build',
		files: [
			{
				match: ['build/**/*.*', '!build/**/*.min.{css}'],
				fn: function (event, file) {
					this.reload()
				}
			}
		]
	});

});


gulp.task('clear', function() {

	return del('build');

});

gulp.task('copy', function() {

	return gulp.src(['src/**/*.*', '!src/**/*.{css,html}'], {since: gulp.lastRun('copy')})
			.pipe(debug({title: 'copy:'}))
			.pipe(newer('build'))
			.pipe(debug({title: 'copy:newer'}))
			.pipe(gulp.dest('build'))

});

gulp.task('ftp', function () {

	if(!config) {

		return true;

	}

	const f = filter('**/*.html', {restore: true});

	return gulp.src('build/**/*', {since: gulp.lastRun('ftp')})
		.pipe(debug({title: 'ftp:'}))
		.pipe(f)
		.pipe(replace('css/styles.css', 'css/styles.min.css?' + Date.now()))
		.pipe(f.restore)
		.pipe(ftp(config.ftp));

});

gulp.task('watch', function() {
	gulp.watch(['src/css/*.*','!src/css/styles.min.css'], gulp.series('css'));
	gulp.watch('src/**/index.html', gulp.series('html'));
	gulp.watch(['src/**/*.html','!src/**/index.html'], gulp.series('html-touch'));
	gulp.watch(['src/**/*.*', '!src/**/*.{css,html}'], gulp.series('copy'));
	gulp.watch('build/**/*.*', gulp.series('ftp'));
});

gulp.task('default', gulp.series(
	'clear',
	'css',
	'html',
	'copy',
	gulp.parallel('ftp','watch','serve')
	));