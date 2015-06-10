var del = require('del');
var runSequence = require('run-sequence');
var tslint = require('gulp-tslint');
var karma = require('gulp-karma');
var coberturaXmlRemapper = require('cobertura-xml-remapper');
var protractor = require('gulp-protractor').protractor;
var html2js = require('gulp-html2js');
var htmlmin = require('gulp-htmlmin');
var concat = require('gulp-concat');
var mocha = require('gulp-mocha');

module.exports = function (gulp, config) {

    gulp.task('clean:coverage', function (cb) {
        return del([config.COVERAGE_DIR], cb);
    });

    gulp.task('tslint', function () {
        return gulp.src(config.FRONT_SRC_DIR + '**/*.ts')
            .pipe(tslint())
            .pipe(tslint.report('verbose', {
                emitError: true
            }));
    });

    gulp.task('html2js:test', function () {
        return gulp.src(config.FRONT_SRC_DIR + '**/*.html')
            .pipe(htmlmin({
                collapseWhitespace: true,
                removeComments: true
            }))
            .pipe(html2js({
                outputModuleName: 'templates',
                base: config.FRONT_DIR,
                removeComments: true,
                collapseWhitespace: true
            }))
            .pipe(concat('templates.js'))
            .pipe(gulp.dest(config.FRONT_GEN_JS_DIR));
    });

    gulp.task('karma', ['browserify:typescript:test'], function () {
        return gulp.src([
                config.FRONT_GEN_JS_DIR + 'plugin.js',
                config.FRONT_ASSETS_LIBS_DIR + 'angular-mocks/angular-mocks.js',
                config.FRONT_GEN_JS_DIR + 'templates.js',
                config.FRONT_STATIC_JS_DIR + 'config.js',
                config.FRONT_GEN_JS_DIR + 'tests.js'
            ])
            .pipe(karma({
                configFile: 'karma.conf.js',
                singleRun: true,
                background: false
            }));
    });

    gulp.task('remapCobertura', function () {
        return coberturaXmlRemapper({
            bundlePath: config.FRONT_GEN_DIR + 'tests.js',
            inputCoberturaPath: config.COVERAGE_DIR + 'cobertura/cobertura-coverage.xml',
            outputCoberturaPath: config.COVERAGE_DIR + 'cobertura/cobertura-coverage-remapped.xml',
            outputJsDir: config.COVERAGE_DIR + 'cobertura/files/'
        });
    });

    gulp.task('protractor-firefox', function () {
        return gulp.src(config.FRONT_E2E_DIR + '**/*.spec.js')
            .pipe(protractor({
                browser: 'firefox',
            }));
    });

    // Permet de lancer les tests
    gulp.task('front:test', ['clean'], function (cb) {
        runSequence(['tslint', 'html2js:test'], 'browserify:typescript:test', 'concat', 'karma' /*, 'remapCobertura'*/, cb);
    });

    gulp.task('back:mocha', function () {
        return gulp.src(config.BACK_LIB_TEST_DIR + '**/*.js', {read: false})
            .pipe(mocha());
    });

    gulp.task('test', ['back:test', 'front:test']);

    // Permet de lancer les tests
    gulp.task('back:test', ['clean'], function (cb) {
        runSequence('clean', 'back:typescript', 'back:mocha', cb);
    });

    // Permet de lancer les tests d'intégration
    gulp.task('test-it', ['dist'], function (cb) {
        runSequence('express:start:dist', 'protractor-firefox', 'express:stop', cb);
    });
};
