/*global require*/
(function buildTask() {
  'use strict';

  const gulp = require('gulp')
    , del = require('del')
    , paths = require('../paths.json');

  gulp.task('clean', () => {

    return del([
      paths.tmp,
      paths.dist
    ]);
  });
}());
