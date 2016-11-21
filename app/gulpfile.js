const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const spawn = require('child_process').spawn;
const browserSync = require('browser-sync').create();
const sassTypes = require('node-sass').types;
const staticAssetsMapper = require('staticAssetsMapper.js').map;
const configs = require('configs');

const reload = browserSync.reload;

const cssScssDirConfigs = configs.cssScssDirConfigs;
// Pass in options just like you would for the 'node-sass' package
// https://github.com/sass/node-sass#options
const sassOptions = {
    errLogToConsole: true,
    outputStyle: 'expanded',
    functions: {
        // static mapping to convert static(path) to mapped static url(path) css format
        'static($url)': function (url) {
            return sassTypes.String(`url("${staticAssetsMapper(url.getValue())}")`);
        },
    },
};

const autoprefixerOptions = {
    browsers: [
        'last 2 versions', // last 2 versions of all browsers
        '> 5%', // browsers with over 5% market share
        'Firefox ESR', // Firefox Extended Support Release(ESR)
    ],
};

/*
    BROWSER SYNC enables browser to automatically refresh pages being watched
    or update certain UI portions of a page due to CSS changes
*/
gulp.task('start-browser-sync', () => {
    browserSync.init({
        proxy: 'localhost:8080', // can be [virtual host, sub-directory, localhost with port]
    });
});

// Compile SCSS to CSS
gulp.task('scss-to-css', () => {
    const stream = gulp.src(cssScssDirConfigs.publicSassDir) // Get SCSS files
                        .pipe($.sourcemaps.init()) // Build sourcemaps for easy CSS debugging on front-end
                        .pipe($.sass(sassOptions).on('error', $.sass.logError)) // Gulp process is by default killed when there's an error parsing sass. The error handler prevents that and tells us where went wrong too
                        .pipe($.autoprefixer(autoprefixerOptions)) // Add prefixes to some modern CSS properties for better browser support
                        .pipe($.sourcemaps.write(cssScssDirConfigs.publicBuildCssMapsDir)) // Destination for built sourcemaps
                        .pipe(gulp.dest(cssScssDirConfigs.publicBuildCssDir)) // Destination to for compiled CSS
                        .pipe(reload({ stream: true })); // Prompts a reload after compilation

    return stream;
});

// Run 'node app.js'
gulp.task('start-server', () => {
    spawn('node', ['app.js'], { stdio: 'inherit' });
});

// 'gulp test' to run all tests
gulp.task('test', () => {
    const testResults = gulp.src(['**/test/**/*.js'], { read: false })
                            .pipe($.mocha({ reporter: 'spec' }))
                            .on('error', $.util.log);

    return testResults;
});

gulp.task('production', [], () => {
    const stream = gulp.src(cssScssDirConfigs.publicSassDir)
                        .pipe($.sass({ outputStyle: 'compressed' }))
                        .pipe($.autoprefixer(autoprefixerOptions))
                        .pipe(gulp.dest(cssScssDirConfigs.publicBuildCssDir));

    return stream;
});

/*
    Before running this task, 3 separate dependent tasks will run, but not necessarily in order

    To run tasks IN ORDER, see:
    https://github.com/gulpjs/gulp/blob/master/docs/API.md#async-task-support
    http://stackoverflow.com/a/32188928
*/
gulp.task('watch-file-change', ['start-browser-sync', 'scss-to-css', 'start-server'], () => {
    gulp.watch(cssScssDirConfigs.publicSassDir, ['scss-to-css']);
    gulp.watch('**/views/**/*.handlebars').on('change', reload);
    gulp.watch('**/app.js').on('change', reload);
});

// Running 'gulp' in command will start the 'watch-file-change' task
gulp.task('default', ['watch-file-change']);
