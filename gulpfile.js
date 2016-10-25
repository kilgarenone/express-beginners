const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const spawn = require('child_process').spawn;
const sassTypes = require('node-sass').types;
const browserSync = require('browser-sync').create();
const staticAssetsMapper = require('./lib/staticAssetsMapper.js').map;

const reload = browserSync.reload;

const config = {
    publicBuildCssDir: './public/build/css',
    publicBuildCssMapsDir: './sourcemaps', // path is relative to publicBuildCssDir
    publicSassDir: './public/styles/**/*.scss',
};

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
        'Firefox ESR',
    ],
};

gulp.task('start-browser-sync', () => {
    browserSync.init({
        proxy: 'localhost:8080', // can be [virtual host, sub-directory, localhost with port]
    });
});

gulp.task('scss-to-css', () => {
    const stream = gulp.src(config.publicSassDir)
                        .pipe($.sourcemaps.init())
                        .pipe($.sass(sassOptions).on('error', $.sass.logError))
                        .pipe($.autoprefixer(autoprefixerOptions))
                        .pipe($.sourcemaps.write(config.publicBuildCssMapsDir))
                        .pipe(gulp.dest(config.publicBuildCssDir))
                        .pipe(reload({ stream: true })); // prompts a reload after compilation

    return stream;
});

gulp.task('watch-file-change', ['start-browser-sync', 'scss-to-css', 'start-server'], () => {
    gulp.watch(config.publicSassDir, ['scss-to-css']);
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

gulp.task('production', [], () => {
    const stream = gulp.src(config.publicSassDir)
                        .pipe($.sass({ outputStyle: 'compressed' }))
                        .pipe($.autoprefixer(autoprefixerOptions))
                        .pipe(gulp.dest(config.publicBuildCssDir));

    return stream;
});

gulp.task('default', ['watch-file-change']);
