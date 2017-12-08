'use strict';

const mjmlEngine = require('mjml');
const glob = require('glob');
const fs = require('fs');
const _ = require('lodash');

/**
 * @type {{extension: string, outputPath: string}}
 */
const defaultOptions = {
    extension: '.html',
    outputPath: ''
};

/**
 * @param inputPath
 * @param options
 * @constructor
 */
const WebpackMjmlStore = function (inputPath, options) {
    this.inputPath = inputPath;
    this.options = _.defaults(options, defaultOptions);
};

/**
 * @param compiler
 */
WebpackMjmlStore.prototype.apply = function (compiler) {
    let that = this;

    compiler.plugin('emit', function (compilation, callback) {
        fs.existsSync(that.options.outputPath) || fs.mkdirSync(that.options.outputPath);

        glob(that.inputPath + '/**/*.mjml', function (err, files) {
            for (let fileKey in files) {
                let file = files[fileKey];
                compilation.fileDependencies.push(file);

                let outputFile = file
                    .replace(that.inputPath, that.options.outputPath)
                    .replace('.mjml', that.options.extension);

                that.convertFile(file)
                    .then((contents) => that.writeFile(outputFile, contents))
                    .then(callback());
            }
        });
    });
};

/**
 * @param file
 * @returns {Promise}
 */
WebpackMjmlStore.prototype.convertFile = function (file) {
    return new Promise (function(resolve, reject) {
        fs.readFile(file, 'utf8', function (err, contents) {
            let response = mjmlEngine.mjml2html(contents);
            if (response.errors.length) {
                console.log('\x1b[36m', 'MJML Warnings in file "' + file + '":', '\x1b[0m');
            }

            for (let errorKey in response.errors) {
                console.log("  -  ", response.errors[errorKey].formattedMessage);
            }

            resolve(response.html);
        });
    });
};

/**
 * @param file
 * @param contents
 * @returns {Promise}
 */
WebpackMjmlStore.prototype.writeFile = function (file, contents) {
    return new Promise (function(resolve, reject) {
        fs.writeFile(file, contents, function (err) {
            if (err) {
                throw err;
            }

            resolve(true);
        });
    });
};

/**
 * @type {WebpackMjmlStore}
 */
module.exports = WebpackMjmlStore;
