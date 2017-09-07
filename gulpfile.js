'use strict';

var gulp = require('gulp'),
	jade = require('gulp-jade'),
	sass = require('gulp-sass'),
	livereload = require('gulp-livereload'),
	autoprefixer = require('gulp-autoprefixer'),
	imagemin = require('gulp-imagemin'),
	uglify = require('gulp-uglify'),
	minifycss = require('gulp-minify-css'),
	rename = require('gulp-rename'),
	data = require('gulp-data'),
	concat = require('gulp-concat'),
	connect = require('gulp-connect');

gulp.task('connect', function() {
	connect.server({
		root: './build/',
		livereload: true
	});
});

gulp.task('sass', function() {
	gulp.src(['./dev/scss/**/*.scss','!./dev/scss/**/_*.scss'])
		.pipe(sass().on('error', sass.logError))
		.pipe(rename({suffix: '.min', prefix : ''}))
		.pipe(autoprefixer({browsers: ['last 15 versions'], cascade: false}))
		.pipe(minifycss())
		.pipe(gulp.dest('./build/css/'))
		.pipe(connect.reload());
});

gulp.task('jade', function() {
	gulp.src(['./dev/jade/**/*.jade', '!./dev/jade/**/_*.jade'])
		.pipe(data(function (file) {
			return {
				relativePath: file.history[0].replace(file.base, '')
			};
		}))
		.pipe(jade({
			pretty: true
		})) 
		.on('error', console.log)
		.pipe(gulp.dest('./build/'))
		.pipe(connect.reload());
});

gulp.task('js', function() {
	gulp.src(['./dev/js/**/*.js', '!./dev/js/**/_*.js'])
		.pipe(concat('script.js'))
		.pipe(gulp.dest('./build/js'))
		.pipe(connect.reload());
});

gulp.task('images', function() {
	gulp.src('./dev/img/**/*')
		.pipe(imagemin())
		.pipe(gulp.dest('./build/img'))
});

gulp.task('fonts', function() {
	gulp.src('./dev/fonts/**/*')
		.pipe(gulp.dest('./build/fonts'))
});

gulp.task('watch', function() {
	gulp.watch('dev/scss/**/*.scss', ['sass']);
	gulp.watch('dev/jade/**/*.jade', ['jade']);
	gulp.watch('dev/js/**/*.js', ['js']);
	gulp.watch('dev/img/**/*', ['images']);
	gulp.watch('dev/fonts/**/*', ['fonts']);
});

gulp.task('default', ['sass', 'jade', 'js', 'images', 'watch', 'fonts', 'connect']);