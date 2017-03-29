/*global require navigator process Buffer*/
import angular from 'angular';
import NpmOperations from './npm-operations.js';
const moduleName = 'npm-api.service'
  , npm = require('npm')
  , stream = require('stream')
  , fs = require('fs')
  , cp = require('child_process')
  , exec = cp.exec;

angular.module(moduleName, [])
.service('npm', /*@ngInject*/ function NpmService($rootScope, $log, errorsService) {
  const writable = new stream.Writable({
    'write': (chunk, encoding, next) => {
      const thisLogBuffer = new Buffer(chunk)
        , thisLog = thisLogBuffer
          .toString()
          .trim();

      if (thisLog) {

        $rootScope.$emit('npm:log', thisLog);
      }

      next();
    }
  })
  , npmDefaultConfiguration = {
    'loglevel': 'info',
    'progress': false,
    'logstream': writable
  }
  , configureNpm = (folder, isGlobal) => new Promise((resolve, reject) => {

    if (!npm.config.loaded) {

      return npm.load(Object.assign({}, npmDefaultConfiguration), (err, configuredNpm) => {
        if (err) {

          return reject(err);
        }

        const npmOperations = new NpmOperations(folder, configuredNpm, isGlobal);

        return resolve(npmOperations);
      });
    }
    const npmOperations = new NpmOperations(folder, npm, isGlobal);

    return resolve(npmOperations);
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
/*, changePermission = folder => new Promise((resolve, reject) => {

    if (folder === '/usr') {

      throw new Error('This strategy isn\'t the best choice');
    }

    sudo.exec(`chown -R $(whoami):$(whoami) ${folder}/{lib/node_modules,bin,share}`, sudoOptions, err => {

      if (err) {

        return reject(err);
      }

      resolve();
    });
  })
  , changeGlobalFolder = () => new Promise((resolve, reject) => {

    exec(`mkdir ~/.npm-global &&
      npm config set prefix \'~/.npm-global\' &&
      echo "export PATH=~/.npm-global/bin:$PATH" >> ~/.profile &&
      source ~/.profile`, (err, stdout, stderr) => {

        if (err || stderr) {

          return reject(err || stderr);
        }

        resolve();
      });
  });*/

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
