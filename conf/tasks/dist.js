/*global require*/
(function buildTask() {
  'use strict';

  const gulp = require('gulp')
    , runSequence = require('run-sequence')
    , paths = require('../paths.json');

  gulp.task('dist', ['annotate'], done => {

    runSequence([
      'copy-transpiled-js-files',
      'copy-css-files',
      'copy-img-files',
    ], done);
  });

  gulp.task('copy-transpiled-js-files', () => {

    return gulp.src(`${paths.tmp}**/*`)
      .pipe(gulp.dest(`${paths.dist}`));
  });

  gulp.task('copy-css-files', () => {

    return gulp.src(`${paths.lib}css/**/*`)
      .pipe(gulp.dest(`${paths.dist}css`));
  });

  gulp.task('copy-img-files', () => {

    return gulp.src(`${paths.lib}img/**/*`)
      .pipe(gulp.dest(`${paths.dist}img`));
  });
}());
