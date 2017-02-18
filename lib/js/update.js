/*globals require,__dirname,window,process*/
import angular from 'angular';

const path = require('path')
  , packageJSON = require(path.resolve(__dirname, '..', 'package.json'));

angular.module('ndm-updater', [])
  .constant('updateUrl', 'https://api.github.com/repos/720kb/ndm/releases/latest')
  .constant('os', (() => {
    let filterWith = () => 'linux';

    if (process.platform === 'win32') {

      filterWith = element => element.name.indexOf('.exe');
    } else if (process.platform === 'darwin') {

      filterWith = element => element.name.indexOf('.dmg');
    }

    return filterWith;
  })())
  .controller('ShellController', /* @ngInject */function ShellController(
    $scope,
    os,
    updateUrl
  ) {
    const onUpdateCheckEnd = event => {
        let updateMetaInfo;

        $scope.$apply(() => {

          this.checking = false;
          if (!event.target.responseText) {

            this.error = 'No response';
            return;
          }

          try {

            updateMetaInfo = JSON.parse(event.target.responseText);
          } catch (parsingError) {

            this.error = parsingError;
          }

          if (updateMetaInfo.name === `v${packageJSON.version}` ||
            process.platform === 'linux') { //Linux must be updated outside the application

            //Nothing to update
            this.toUpdate = false;
            return;
          }

          //There is something to update
          this.nextVesion = updateMetaInfo.name.replace('v', '');
          this.toUpdate = true;
          this.url = updateMetaInfo.assets
            .filter(os)
            .reduce(prev => prev).browser_download_url;
        });
      }
    , onUpdateCheckErr = () => {
      $scope.$apply(() => {

        this.checking = false;
        this.error = 'Error during download, retry';
      });
    };

    this.checkNow = () => {
      const updateRequest = new window.XMLHttpRequest();

      delete this.toUpdate;
      this.checking = true;
      updateRequest.addEventListener('load', onUpdateCheckEnd);
      updateRequest.addEventListener('error', onUpdateCheckErr);
      updateRequest.open('GET', updateUrl);
      updateRequest.send();
    };

    this.currentVersion = packageJSON.version;
    this.checkNow();
  });
/*

, fs = require('fs')
, exec = require('child_process').execFile
  , tmpFolder = path.resolve(path.sep, 'tmp', path.sep, 'ndm-');

fs.mkdtemp(tmpFolder, (err, folder) => {
  if (err) {

    throw err;
  }
  fetch(toDownload)
    .then(downloadedFile => {
        const fileToSave = path.resolve(folder, downloadedFile)
          , dest = fs.createWriteStream(fileToSave);

        dest.on('finish', () => {

          exec(fileToSave, execErr => {
            if (execErr) {

              throw execErr;
            }
          });
        });

        downloadedFile.body.pipe(dest);
    });
});*/
