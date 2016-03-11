/*global angular require*/
(function withAngular(angular) {
  'use strict';


  var exec = require('child_process').exec
    , options = {
      'maxBuffer': 2024 * 500
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
                    reject(err + stderr);
                  }

                  resolve(stdout);
                });

                process.stderr.on('data', function onStdoutData(data) {

                  outputErr += data;
                });
                process.on('exit', function onExit() {

                  if (outputErr) {
                    reject();
                    $window.dialog.showErrorBox('npm', outputErr);
                  }
                });

                process.on('kill', function onKilled(data) {
                  reject();
                  $window.dialog.showErrorBox('npm', data);
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

          var outputErr = ''
            , process = exec(`npm list ${glob || ''} --json --long --depth=0 ${prefix || ''}`, options, function onList(err, stdout, stderr) {

            if (err || stderr) {

              //$log.error('Error npm list', err, stderr);
              $window.dialog.showErrorBox('npm', err + stderr);
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
            console.log(err, stdout, stderr);
            if (err || stderr) {

              $log.error('Error npm outdated', err, stderr);
              $window.dialog.showErrorBox('npm', err, stderr);
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
