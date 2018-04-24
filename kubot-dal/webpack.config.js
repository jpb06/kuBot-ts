const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const GeneratePackageJsonPlugin = require('generate-package-json-webpack-plugin');
const MoveReadmePlugin = require('./tools/move-readme-webpack-plugin');

var nodeModules = {};
fs.readdirSync('node_modules')
    .filter(function (x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function (mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });

module.exports = {
    entry: './sources/index.ts',
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'index.js'
    },
    target: 'node',
    externals: nodeModules,
    mode: 'none',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
        ]
    },
    plugins: [
        new GeneratePackageJsonPlugin(
            {
                "name": "kubot-dal",
                "version": "1.1.0",
                "description": "kubot-dal",
                "main": "index.js",
                "types": "typings/index.d.ts",
                "author": {
                    "name": "jpb"
                },
                "dependencies": {
                    "mongodb": "^3.0.7"
                }
            },
            __dirname + "/package.json"),
        new MoveReadmePlugin()
    ],
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    }
};