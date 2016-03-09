/*global angular require*/
(function withAngular(angular) {
  'use strict';


  var exec = require('child_process').exec
    , options = {
      'maxBuffer': 100000 * 500
    }
    , NpmFactory = function NpmFactory($log) {

      var update = function update(lib, path, version, env, globally) {

          if (path) {

            var prefix = `--prefix ${path}`;
          }
          if (env) {

            var env = `--only:${env}`;
          }

          if (globally) {

            var glob = '-g';
          }

          return new Promise(function listPromise(resolve, reject) {

            if (path && version && lib) {
              console.log(`npm install ${glob || ''} ${lib}@${version} ${env || ''} ${prefix || ''} --save`);
              var process = exec(`npm install ${glob || ''} ${lib}@${version} ${env || ''} ${prefix || ''} --save`, options, function onList(err, stdout, stderr) {

                  if (err || stderr) {
                    $log.error('Error npm update', err, stderr);
                    reject(err + stderr);
                  }

                  resolve(stdout);
                });

                process.on('data', function (a,e,b) {
                console.log(a,e,b);
              });
            } else {

              $log.error('No version provided for npm update');
            }
          });
        }
        , list = function list(globally, path, env) {

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

          exec(`npm list ${glob || ''} --json --long ${prefix || ''}`, options, function onList(err, stdout, stderr) {

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
        'update': update,
        'list': list,
        'outdated': outdated
      };
    };
  angular.module('electron.npm.factories', [])
    .factory('npmFactory',['$log', NpmFactory]);
}(angular));
