'use strict';

var gulp = require('gulp'),
	watch = require('gulp-watch'),
	prefixer = require('gulp-autoprefixer'),
	uglify = require('gulp-uglify'),
	sass = require('gulp-sass'),
	jade = require('gulp-jade'),
	sourcemaps = require('gulp-sourcemaps'),
	cssmin = require('gulp-minify-css'),
	imagemin = require('gulp-imagemin'),
	data = require("gulp-data"),
	pngquant = require('imagemin-pngquant'),
	rimraf = require('rimraf'),
	browserSync = require("browser-sync"),
	reload = browserSync.reload;

var path = {
	build: {
		html: 'build/',
		js: 'build/js/',
		css: 'build/css/',
		img: 'build/img/',
		fonts: 'build/fonts/'
	},
	src: {
		jade: 'dev/jade/2_pages/*.jade',
		js: 'dev/js/script.js',
		sass: 'dev/scss/**/*.scss',
		img: 'dev/img/**/*.*',
		fonts: 'dev/fonts/**/*.*'
	},
	ignore: {
		jade: '!dev/jade/**/_*.jade',
		js: '!dev/js/**/_*.js',
		sass: '!dev/scss/**/_*.scss',
	},
	watch: {
		jade: 'dev/**/*.jade',
		js: 'dev/js/**/*.js',
		sass: 'dev/scss/**/*.scss',
		img: 'dev/img/**/*.*',
		fonts: 'dev/fonts/**/*.*'
	},
	clean: './build'
};

var config = {
	server: {
		baseDir: path.clean
	},
	tunnel: true,
	host: 'localhost',
	port: 9000,
	logPrefix: "Andrew"
};

gulp.task('webserver', function (){
	browserSync(config);
});

gulp.task('clean', function (cb){
	rimraf(path.clean, cb);
});

gulp.task('jade:build', function (){
	gulp.src([path.src.jade, path.ignore.jade])
		.pipe(data(function (file){
			return {
				relativePath: file.history[0].replace(file.base,'')
			};
		}))
		.pipe(jade().on('error', console.log))
		.pipe(gulp.dest(path.build.html))
		.pipe(reload({stream: true}));
});

gulp.task('js:build', function () {
	gulp.src([path.src.js, path.ignore.js])
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(path.build.js))
		.pipe(reload({stream: true}));
});

gulp.task('sass:build', function (){
	gulp.src([path.src.sass, path.ignore.sass])
		.pipe(sourcemaps.init())
		.pipe(sass({
			sourceMap: true,
			errLogToConsole: true
		}))
		.pipe(prefixer())
		.pipe(cssmin())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(path.build.css))
		.pipe(reload({stream: true}));
});

gulp.task('image:build', function (){
	gulp.src(path.src.img)
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()],
			interlaced: true
		}))
		.pipe(gulp.dest(path.build.img))
		.pipe(reload({stream: true}));
});

gulp.task('fonts:build', function(){
	gulp.src(path.src.fonts)
		.pipe(gulp.dest(path.build.fonts))
		.pipe(reload({stream: true}));
});

gulp.task('build',[
	'jade:build',
	'js:build',
	'sass:build',
	'fonts:build',
	'image:build'
]);

gulp.task('watch', function(){
	watch([path.watch.jade], function(event, cb){
		gulp.start('jade:build');
	});
	watch([path.watch.sass], function(event, cb){
		gulp.start('sass:build');
	});
	watch([path.watch.js], function(event, cb){
		gulp.start('js:build');
	});
	watch([path.watch.img], function(event, cb){
		gulp.start('image:build');
	});
	watch([path.watch.fonts], function(event, cb){
		gulp.start('fonts:build');
	});
});

gulp.task('default', ['build','webserver','watch']);