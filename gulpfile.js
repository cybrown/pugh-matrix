var gulp = require('gulp');
var runSequence = require('run-sequence');

var config = require('./gulp/gulpfile.config.json');

require('./gulp/gulpfile.back')(gulp, config);
require('./gulp/gulpfile.front')(gulp, config);
require('./gulp/gulpfile.test')(gulp, config);
require('./gulp/gulpfile.dist')(gulp, config);

gulp.task('clean', [
    'back:clean',
    'clean:dist',
    'clean:gen',
    'clean:archive',
    'clean:coverage'
]);

// Permet de démarrer la version developpement
gulp.task('default', ['clean'], function (cb) {
    runSequence([
        'back:dev',
        'front:dev'
    ], cb);
});
