/*global require,process,Buffer*/
import angular from 'angular';
import NpmOperations from './npm-operations.js';
const moduleName = 'npm-api.service'
  , electron = require('electron')
  , dialog = electron.remote.dialog
  , freshy = require('freshy')
  , stream = require('stream')
  , fs = require('fs')
  , exec = require('child_process').exec
  , sudo = require('electron-sudo')
  , sudoOptions = {
    'name': 'ndm',
    'icns': 'icon.icns',
      'on': function onSudo(ps) {
        ps.stdout.on('data', function onSudoStdout(data) {

        //  console.info(data);
        });

        setTimeout(() => {
          ps.kill();
        }, 50000);
      }
    };

angular.module(moduleName, [])
.service('npm', /*@ngInject*/ function NpmService($rootScope) {
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
    const npm = freshy.reload('npm');

    npmDefaultConfiguration.prefix = folder;
    npm.load(npmDefaultConfiguration, (err, configuredNpm) => {
      if (err) {

        return reject(err);
      }
      const npmOperations = new NpmOperations(configuredNpm, isGlobal);

      return resolve(npmOperations);
    });
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

      return configureNpm(stdout.replace('/node_modules', ''), true);
    };
  });

  exec('npm config get prefix', (err, stdout, stderr) => {

    if (err || stderr) {

      throw new Error(err || stderr);
    }

    fs.stat(stdout.trim(), (statError, stats) => {

      if (statError) {

        throw new Error(statError);
      }

      $rootScope.$apply(scope => {

        scope.$emit('npm:global-privilege-check', {
          'group': stats.gid,
          'processGroup': process.getgid()
        });
      });
    });
  });

  this.npmInFolder = configureNpm;
  this.changePermission = changePermission;
  this.changeGlobalFolder = changeGlobalFolder;

  this.updateNpmGlobally = () => {
    const npmLib = {
      'name': 'npm'
    };

    return new Promise((resolve, reject) => {

      this.npmGlobal()
        .catch(error => dialog.showErrorBox('Npm error', `Error configuring npm for installing latest ${npmLib.name}: ${error} `))
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
});

export default moduleName;
