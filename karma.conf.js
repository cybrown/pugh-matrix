// Karma configuration
// Generated on Wed Aug 20 2014 10:54:13 GMT+0200 (Paris, Madrid (heure dâ€™Ã©tÃ©))

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    browserNoActivityTimeout:1000,

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'expect'],


    // list of files / patterns to load in the browser
    files: [
        'front/assets/js/plugin.js',
        'front/bower_components/angular-mocks/angular-mocks.js',
        'front/assets/js/templates.js',
        'front/static/js/config.js',
        'front/assets/js/tests.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
		'front/assets/js/tests.js': ['coverage']
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'mocha','coverage','junit'],



    coverageReporter: {
      reporters: [
        {type: 'text'},
        {type: 'html', subdir: 'report-html'},
        {type: 'lcov', subdir: 'report-lcov'},
        {type: 'cobertura', subdir: 'cobertura'}
      ],
      dir: 'coverage/'
    },

    // the default configuration
    junitReporter : {
      outputFile : 'coverage/test/test-results.xml',
      suite : 'unit'
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_WARN,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],

    mochaReporter: {
      output: 'full'
    },
    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false

  });
};
