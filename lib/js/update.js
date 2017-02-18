/*globals require,__dirname,window,process,Buffer*/
import angular from 'angular';

const path = require('path')
  //, {remote} = require('electron')
  , fs = require('fs')
  //, fse = require('fs-extra')
  , tmpDirectory = require('os').tmpdir()
  , tmpFolder = path.resolve(tmpDirectory, 'ndm-')
  , packageJSON = require(path.resolve(__dirname, '..', 'package.json'));

angular.module('ndm-updater', [])
  .constant('updateUrl', 'https://api.github.com/repos/720kb/ndm/releases/latest')
  .controller('ShellController', /* @ngInject */function ShellController(
    $scope,
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
            .filter(element => element.name.indexOf('.zip') >= 0)
            .reduce(prev => prev).browser_download_url;
        });
      }
    , onUpdateCheckErr = () => {

      $scope.$apply(() => {

        this.checking = false;
        this.error = 'Error during checking updates, please retry later';
      });
    }
    , onUpdateErr = () => {

      $scope.$apply(() => {

        this.checking = false;
        this.error = 'Error during updating, please retry later';
      });
    }
    , onUpdateEnd = event => {

      fs.mkdtemp(tmpFolder, (err, folder) => {
        const fileToSave = path.resolve(folder, `npm_${new Date().getTime()}`);

        if (err) {

          throw err;
        }

        fs.appendFile(fileToSave, new Buffer(event.target.response), appendErr => {

          if (appendErr) {

            throw appendErr;
          }

          // fse.move(fileToSave, remote.app.getAppPath(), {
          //   'overwrite': true
          // }, moveErr => {
          //
          //   if (moveErr) {
          //
          //     throw moveErr;
          //   }
          //   remote.app.relaunch();
          // });
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
      const updateRequest = new window.XMLHttpRequest();

      delete this.toUpdate;
      this.checking = true;
      updateRequest.addEventListener('load', onUpdateCheckEnd);
      updateRequest.addEventListener('error', onUpdateCheckErr);
      updateRequest.open('GET', updateUrl);
      updateRequest.send();
    };

    this.updateIt = () => {

      this.updating = true;
      const updating = new window.XMLHttpRequest();

      delete this.toUpdate;
      updating.addEventListener('load', onUpdateEnd);
      updating.addEventListener('error', onUpdateErr);
      updating.addEventListener('progress', onUpdateProgress);

      updating.open('GET', this.url);
      updating.responseType = 'arraybuffer';
      updating.send();
    };

    this.currentVersion = packageJSON.version;
    this.checkNow();
  });
