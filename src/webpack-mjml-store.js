'use strict';

const mjml2html = require('mjml');
const glob = require('glob');
const fs = require('fs-extra');
const _ = require('lodash');

/**
 * @type {{extension: string, outputPath: string}}
 */
const defaultOptions = {
  extension: '.html',
  filePath: '.',
  outputPath: ''
};

/**
 * @param inputPath
 * @param options
 * @constructor
 */
const WebpackMjmlStore = function (inputPath, options) {
    this.inputPath = inputPath.replace(/\\/g,'/');
    this.options = _.defaults(options, defaultOptions);
    this.options.outputPath = this.options.outputPath.replace(/\\/g,'/');
};

/**
 * @param compiler
 */
WebpackMjmlStore.prototype.apply = function (compiler) {
  let that = this;

  compiler.plugin('emit', function (compilation, callback) {
    fs.ensureDirSync(that.options.outputPath);

    glob(that.inputPath + '/**/*.mjml', function (err, files) {
      if (!files.length) {
        return callback();
      }

      var tasks = [];

      for (let fileKey in files) {
        let file = files[fileKey];

        if (compilation.fileDependencies.add) {
          compilation.fileDependencies.add(file);
        } else {
          compilation.fileDependencies.push(file);
        }

        let outputFile = file
          .replace(that.inputPath, that.options.outputPath)
          .replace('.mjml', that.options.extension);

        tasks.push(that.handleFile(file, outputFile));
      }

      Promise.all(tasks)
        .then(callback());
    });

  });
};

/**
 * @param file
 * @param outputFile
 * @returns {Promise}
 */
WebpackMjmlStore.prototype.handleFile = function (file, outputFile) {
  let that = this;
  return new Promise(function (resolve, reject) {
    that.convertFile(file)
      .then((contents) => that.ensureFileExists(outputFile, contents))
      .then((contents) => that.writeFile(outputFile, contents))
      .then(resolve());
  });
};

/**
 * @param file
 * @returns {Promise}
 */
WebpackMjmlStore.prototype.convertFile = function (file) {
  let that = this;

  return new Promise(function (resolve, reject) {
    fs.readFile(file, 'utf8', function (err, contents) {
      let response = mjml2html(contents, {
        filePath: that.options.filePath
      });

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
  return new Promise(function (resolve, reject) {
    fs.writeFile(file, contents, function (err) {
      if (err) {
        throw err;
      }
      resolve(true);
    });
  });
};

/**
 * @param file
 * @param contents
 * @returns {Promise}
 */
WebpackMjmlStore.prototype.ensureFileExists = function (file, contents) {
  return new Promise(function (resolve, reject) {
    fs.ensureFile(file, function (err) {
      if (err) {
        throw err;
      }

      resolve(contents);
    });
  });
};

/**
 * @type {WebpackMjmlStore}
 */
module.exports = WebpackMjmlStore;
