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

          var cd = `cd ${path} &&`;
        }
        if (env) {

          var env = `--${env}`;
        }

        return new Promise(function listPromise(resolve, reject) {

          exec(`${cd || ''} npm list ${glob || ''} --json ${env || ''}`, options, function onList(err, stdout, stderr) {

            if (err || stderr) {
              $log.error('Error npm list', err, stderr);
              reject(err);
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

          var cd = `cd ${path} &&`;
        }

        if (env) {
          var env = `--${env}`;
        }

        return new Promise(function listPromise(resolve, reject) {

          exec(`${cd || ''} npm outdated ${glob || ''} --json ${env || ''}`, options, function onList(err, stdout, stderr) {

            if (err || stderr) {

              $log.error('Error npm outdated', err, stderr);
              reject(err);
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
