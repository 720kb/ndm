/*global require*/
(function gulpTask() {
  'use strict';

  const gulp = require('gulp')
    , gulpHaml = require('gulp-haml')
    , paths = require('../paths.json');

  gulp.task('haml', ['clean'], () => {

    return gulp.src(`${paths.lib}**/*.haml`)
      .pipe(gulpHaml())
      .pipe(gulp.dest(`${paths.tmp}`));
  });
}());
