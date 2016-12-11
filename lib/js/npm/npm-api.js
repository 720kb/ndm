/*global require,process,Buffer*/
import angular from 'angular';
import NpmOperations from './npm-operations.js';
const moduleName = 'npm-api.service'
  , freshy = require('freshy')
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
    const npm = freshy.reload(require.resolve('npm'));

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
      } catch (e) {
        return e;
      }
    }
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
  , runScript = (scriptName, folder) => new Promise((resolve, reject) => {
    exec(`npm run ${scriptName}`, {'cwd': folder}, err => {
      if (err) {
        return reject(err);
      }
      return resolve();
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

    fs.stat(`${stdout.trim()}/lib/node_modules`, (statError, stats) => {

      if (statError) {

        throw new Error(statError);
      }

      $rootScope.$apply(scope => {

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
  this.runScript = runScript;
});

export default moduleName;
