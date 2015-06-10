var sass = require('gulp-sass');
var less = require('gulp-less');
var gettext = require('gulp-angular-gettext');
var del = require('del');
var rename = require('gulp-rename');
var tsify = require('tsify');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var glob = require('glob');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var browserifyGlobalShim = require('browserify-global-shim');
var runSequence = require('run-sequence');
var mainBowerFiles = require('main-bower-files');
var concat = require('gulp-concat');
var concatCss = require('gulp-concat-css');
var gutil = require('gulp-util');
var exorcist = require('exorcist');
var fs = require('fs');
var watch = require('gulp-watch');

module.exports = function (gulp, config) {

    var globalModules = [];
    var globalShim = browserifyGlobalShim.configure(globalModules.reduce(function (prev, varName) {
        prev[varName] = varName;
        return prev;
    }, {}));

    gulp.task('clean:typescript:dev', function (cb) {
        return del([config.FRONT_GEN_DIR + 'app.js*'], cb);
    });

    gulp.task('clean:gen', function (cb) {
        return del([config.FRONT_GEN_DIR], cb);
    });

    gulp.task('less:dev', function () {
        return gulp.src(config.FRONT_ASSETS_STYLES_DIR + 'manifest.less')
            .pipe(less())
            .on('error', function (err) {
                gutil.log(gutil.colors.red(err.message));
                this.emit('end');
            })
            .pipe(rename('styles.css'))
            .pipe(gulp.dest(config.FRONT_GEN_STYLES_DIR));
    });

    gulp.task('sass:dev', function () {
        return gulp.src(config.FRONT_ASSETS_STYLES_DIR + 'manifest.scss')
            .pipe(sass())
            .on('error', function (err) {
                gutil.log(gutil.colors.red(err.message));
                this.emit('end');
            })
            .pipe(rename('styles.css'))
            .pipe(gulp.dest(config.FRONT_GEN_STYLES_DIR));
    });

    gulp.task('cssmin:dev', function () {
        return gulp.src(config.FRONT_ASSETS_STYLES_DIR + 'style.css')
            .pipe(concatCss('styles.css'))
            .on('error', function (err) {
                gutil.log(gutil.colors.red(err.message));
                this.emit('end');
            })
            .pipe(gulp.dest(config.FRONT_GEN_STYLES_DIR));
    });

    gulp.task('watch:typescript', ['browserify:typescript:dev'], function () {
        return watch(config.FRONT_SRC_DIR + '**/*.ts', function () {
            runSequence(['browserify:typescript:dev']);
        });
    });

    gulp.task('watch:cssmin', ['cssmin:dev'], function () {
        return watch(config.FRONT_ASSETS_STYLES_DIR + '**/*.css', function () {
            runSequence(['cssmin:dev']);
        });
    });

    gulp.task('watch:less', ['less:dev'], function () {
        return watch(config.FRONT_ASSETS_STYLES_DIR + '**/*.less', function () {
            runSequence(['less:dev']);
        });
    });

    gulp.task('watch:sass', ['sass:dev'], function () {
        return watch(config.FRONT_ASSETS_STYLES_DIR + '**/*.scss', function () {
            runSequence(['sass:dev']);
        });
    });

    function createBrowserifyBundle(debug, withTests) {
        var b = browserify({
                debug: debug
            })
            .add(config.FRONT_SRC_DIR + 'application.ts')
            .add(glob.sync(config.FRONT_ASSETS_TYPINGS_DIR + '**/*.d.ts'))
            .add(glob.sync(config.FRONT_ASSETS_LIBS_DIR + '**/*.d.ts'));
        if (withTests) {
            b.add(glob.sync(config.FRONT_TEST_DIR + '**/*.ts'));
        }
        return b
            .plugin(tsify, config.TYPESCRIPT_FRONT_OPTIONS)
            .bundle();
    }

    gulp.task('browserify:typescript:dev', ['clean:typescript:dev'], function () {
        return browserify({
                debug: true
            })
            .add(config.FRONT_SRC_DIR + 'application.ts')
            .add(glob.sync(config.FRONT_ASSETS_TYPINGS_DIR + '**/*.d.ts'))
            .add(glob.sync(config.FRONT_ASSETS_LIBS_DIR + '**/*.d.ts'))
            .plugin(tsify, config.TYPESCRIPT_FRONT_OPTIONS)
            .bundle()
            .on('error', function (err) {
                gutil.log(gutil.colors.red(err.message));
            })
            .pipe(source(config.FRONT_SRC_DIR + 'application.ts'))
            .pipe(buffer())
            .pipe(rename('app.js'))
            .pipe(gulp.dest(config.FRONT_GEN_JS_DIR));
    });

    gulp.task('browserify:typescript:dist', function () {
        return createBrowserifyBundle(false)
            .pipe(source(config.FRONT_SRC_DIR + 'application.ts'))
            .pipe(buffer())
            .pipe(rename('app.js'))
            .pipe(gulp.dest(config.FRONT_GEN_JS_DIR));
    });

    gulp.task('browserify:typescript:test', function () {
        return createBrowserifyBundle(true, true)
            .pipe(source(config.FRONT_SRC_DIR + 'application.ts'))
            .pipe(buffer())
            .pipe(sourcemaps.init({
                loadMaps: true
            }))
            .pipe(sourcemaps.write(config.FRONT_GEN_JS_DIR))
            .pipe(rename('tests.js'))
            .pipe(gulp.dest(config.FRONT_GEN_JS_DIR));
    });

    gulp.task('front:dev', ['watch:typescript', 'watch:' + config.CSS_PREPROCESSOR]);
};
