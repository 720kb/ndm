/*global require*/
(function gulpTask() {
  'use strict';

  const gulp = require('gulp')
    , gulpJade = require('gulp-jade')
    , plumber = require('gulp-plumber')
    , runSequence = require('run-sequence')
    , sourcemaps = require('gulp-sourcemaps')
    , gulpSass = require('gulp-sass')
    , paths = require('../paths.json');

  gulp.task('front-end', ['clean'], done => {

    return runSequence([
      'scss',
      'jade'
    ], done);
  });

  gulp.task('scss', () => {

    return gulp.src(`${paths.lib}scss/index.scss`)
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(gulpSass({}))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(`${paths.tmp}/css`));
  });

  gulp.task('jade', () => {

    return gulp.src(`${paths.lib}**/*.jade`)
      .pipe(gulpJade())
      .pipe(gulp.dest(`${paths.tmp}`));
  });
}());
