/*global require*/
const gulp = require('gulp')
  , rollup = require('rollup').rollup
  , rollupJSON = require('rollup-plugin-json')
  , rollupBabel = require('rollup-plugin-babel')
  , runSequence = require('run-sequence')
  , paths = require('../paths.json');

gulp.task('es6-build', done => {

  return runSequence(
    'front-end',
    'ndm',
    'ndm-updater',
    done);
});

gulp.task('ndm', () => {

  return rollup({
    'entry': `${paths.lib}js/index.js`,
    'plugins': [
      rollupJSON(),
      rollupBabel({
        'presets': [
          'es2015-rollup'
        ]
      })
    ]
  }).then(bundle => {

    return bundle.write({
      'format': 'iife',
      'moduleId': 'npm-ui-ng',
      'moduleName': 'npm-ui-ng',
      'sourceMap': true,
      'dest': `${paths.tmp}/js/index.js`
    });
  });
});

gulp.task('ndm-updater', () => {

  return rollup({
    'entry': `${paths.lib}js/update.js`,
    'plugins': [
      rollupJSON(),
      rollupBabel({
        'presets': [
          'es2015-rollup'
        ]
      })
    ]
  }).then(bundle => {

    return bundle.write({
      'format': 'iife',
      'moduleId': 'npm-updater-ng',
      'moduleName': 'npm-updater-ng',
      'sourceMap': true,
      'dest': `${paths.tmp}/js/update.js`
    });
  });
});
