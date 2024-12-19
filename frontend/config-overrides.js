const webpack = require('webpack');

/* Notes:
    - Webpack 5 no longer supports some default polyfills for modules needed at runtime
    - installed node-libs-browser
        - collection of polyfills for many of these core Node.js modules.
        - provides access to browser-compatible polyfills such as 'console-browserify'
    - purpose of this file:
        - override Webpack configuration created by Create React App
        - tell Webpack how to resolve missing Node.js core modules (that are not available in the browser)
            - ex: when Webpack encounters require(console) it will resolve by using the path specified by require.resolve('console-browserify')
        - config.plugins section:
            - Buffer is a global module in Node.js -> making it available in the browser environment
*/

module.exports = function override(config, env) {
  // Ensure the polyfills are added to the resolve configuration
  // this is quite similar to services + service providers
  config.resolve.fallback = {
    ...config.resolve.fallback,
    console: require.resolve('console-browserify'),
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    timers: require.resolve('timers-browserify'),
    util: require.resolve('util/'),
    os: require.resolve('os-browserify'),
    process: require.resolve('process/browser'),
    zlib: require.resolve('browserify-zlib'),
    url: require.resolve('url'),
    http: require.resolve('stream-http'),
    buffer: require.resolve('buffer/'),
    vm: require.resolve('vm-browserify'),
  };

  // Add the polyfill packages to the `plugins` array
  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
  ];

  return config;
};
