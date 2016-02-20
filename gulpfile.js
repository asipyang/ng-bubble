/* jshint ignore:start */
// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint');
var merge = require('merge-stream');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var stylish = require('jshint-stylish');
var sourcemaps = require('gulp-sourcemaps');
var rename = require("gulp-rename");


// Lint Task
gulp.task('lint', function() {
	'use strict';
	return gulp.src('src/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter(stylish))
		.pipe(jshint.reporter('fail', {
			ignoreWarning: true
		}));
});


// Minify JS
gulp.task('minify', ['lint'], function() {
	'use strict';
	var app = gulp.src('src/*.js')
		.pipe(sourcemaps.init({
			loadMaps: true
		}))
		// .pipe(gulp.dest('./dist'))
		.pipe(ngAnnotate())
		.pipe(uglify())
		.pipe(rename("ng-bubble.min.js"))
		.pipe(sourcemaps.write('./', {
			addComment: true
		}))
		.pipe(gulp.dest('./dist'));

	return app;
});


// Default Task
gulp.task('default', ['minify']);