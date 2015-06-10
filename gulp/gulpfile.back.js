var runSequence = require('run-sequence');
var del = require('del');
var ts = require('gulp-typescript');
var gulpExpress = require('gulp-express');
var watch = require('gulp-watch');

module.exports = function (gulp, config) {

    var backTsProject = ts.createProject(config.BACK_SRC_DIR + 'tsconfig.json', {
        typescript: require('typescript')
    });
    gulp.task('back:typescript', ['back:clean'], function () {
        var tsResult = gulp.src(config.BACK_SRC_DIR + '**/*.ts')
            .pipe(ts(backTsProject));
        return tsResult.js.pipe(gulp.dest(config.BACK_LIB_DIR));
    });

    gulp.task('back:clean', function (cb) {
        return del([config.BACK_LIB_DIR], cb);
    });

    function runGulpExpress(publicDir) {
        gulpExpress.run([config.BACK_MAIN_FILE], {
            env: {
                PORT: config.PORT,
                RUN_SERVER: true,
                BASE: publicDir
            }
        });
    }

    gulp.task('express:start:dev', function () {
        runGulpExpress(config.FRONT_DIR);
    });

    gulp.task('express:start:dist', function () {
        runGulpExpress(config.DIST_DIR);
    });

    gulp.task('express:stop', function () {
        gulpExpress.stop();
    });

    gulp.task('express:reload', function (cb) {
        runSequence('express:stop', 'back:typescript', 'express:start:dev', cb);
    });

    gulp.task('express:watch', ['express:start:dev'], function () {
        return watch(config.BACK_SRC_MAIN_DIR + '**/*.ts', function () {
            runSequence(['express:reload']);
        });
    });

    gulp.task('back:dev', function (cb) {
        runSequence('back:typescript', 'express:watch', cb);
    });
};
