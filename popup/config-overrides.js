"use strict";
exports.__esModule = true;
var webpack = require("webpack");
require("webpack-dev-server");
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = function override(config, env) {
    config.devtool = false;
    config.optimization.splitChunks = {
        cacheGroups: {
            "default": false
        }
    };
    config.optimization.runtimeChunk = false;
    config.plugins = config.plugins.filter(function (plugin) { return !(plugin instanceof MiniCssExtractPlugin); });
    config.module.rules = config.module.rules.map(function (moduleRule) {
        var _a;
        moduleRule.oneOf = (_a = moduleRule.oneOf) === null || _a === void 0 ? void 0 : _a.map(function (rule) {
            if (!rule.hasOwnProperty('use'))
                return rule;
            return Object.assign({}, rule, {
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
    config.output.filename = 'popup-main.js';
    return config;
};
