/*globals require,__dirname,process,window,Buffer*/
import angular from 'angular';

const path = require('path')
  , {remote} = require('electron')
  , fs = require('fs')
  , AdmZip = require('adm-zip')
  , fse = require('fs-extra')
  , tmpDirectory = require('os').tmpdir()
  , tmpFolder = path.resolve(tmpDirectory, 'ndm-')
  , packageJSON = require(path.resolve(__dirname, '..', 'package.json'));

angular.module('ndm-updater', [])
  .constant('updateUrl', 'https://api.github.com/repos/720kb/ndm/releases/latest')
  .controller('ShellController', /* @ngInject */function ShellController(
    $scope,
    $document,
    $log,
    updateUrl
  ) {
    const onUpdateCheckEnd = event => {

        let updateMetaInfo
          , indexOfZipName;

        if (process.platform === 'darwin') {
          indexOfZipName = 'mac.zip';
        } else if (process.platform === 'win32') {
          indexOfZipName = 'win.zip';
        }

        $scope.$apply(() => {

          this.checking = false;
          if (!event.target.responseText) {

            this.error = 'No response';
            this.errorChecking = true;
            return;
          }

          try {

            updateMetaInfo = JSON.parse(event.target.responseText);
            $log.info('Github Fetched Metas', updateMetaInfo);
          } catch (parsingError) {

            this.error = parsingError;
            this.errorChecking = true;
            return;
          }

          if (updateMetaInfo.tag_name === `v${packageJSON.version}` ||
            updateMetaInfo.tag_name.indexOf('v') === -1) {

            //Nothing to update
            this.toUpdate = false;
            return;
          }

          //There is something to update
          this.nextVesion = updateMetaInfo.name.replace('v', '');
          this.toUpdate = true;
          this.url = updateMetaInfo.assets
            .filter(element => element.name.indexOf(indexOfZipName) > -1)
            .reduce(prev => prev).browser_download_url;
        });
      }
    , onUpdateCheckErr = () => {

      $scope.$apply(() => {

        this.checking = false;
        this.errorChecking = true;
      });
    }
    , onUpdateErr = () => {

      $scope.$apply(() => {

        this.checking = false;
        this.errorUpdating = true;
        this.progress = 100;
      });
    }
    , onUpdateEnd = event => {

      fs.mkdtemp(tmpFolder, (err, folder) => {
        const fileToSave = path.resolve(folder, `npm_${new Date().getTime()}`);
        let newResources;

        if (process.platform === 'darwin') {
          newResources = path.resolve(folder, path.join('ndm.app', 'Contents', 'Resources', 'app'));
        } else if (process.platform === 'win32') {
          newResources = path.resolve(folder, path.join('win-ia32-unpacked', 'resources', 'app'));
        }

        if (err) {

          throw err;
        }

        fs.appendFile(fileToSave, new Buffer(event.target.response), appendErr => {

          if (appendErr) {

           throw appendErr;
          }
          try {
            const zip = new AdmZip(fileToSave);

            zip.extractAllTo(/*target path*/folder, /*overwrite*/true);
          } catch (excp) {
            $log.warn(excp);
          }

          fse.move(newResources, remote.app.getAppPath(), {
            'overwrite': true
          }, moveErr => {

            if (moveErr) {

              throw moveErr;
            }
            remote.app.relaunch();
            remote.app.exit(0);
          });
        });
      });
    }
    , onUpdateProgress = event => {

      $scope.$apply(() => {

        if (event.lengthComputable) {
          this.progress = (event.loaded / event.total) * 100;
        } else {

          this.progress = (this.progress + 10) % 100;
        }
      });
    };

    this.checkNow = () => {
      if (!this.checking) {

        this.errorChecking = false;
        this.checking = true;
        const updateRequest = new window.XMLHttpRequest();

        delete this.toUpdate;
        updateRequest.addEventListener('load', onUpdateCheckEnd);
        updateRequest.addEventListener('error', onUpdateCheckErr);
        updateRequest.open('GET', updateUrl);
        updateRequest.send();
      }
    };

    this.updateIt = () => {
      if (!this.updating) {

        this.errorUpdating = false;
        this.updating = true;
        const updating = new window.XMLHttpRequest();

        delete this.toUpdate;
        updating.addEventListener('load', onUpdateEnd);
        updating.addEventListener('error', onUpdateErr);
        updating.addEventListener('progress', onUpdateProgress);

        updating.open('GET', this.url);
        updating.responseType = 'arraybuffer';
        updating.send();
      }
    };

    this.currentVersion = packageJSON.version;
    this.checkNow();

    $document[0].addEventListener('visibilitychange', () => {
      if ($document[0].visibilityState === 'visible' &&
      !this.checking &&
      !this.updating) {
        this.checkNow();
      }
    });
  });
