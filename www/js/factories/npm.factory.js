/*global angular require*/
(function withAngular(angular) {
  'use strict';


  var exec = require('child_process').exec
    , options = {
      'maxBuffer': 10000 * 500
    }
    , NpmFactory = function NpmFactory($log) {

      var list = function list(globally, path, env) {

        if (globally) {

          var glob = '-g';
        }
        if (path) {

          var prefix = `--prefix ${path}`;
        }
        if (env) {

          var env = `--${env}`;
        }

        return new Promise(function listPromise(resolve, reject) {

          exec(`npm list ${glob || ''} --json --long ${env || ''} ${prefix || ''}`, options, function onList(err, stdout, stderr) {

            if (err || stderr) {
              $log.error('Error npm list', err, stderr);
              reject(err + stderr);
            }

            resolve(stdout);
          });
        });
      }
      , outdated = function outdated(globally, path, env) {

        if (globally) {

          var glob = '-g';
        }

        if (path) {

          var prefix = `--prefix ${path}`;
        }

        if (env) {
          var env = `--${env}`;
        }

        return new Promise(function listPromise(resolve, reject) {

          exec(`npm outdated ${glob || ''} --json ${env || ''} ${prefix || ''}`, options, function onList(err, stdout, stderr) {

            if (err || stderr) {

              $log.error('Error npm outdated', err, stderr);
              reject(err + stderr);
            }

            resolve(stdout);
          });
        });
      };

      return {
        'list': list,
        'outdated': outdated
      };
    };
  angular.module('electron.npm.factories', [])
    .factory('npmFactory',['$log', NpmFactory]);
}(angular));
