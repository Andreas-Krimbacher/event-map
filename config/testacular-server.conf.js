basePath = '../';

files = [
  JASMINE,
  JASMINE_ADAPTER,
  'js/angular/angular.js',
  'js/angular/angular-*.js',
  'test/lib/angular/angular-mocks.js',
  'js/*.js',
'js/angular/*.js',
'js/vendor/*.js',
'js/leaflet/dist/leaflet-src.js',
  'test/unit/**/*.js',
'js/leaflet/test/unit/leaflet/*js',
'js/leaflet/test/unit/*js'
];

// list of files to exclude
exclude = [];

// web server port
port = 8080;


// cli runner port
runnerPort = 9100;

// enable / disable colors in the output (reporters and logs)
colors = true;

// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_INFO;

// enable / disable watching file and executing tests whenever any file changes
autoWatch = false;

browsers = ['Chrome'];

// If browser does not capture in given timeout [ms], kill it
captureTimeout = 5000;

junitReporter = {
  outputFile: 'test_out/unit.xml',
  suite: 'unit'
};

// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = false;