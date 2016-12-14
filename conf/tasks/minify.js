/*global require*/
(function buildTask() {
  'use strict';

  const gulp = require('gulp')
    , runSequence = require('run-sequence')
    , paths = require('../paths.json')
    , minifyJS = require('gulp-uglify');

  gulp.task('distify', ['dist'], done => {

    runSequence([
      'dist-minify-js'
    ]);
    return;
  });

  gulp.task('dist-minify-js', () => {

    return gulp.src(`${paths.dist}js/*.js`)
      .pipe(minifyJS())
      .pipe(gulp.dest(`${paths.dist}js/`));
  });
}());
