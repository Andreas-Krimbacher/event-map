basePath = '../';

files = [
    ANGULAR_SCENARIO,
    ANGULAR_SCENARIO_ADAPTER,
  'test/e2e/**/*.js'
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

autoWatch = false;

browsers = ['Chrome'];

singleRun = false;


proxies = {
    '/': 'http://localhost:8000/'
};



junitReporter = {
  outputFile: 'test_out/e2e.xml',
  suite: 'e2e'
};
