var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var spawn = require('child_process').spawn;
var browserSync = require('browser-sync').create();

var reload = browserSync.reload;


gulp.task('start-browser-sync', () => {
    browserSync.init({
        proxy: 'localhost:8080', // can be [virtual host, sub-directory, localhost with port]
    });
});

gulp.task('scss-to-css', () => {
    const stream = gulp.src('public/css/**/*.scss')
                        // .pipe($.watch('public/css/**/*.scss'))
                        .pipe($.sourcemaps.init())
                        .pipe($.sass())
                        .pipe($.sourcemaps.write())
                        .pipe(gulp.dest('public/build/css'))
                        .pipe(reload({ stream: true })); // prompts a reload after compilation

    return stream;
});

gulp.task('watch-file-change', ['start-browser-sync', 'scss-to-css', 'start-server'], () => {   // TODO: add task 'scss-to-css' to the array
    gulp.watch('public/css/**/*.scss', ['scss-to-css']);
    gulp.watch('views/**/*.handlebars').on('change', reload);
    gulp.watch('app.js').on('change', reload);
});

gulp.task('start-server', () => {
    spawn('node', ['app.js'], { stdio: 'inherit' });
});

gulp.task('test', () => {
    const testResults = gulp.src(['test/**/*.js'], { read: false })
                            .pipe($.mocha({ reporter: 'spec' }))
                            .on('error', $.util.log);

    return testResults;
});

gulp.task('default', ['watch-file-change']);
