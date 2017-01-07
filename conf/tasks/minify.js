/*global require*/
const gulp = require('gulp')
  , runSequence = require('run-sequence')
  , paths = require('../paths.json')
  , minifyJS = require('gulp-uglify');

gulp.task('distify', done => {

  runSequence(
    'dist',
    'dist-minify-js',
    done);
});

gulp.task('dist-minify-js', () => {

  return gulp.src(`${paths.dist}js/*.js`)
    .pipe(minifyJS())
    .pipe(gulp.dest(`${paths.dist}js/`));
});
