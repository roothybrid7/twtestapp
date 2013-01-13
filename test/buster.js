var config = exports; // Vanity

config['Browser unit tests'] = {
  environment: 'browser',
  rootPath: '../',
  libs: [
  ],
  sources: [
    'src/app.js',
    'src/**/*.js'
  ],
  tests: [
    'test/unit/**/*_test.js'
  ]
};
