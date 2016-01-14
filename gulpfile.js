var gulp = require('gulp');
var browserify = require('browserify');
var babelify= require('babelify');
var util = require('gulp-util');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var watch = require('gulp-watch');
var reactify = require('reactify');
var rename = require('gulp-rename');
var compass = require('gulp-compass');
var csso = require('gulp-csso');
var autoprefixer = require('gulp-autoprefixer');
var notify = require('gulp-notify');

gulp.task('js', function() {
    browserify('_src/js/cube.js', { debug: true })
        .add(require.resolve('babel/polyfill'))
        //.transform(babelify)
        .transform(babelify.configure({
            ignore: /(bower_components)|(node_modules)/
        }))
        .transform(reactify)
        .bundle()
        .on('error', util.log.bind(util, 'Browserify Error'))
        .pipe(source('_src/js/cube.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(rename({dirname: ''}))
        .pipe(gulp.dest('./js'))
        .pipe(notify("JS done"));
});


gulp.task('css', function() {
    gulp.src(['_src/sass/**/*.sass', '_src/sass/**/*.scss'])
        .pipe(compass({
            css: 'css',
            sass: '_src/sass',
            image: 'img'
        }))
        .on('error', swallowError)
        .pipe(autoprefixer({
            remove: false
        }))
        .pipe(csso())
        .pipe(gulp.dest('./css'))
    ;
});

gulp.task('watch', function() {
    gulp.watch(['_src/js/**/*.js', '_src/js/**/*.jsx'], ['js']);
    gulp.watch(['_src/sass/**/*.sass', '_src/sass/**/*.scss'], ['css']);
});


function swallowError (error) {
    console.log(error.toString());
    this.emit('end');
}

gulp.task('default', ['watch']);