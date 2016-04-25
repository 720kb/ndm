/*global require,Buffer*/
import angular from 'angular';
import NpmOperations from './npm-operations.js';
const moduleName = 'npm-api.service'
  , dialog = require('electron').remote.dialog
  , freshy = require('freshy')
  , stream = require('stream')
  , exec = require('child_process').exec;

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
  });

  exec('npm root -g', (errr, stdout, stderr) => {

    if (errr || stderr) {

      throw new Error(errr || stderr);
    }

    this.npmGlobal = () => {

      return configureNpm(stdout.replace('/node_modules', ''), true);
    };
  });

  this.npmInFolder = configureNpm;

  this.updateNpmGlobally = () => {
    const npmLib = {
      'name': 'npm'
    };

    return new Promise((resolve, reject) => {

      this.npmGlobal()
        .catch(error => dialog.showErrorBox(`Configuring npm for installing latest ${npmLib.name}...`, error))
        .then(npmInFolder =>
          npmInFolder.installLatest(npmLib)
          .then(() => resolve())
          .catch(error => reject(error)));
    });
  };
});

export default moduleName;
