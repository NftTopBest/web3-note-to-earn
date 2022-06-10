"use strict";
exports.__esModule = true;
var webpack = require("webpack");
// in case you run into any typescript error when configuring `devServer`
require("webpack-dev-server");
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
/*

https://create-react-app.dev/docs/advanced-configuration/

INLINE_RUNTIME_CHUNK = false

  By default, Create React App will embed the runtime script into index.html
  during the production build. When set to false, the script will not be
  embedded and will be imported as usual. This is normally required when dealing
  with CSP.

GENERATE_SOURCEMAP = false

  When set to false, source maps are not generated for a production build. This
  solves out of memory (OOM) issues on some smaller machines.

(SKIP_PREFLIGHT_CHECK = true)

*/
module.exports = function override(config, env) {
    // no source maps
    config.devtool = false;
    // https://stackoverflow.com/a/60848093/1895436
    // Consolidate chunk files instead
    config.optimization.splitChunks = {
        cacheGroups: {
            "default": false
        }
    };
    // Move runtime into bundle instead of separate file
    config.optimization.runtimeChunk = false;
    // CSS remove MiniCssPlugin
    config.plugins = config.plugins.filter(
    // @ts-ignore
    function (plugin) { return !(plugin instanceof MiniCssExtractPlugin); });
    // CSS replaces all MiniCssExtractPlugin.loader with style-loader
    config.module.rules = config.module.rules.map(function (moduleRule) {
        var _a;
        moduleRule.oneOf = (_a = moduleRule.oneOf) === null || _a === void 0 ? void 0 : _a.map(function (rule) {
            if (!rule.hasOwnProperty('use'))
                return rule;
            return Object.assign({}, rule, {
                // @ts-ignore
                use: rule.use.map(function (options) {
                    return /mini-css-extract-plugin/.test(options.loader)
                        ? { loader: require.resolve('style-loader'), options: {} }
                        : options;
                })
            });
        });
        return moduleRule;
    });
    var fallback = config.resolve.fallback || {};
    Object.assign(fallback, {
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        assert: require.resolve('assert'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        os: require.resolve('os-browserify'),
        url: require.resolve('url')
    });
    config.resolve.fallback = fallback;
    config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer']
        }),
    ]);
    // for initial chunks
    // config.output.filename = 'static/js/[name].js';
    config.output.filename = 'popup-main.js';
    // for non-initial chunks (hopefully none of them)
    // config.output.chunkFilename = 'static/js/nic-[id].js';
    return config;
};
