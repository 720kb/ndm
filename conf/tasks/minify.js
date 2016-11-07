/*global require*/
(function buildTask() {
  'use strict';

  const gulp = require('gulp')
    , runSequence = require('run-sequence')
    , paths = require('../paths.json')
    , minifyJS = require('gulp-uglify')
    , minifyCSS = require('gulp-clean-css');

  gulp.task('distify', ['dist'], done => {

    /*runSequence([
      'dist-minify-css',
      'dist-minify-js'
    ]);*/
    return;
  });

  gulp.task('dist-minify-css', () => {

    return gulp.src(`${paths.dist}css/*.css`)
      .pipe(minifyCSS())
      .pipe(gulp.dest(`${paths.dist}css/`));
  });
  gulp.task('dist-minify-js', () => {

    return gulp.src(`${paths.dist}js/*.js`)
      .pipe(minifyJS())
      .pipe(gulp.dest(`${paths.dist}js/`));
  });
}());
