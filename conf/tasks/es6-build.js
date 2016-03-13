/*global require*/
(function buildTask() {
  'use strict';

  const gulp = require('gulp')
    , rollup = require('rollup').rollup
    , rollupJSON = require('rollup-plugin-json')
    , rollupBabel = require('rollup-plugin-babel')
    , paths = require('../paths.json');

  gulp.task('es6-build', ['front-end'], () => {
    const toProcess = [
      rollup({
        'entry': `${paths.lib}index.js`,
        'plugins': [
          rollupJSON(),
          rollupBabel({
            'presets': [
              'es2015-rollup'
            ]
          })
        ]
      }),
      rollup({
        'entry': `${paths.lib}js/index.js`,
        'plugins': [
          rollupJSON(),
          rollupBabel({
            'presets': [
              'es2015-rollup'
            ]
          })
        ]
      })
    ];

    return Promise.all(toProcess).then(bundles => {

      if (bundles &&
        Array.isArray(bundles)) {

        bundles[0].write({
          'format': 'cjs',
          'moduleId': 'npm-ui',
          'moduleName': 'npm-ui',
          'sourceMap': true,
          'dest': `${paths.tmp}index.js`
        });

        bundles[1].write({
          'format': 'iife',
          'moduleId': 'npm-ui-ng',
          'moduleName': 'npm-ui-ng',
          'sourceMap': true,
          'dest': `${paths.tmp}/js/index.js`
        });
      }
    });
  });
}());
