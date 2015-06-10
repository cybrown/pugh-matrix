var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var runSequence = require('run-sequence');
var usemin = require('gulp-usemin');
var minifyCss = require('gulp-minify-css');
var html2js = require('gulp-html2js');
var htmlmin = require('gulp-htmlmin');
var gzip = require('gulp-gzip');
var tar = require('gulp-tar');
var del = require('del');
var manifest = require('gulp-manifest');

module.exports = function (gulp, config) {

    gulp.task('clean:dist', function (cb) {
        return del([config.DIST_DIR], cb);
    });

    gulp.task('clean:archive', function (cb) {
        return del([config.ARCHIVE_FILE], cb);
    });

    gulp.task('html2js:dist', function () {
        return gulp.src(config.FRONT_SRC_DIR + '**/*.html')
            .pipe(htmlmin({collapseWhitespace: true, removeComments: true}))
            .pipe(html2js({
                outputModuleName: 'templates',
                base: config.FRONT_DIR,
                removeComments: true,
                collapseWhitespace: true
            }))
            .pipe(concat('templates.js'))
            .pipe(gulp.dest(config.FRONT_GEN_JS_DIR));
    });

    gulp.task('uglify', function () {
        return gulp.src(config.DIST_ASSETS_JS_DIR + '**/*.js')
            .pipe(uglify())
            .pipe(gulp.dest(config.DIST_ASSETS_JS_DIR));
    });

    gulp.task('usemin', function () {
        return gulp.src(config.FRONT_DIR + 'index.html')
            .pipe(usemin({
                assetsDir: config.FRONT_DIR,
                css: [minifyCss()]
            }))
            .pipe(gulp.dest(config.DIST_DIR));
    });

    gulp.task('htmlmin', function () {
        return gulp.src(config.DIST_DIR + 'index.html')
            .pipe(htmlmin({
                collapseWhitespace: true,
                removeComments: true
            }))
            .pipe(gulp.dest(config.DIST_DIR));
    });

    // Permet de créer la version de l'application en production
    gulp.task('dist', ['clean'], function (cb) {
        runSequence(
            ['back:typescript', 'browserify:typescript:dist', 'html2js:dist', config.CSS_PREPROCESSOR + ':dev'],
            'usemin',
            ['htmlmin', 'uglify', 'copy:sources'],
            'manifest',
            cb
        );
    });

    // Permet de démarrer la version de l'application en production
    gulp.task('dist:start', function (cb) {
        runSequence('dist', 'back:typescript', 'express:start:dist', cb);
    });

    gulp.task('archive', ['dist'], function () {
        return gulp.src([
                config.BACK_DIR + '**/*',
                '!' + config.BACK_SRC_DIR + '**/*',
                '!' + config.BACK_LIB_TEST_DIR + '**/*',
                config.DIST_DIR + '**/*',
                './package.json'
            ], {
                base: '.'
            })
            .pipe(tar('archive.tar'))
            .pipe(gzip())
            .pipe(gulp.dest('.'));
    });

    gulp.task('archive:front', ['dist'], function () {
        return gulp.src([
                config.DIST_DIR + '**/*'
            ], {
                base: '.'
            })
            .pipe(tar('archive.tar'))
            .pipe(gzip())
            .pipe(gulp.dest('.'));
    });

    gulp.task('manifest', function () {
        return gulp.src([config.DIST_DIR + '/**/*'])
            .pipe(manifest({
                hash: true,
                network: ['http://*', 'https://*', '*'],
                filename: 'app.manifest',
                exclude: 'app.manifest'
            }))
            .pipe(gulp.dest(config.DIST_DIR));
    });

    gulp.task('copy:languages', function () {
        return gulp.src(config.FRONT_ASSETS_LANGUAGES_DIR + '*', {
                base: config.FRONT_ASSETS_LANGUAGES_DIR
            })
            .pipe(gulp.dest(config.DIST_ASSETS_LANGUAGES_DIR));
    });

    gulp.task('copy:static', function () {
        return gulp.src(config.FRONT_DIR + 'static/**/*', {
                base: config.FRONT_DIR + 'static/'
            })
            .pipe(gulp.dest(config.DIST_DIR + 'static/'));
    });

    gulp.task('copy:sources', ['copy:languages', 'copy:static']);
};
