/*global angular require*/
(function withAngular(angular) {
  'use strict';


  var exec = require('child_process').exec
    , options = {
      'maxBuffer': 100000 * 500
    }
    , NpmFactory = function NpmFactory($rootScope, $window, $log) {

      var update = function update(lib, path, version, env, globally) {

          $rootScope.shellDebug = '';

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

              var outputErr = ''
                , cmd = `npm install ${glob || ''} ${lib}@${version} ${env || ''} ${prefix || ''} --save`
                , process = exec(cmd, options, function onList(err, stdout, stderr) {

                  if (err || stderr) {
                    //$log.error('Error npm update', err, stderr);
                    //reject(err + stderr);
                  }
                  resolve(stdout);
                });

                process.stderr.on('data', function onStdoutData(data) {
                  outputErr += data;

                });
                process.on('exit', function () {

                  if (outputErr) {

                    $window.dialog.showErrorBox('yoo', outputErr);
                  }
                });
            } else {

              $log.error('No version provided for npm update');
              reject();
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
    .factory('npmFactory',['$rootScope', '$window', '$log', NpmFactory]);
}(angular));
