/*global require navigator process,__dirname*/
import angular from 'angular';
const moduleName = 'npm-api.service'
  , fs = require('fs')
  , path = require('path')
  , cp = require('child_process')
  , exec = cp.exec;

angular.module(moduleName, [])
.service('npm', /*@ngInject*/ function NpmService($rootScope, $log, errorsService) {
  const configureNpm = (folder, isGlobal) => new Promise(resolve => {
    const forkFactory = (command, param1, param2) => new Promise(forkFactoryResolved => {
      const theParams = [folder, isGlobal].concat([command, param1, param2])
      , child = cp.fork(path.resolve(__dirname, 'npm-runner.js'), theParams, {
        'cwd': __dirname,
        'silent': true
      });

      child.stdout.on('data', data => {

        $log.info(`stdout: ${data}`);
      });

      child.stderr.on('data', data => {

        $log.error(`stderr: ${data}`);
      });

      child.on('close', code => {

        $log.info(`child process exited with code ${code}`);
      });

      child.on('message', message => {

        if (command === message.type) {

          forkFactoryResolved(message.payload);
        } else if (message.type === 'log') {

          $rootScope.$emit('npm:log:log', {
            'type': command,
            'data': message.payload
          });
        } else {

          $log.trace(message);
        }
      });
    });

    resolve({
      'launchInstall': () => {
        return forkFactory('launchInstall');
      },
      'search': keyword => {
        return forkFactory('search', keyword);
      },
      'run': scriptName => {
        return forkFactory('run', scriptName);
      },
      'view': packageName => {
        return forkFactory('view', packageName);
      },
      'build': buildFolder => {
        return forkFactory('build', buildFolder);
      },
      'rebuild': () => {
        return forkFactory('rebuild');
      },
      'install': (dependency, version) => {
        return forkFactory('install', dependency, version);
      },
      'installLatest': dependency => {
        return forkFactory('installLatest', dependency);
      },
      'update': dependency => {
        return forkFactory('update', dependency);
      },
      'rm': dependency => {
        return forkFactory('rm', dependency);
      },
      'listOutdated': () => {
        return forkFactory('listOutdated');
      },
      'outdated': () => {
        return forkFactory('outdated');
      },
      'prune': () => {
        return forkFactory('prune');
      },
      'dedupe': () => {
        return forkFactory('dedupe');
      },
      'list': () => {
        return forkFactory('list');
      },
      'shrinkwrap': () => {
        return forkFactory('shrinkwrap');
      },
      'doctor': () => {
        return forkFactory('doctor');
      },
      'root': () => {
        return forkFactory('root');
      }
    });
  })
  , getNpmVersion = () => new Promise(resolve => {
    exec('npm -v', (err, stdout, stderr) => {
      let npmVersion;

      $log.warn(err, stderr);

      if (stdout &&
        stdout.length > 0) {
        npmVersion = stdout.toString();
      }
      resolve(npmVersion);
    });
  })
  , isNpmInstalled = () => new Promise((resolve, reject) => {
    cp.exec('npm -v', err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  })
  , pingRegistry = () => new Promise((resolve, reject) => {
      if (navigator.onLine) {
        exec('npm ping registry', (err, stdout, stderr) => {

        if (err) {
          $log.warn('Ping registry', err, stderr);
          reject(err);
        }

        if (stdout &&
          stdout.length > 0) {
          resolve(stdout.toString());
        } else {
          reject();
        }
      });
    } else {
      $log.warn('You are offline: unable to ping registry.');
      reject();
    }
  })
  , getNpmOutdatedVersion = () => new Promise(resolve => {
    exec('npm outdated npm -g --json', (err, stdout, stderr) => {

      let npmOutdatedJson = {};

      //do not reject
      $log.warn(err, stderr);
      if (stdout &&
        stdout.length > 0) {
        npmOutdatedJson = JSON.parse(stdout);

      }
      resolve(npmOutdatedJson);
    });
  });

  this.updateNpmGlobally = () => {
    const npmLib = {
      'name': 'npm'
    };

    return new Promise((resolve, reject) => {

      this.npmGlobal()
        .catch(error => errorsService.showErrorBox('Npm error', `Error configuring npm for installing latest ${npmLib.name}: ${error} `))
        .then(npmInFolder => {

          $rootScope.$emit('npm:log:start');
          npmInFolder.installLatest(npmLib)
            .then(() => {

              $rootScope.$emit('npm:log:stop');
              resolve();
            })
            .catch(error => {

              $rootScope.$emit('npm:log:stop');
              reject(error);
            });
        });
    });
  };

  $rootScope.$on('dom:ready', () => {
    $log.info('DOM is ready for npm');
    //sync shell path or app will not work, yep.
    process.env.PATH = require('shell-path').sync();

    exec('npm root -g', (err, stdout, stderr) => {

      if (err || stderr) {

        throw new Error(err || stderr);
      }

      this.npmGlobal = () => {
        return configureNpm(stdout.replace('/node_modules', '').replace('\\node_modules', '').trim(), true);
      };
      $rootScope.$emit('npm:ready');
    });

    exec('npm config get prefix', (err, stdout, stderr) => {

      let libNodeModulesExt = ''; //important

      if (err || stderr) {

        throw new Error(err || stderr);
      }

      if (process.platform &&
        process.platform !== 'win32') {
        //on windows it doesn't exists
        libNodeModulesExt = '/lib/node_modules';
      }

      fs.stat(`${stdout.trim()}${libNodeModulesExt}`, (statError, stats) => {

        if (statError) {

          $log.err(statError);
        }

        if (process.platform === 'win32') {
          //win if error occur it means that folder is not writable and so we set the check to fail.
          if (statError) {
            $rootScope.$apply(scope => {

              scope.$emit('npm:global-privilege-check', {
                'user': -1,
                'processUser': 1,
                'group': -1,
                'processGroup': 1
              });
            });
          }

          return $rootScope.$apply(scope => {

            scope.$emit('npm:global-privilege-check', {
              'user': 1,
              'processUser': 1,
              'group': 1,
              'processGroup': 1
            });
          });
        }

        return $rootScope.$apply(scope => {

          scope.$emit('npm:global-privilege-check', {
            'user': stats.uid,
            'processUser': process.getuid(),
            'group': stats.gid,
            'processGroup': process.getgid()
          });
        });
      });
    });
  });

  this.npmInFolder = configureNpm;
  //this.changePermission = changePermission;
  //this.changeGlobalFolder = changeGlobalFolder;
  this.getNpmOutdatedVersion = getNpmOutdatedVersion;
  this.getNpmVersion = getNpmVersion;
  this.isNpmInstalled = isNpmInstalled;
  this.pingRegistry = pingRegistry;
});

export default moduleName;
