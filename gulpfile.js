var gulp = require('gulp');
var sass = require('gulp-sass');
var mocha = require('gulp-mocha');
var util = require('gulp-util');
var watch = require('gulp-watch');
var sourceMap = require('gulp-sourcemaps');
var spawn = require('child_process').spawn;
var browserSync = require('browser-sync').create();

var reload = browserSync.reload;


gulp.task('start-browser-sync', () => {
    browserSync.init({
        proxy: 'localhost:3000', // can be [virtual host, sub-directory, localhost with port]
    });
});

gulp.task('scss-to-css', () => {
    const stream = gulp.src('scss/*.scss')
                        .pipe(watch('scss/*.scss'))
                        .pipe(sourceMap.init())
                        .pipe(sass())
                        .pipe(sourceMap.write())
                        .pipe(gulp.dest('css'))
                        .pipe(reload({ stream: true })); // prompts a reload after compilation

    return stream;
});

gulp.task('watch-file-change', ['start-browser-sync'], () => {   // TODO: add task 'scss-to-css' to the array
    // gulp.watch("scss/*.scss", ['scss-to-css']);
    spawn('node', ['app.js'], { stdio: 'inherit' });
    gulp.watch('views/**/*.handlebars').on('change', reload);
    gulp.watch('app.js').on('change', reload);
});

gulp.task('test', () => {
    const testResults = gulp.src(['test/**/*.js'], { read: false })
                            .pipe(mocha({ reporter: 'spec' }))
                            .on('error', util.log);

    return testResults;
});

gulp.task('default', ['watch-file-change']);
