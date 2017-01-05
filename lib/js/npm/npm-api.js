/*global require,process,Buffer*/
import angular from 'angular';
import NpmOperations from './npm-operations.js';
const moduleName = 'npm-api.service'
  , npm = require('npm')
  , stream = require('stream')
  , fs = require('fs')
  , cp = require('child_process')
  , exec = cp.exec
  , sudo = require('electron-sudo')
  , sudoOptions = {
    'name': 'ndm',
    'icns': 'icon.icns',
    'on': function onSudo(/*ps*/) {
      /*ps.stdout.on('data', function onSudoStdout(data) {

        //  $log.info(data);
      });

      setTimeout(() => {
        ps.kill();
      }, 50000);*/
    }
  };

angular.module(moduleName, [])
.service('npm', /*@ngInject*/ function NpmService($rootScope, $log, errorsService) {
  const writable = new stream.Writable({
    'write': (chunk, encoding, next) => {
      const thisLogBuffer = new Buffer(chunk)
        , thisLog = thisLogBuffer.toString();

      $rootScope.$emit('npm:log', thisLog);
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

      return npm.load(Object.assign({}, npmDefaultConfiguration, {'prefix': folder}), (err, configuredNpm) => {
        if (err) {

          return reject(err);
        }

        const npmOperations = new NpmOperations(configuredNpm, isGlobal);

        return resolve(npmOperations);
      });
    }

    npm.config.prefix = folder;
    const npmOperations = new NpmOperations(npm, isGlobal);

    return resolve(npmOperations);
  })
  , changePermission = folder => new Promise((resolve, reject) => {

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
  , isNpmInstalled = () => {
      try {
        cp.execSync('npm -v');
        return true;
      } catch (excp) {
        $log.error('Troubles running: npm -v , when checking if npm is installed', excp);
        return excp;
      }
    }
  , pingRegistry = () => new Promise((resolve, reject) => {
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
  });

  exec('npm root -g', (err, stdout, stderr) => {

    if (err || stderr) {

      throw new Error(err || stderr);
    }

    this.npmGlobal = () => {

      return configureNpm(stdout.replace('/node_modules', '').trim(), true);
    };
  });

  exec('npm config get prefix', (err, stdout, stderr) => {

    let libNodeModulesExt = ''; //important

    if (err || stderr) {

      throw new Error(err || stderr);
    }

    if (process.platform &&
      process.platform !== 'win32') {
      //not on windows
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

  this.npmInFolder = configureNpm;
  this.changePermission = changePermission;
  this.changeGlobalFolder = changeGlobalFolder;
  this.getNpmOutdatedVersion = getNpmOutdatedVersion;
  this.getNpmVersion = getNpmVersion;
  this.isNpmInstalled = isNpmInstalled;
  this.pingRegistry = pingRegistry;
});

export default moduleName;
