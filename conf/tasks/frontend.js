/*global require*/
(function gulpTask() {
  'use strict';

  const gulp = require('gulp')
    , gulpPug = require('gulp-pug')
    , plumber = require('gulp-plumber')
    , runSequence = require('run-sequence')
    , sourcemaps = require('gulp-sourcemaps')
    , gulpSass = require('gulp-sass')
    , paths = require('../paths.json')
    , argv = require('yargs').argv
    , platform = argv.platform;

  if (!platform) {
    platform = 'mac';
    console.info('No pltform specified, starting app for MAC');
  } else {
    console.log(`Starting app for ${platform}`);
  }

  gulp.task('front-end', ['clean'], done => {

    return runSequence([
      'scss',
      'pug'
    ], done);
  });

  gulp.task('scss', () => {

    return gulp.src(`${paths.lib}scss/${platform}/index.scss`)
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
