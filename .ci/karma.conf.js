module.exports = (config) => {
  config.set({
    basePath: '../',
    files: [
      '.ci/node_modules/chai/chai.js',
      '.ci/node_modules/sinon/pkg/sinon.js',
      '.ci/node_modules/jquery/dist/jquery.js',
      '.ci/node_modules/moment/moment.js',
      '.ci/node_modules/lodash/lodash.js',

      '.ci/init.js',
      'data-generator.js*',
      'index.js*',

      // Add twiddler html boilerplate
      '.ci/timeout.js',
      // Test files
      'test/index.test.js',
    ],
    proxies: {
      '/src/': 'http://localhost:9876/base/src/',
    },
    frameworks: ['mocha'],
    reporters: ['mocha'],
    browsers: ['ChromeHeadless'],
    logLevel: config.LOG_INFO,
    singleRun: true,
    port: 9876,
  });
};
