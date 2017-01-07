/*global require*/
const gulp = require('gulp')
  , ngAnnotate = require('gulp-ng-annotate')
  , paths = require('../paths.json');

gulp.task('annotate', ['es6-build'], () => {

  return gulp.src(`${paths.tmp}**/*.js`)
    .pipe(ngAnnotate())
    .pipe(gulp.dest(`${paths.tmp}`));
});
