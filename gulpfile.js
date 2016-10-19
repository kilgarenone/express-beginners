var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var exec = require('child_process').exec;
var browserSync = require('browser-sync').create();

var reload = browserSync.reload;

function runCommand(command) {
    return function (cb) {
        exec(command, (err, stdout, stderr) => {
            console.log(stdout);
            console.log(stderr);
            cb(err);
        });
    };
}

gulp.task('start-browser-sync', () => {
    browserSync.init({
        proxy: 'localhost:8080', // can be [virtual host, sub-directory, localhost with port]
    });
});

gulp.task('scss-to-css', () => {
    const stream = gulp.src('scss/*.scss')
                        .pipe($.watch('scss/*.scss'))
                        .pipe($.sourceMap.init())
                        .pipe($.sass())
                        .pipe($.sourceMap.write())
                        .pipe(gulp.dest('css'))
                        .pipe(reload({ stream: true })); // prompts a reload after compilation

    return stream;
});

gulp.task('watch-file-change', ['start-browser-sync', 'start-server'], () => {   // TODO: add task 'scss-to-css' to the array
    // gulp.watch("scss/*.scss", ['scss-to-css']);
    gulp.watch('views/**/*.handlebars').on('change', reload);
    gulp.watch('app.js').on('change', reload);
});

gulp.task('start-server', runCommand('node app.js'));

gulp.task('test', () => {
    const testResults = gulp.src(['test/**/*.js'], { read: false })
                            .pipe($.mocha({ reporter: 'spec' }))
                            .on('error', $.util.log);

    return testResults;
});

gulp.task('default', ['watch-file-change']);
