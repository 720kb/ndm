/*global require*/
(function buildTask() {
  'use strict';

  const gulp = require('gulp')
    , ngAnnotate = require('gulp-ng-annotate')
    , paths = require('../paths.json');

  gulp.task('annotate', () => {

    return gulp.src(`${paths.tmp}**/*.js`)
      .pipe(ngAnnotate({
        'gulpWarnings': false
      }))
      .pipe(gulp.dest(`${paths.tmp}`));
  });
}());
