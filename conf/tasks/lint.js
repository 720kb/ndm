/*global __dirname,require*/
(function buildTask() {
  'use strict';

  const gulp = require('gulp')
      , jshint = require('gulp-jshint')
      , eslint = require('gulp-eslint')
      , jscs = require('gulp-jscs')
      , stylish = require('jshint-stylish')
      , path = require('path')
      , paths = require('../paths.json')
      , toLint = path.resolve(__dirname, '../..', paths.lib, '**/*.js')
      , gulpFolder = path.resolve(__dirname, '**/*.js');

  gulp.task('lint', ['eslint', 'jshint', 'jscs']);

  gulp.task('eslint', () => {

    return gulp.src([gulpFolder, toLint])
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failOnError());
  });

  gulp.task('jshint', () => {

    return gulp.src([gulpFolder, toLint])
      .pipe(jshint())
      .pipe(jshint.reporter(stylish));
  });

  gulp.task('jscs', () => {

    return gulp.src([gulpFolder, toLint])
      .pipe(jscs())
      .pipe(jscs.reporter())
      .pipe(jscs.reporter('fail'));
  });
}());
