/*global angular require*/

  import angular from 'angular';

  const exec = require('child_process').exec
      , options = {
        'maxBuffer': 2024 * 500
      };

  angular.module('npm-ui.npm', [])
    .factory('npmFactory', /*@ngInject*/ ($rootScope, $window, $log) => {

      const update = (lib, path, version, env, globally) => {

        $rootScope.shellDebug = '';

        if (path) {

          let prefix = `--prefix ${path}`;
        }
        if (env) {

          let env = `--only:${env}`;
        }

        if (globally) {

          let glob = '-g';
        }

        return new Promise((resolve, reject) => {

          if (path && version && lib) {

            let outputErr = ''
              , cmd = `npm install ${glob || ''} ${lib}@${version} ${env || ''} ${prefix || ''} --save`
              , process = exec(cmd, options, (err, stdout, stderr) => {

                if (err || stderr) {
                  //$log.error('Error npm update', err, stderr);
                  reject(err + stderr);
                }

                resolve(stdout);
              });

            process.stderr.on('data', (data) => {

              outputErr += data;
            });
            process.on('exit', () => {

              if (outputErr) {
                reject();
                $window.dialog.showErrorBox('npm', outputErr);
              }
            });

            process.on('kill', (data) => {
              reject();
              $window.dialog.showErrorBox('npm', data);
            });
          } else {

            $log.error('No version provided for npm update');
            reject();
          }
        });
      }
      , list = (globally, path, env) => {

        if (globally) {

          let glob = '-g';
        }
        if (path) {

          let prefix = `--prefix ${path}`;
        }
        if (env) {

          let env = `--${env}`;
        }

        return new Promise((resolve, reject) => {

          let outputErr = ''
            , process = exec(`npm list ${glob || ''} --json --long --depth=0 ${prefix || ''}`, options, (err, stdout, stderr) => {

            if (stdout) {

              resolve(stdout);
            }

            if (err || stderr) {

              //$log.error('Error npm list', err, stderr);
              $window.dialog.showErrorBox('npm', err + stderr);
            }
          });
        });
      }
      , outdated = (globally, path, env) => {

        if (globally) {

          let glob = '-g';
        }

        if (path) {

          let prefix = `--prefix ${path}`;
        }

        if (env) {
          let env = `--${env}`;
        }

        return new Promise((resolve, reject) => {

          exec(`npm outdated ${glob || ''} --json ${env || ''} ${prefix || ''}`, options, (err, stdout, stderr) => {

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
    });

  export default 'npm-ui.npm';
