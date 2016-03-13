/*global require*/
(function buildTask() {
  'use strict';

  const gulp = require('gulp')
    , plumber = require('gulp-plumber')
    , sourcemaps = require('gulp-sourcemaps')
    , sass = require('gulp-sass')
    , path = require('../paths.json');

  gulp.task('scss', () => {

    return gulp.src(`${path.lib}scss/index.scss`)
      .pipe(plumber())
      .pipe(sourcemaps.init({
        'loadMaps': true,
        'debug': true
      }))
      .pipe(sass({}))
      .pipe(sourcemaps.write('.', {
        'includeContent': false,
        'sourceRoot': '../lib'
      }))
      .pipe(gulp.dest(`${path.tmp}/css`));
  });
}());
