/*global require*/
(function gulpTask() {
  'use strict';

  const gulp = require('gulp')
    , gulpPug = require('gulp-pug')
    , plumber = require('gulp-plumber')
    , runSequence = require('run-sequence')
    , sourcemaps = require('gulp-sourcemaps')
    , gulpSass = require('gulp-sass')
    , paths = require('../paths.json');

  gulp.task('front-end', ['clean'], done => {

    return runSequence([
      'scss',
      'pug'
    ], done);
  });

  gulp.task('scss', () => {

    return gulp.src(`${paths.lib}scss/index.scss`)
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(gulpSass({
        'outputStyle': 'compressed'
       }))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(`${paths.tmp}/css`));
  });

  gulp.task('pug', () => {

    return gulp.src(`${paths.lib}**/*.pug`)
      .pipe(gulpPug())
      .pipe(gulp.dest(`${paths.tmp}`));
  });
}());
