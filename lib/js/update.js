/*globals require,__dirname,window,process*/
import angular from 'angular';

const path = require('path');

angular.module('ndm-updater', [])
  .run(/*ngInject*/ $log => {

    const packageJSON = require(path.resolve(__dirname, '..', '..', 'package.json'))
      , onVersionFetched = res => new Promise(resolve => {
      let filterWith;

      if (process.platform === 'win32') {

        filterWith = element => element.name.indexOf('.exe');
      } else {

        filterWith = element => element.name.indexOf('.dmg');
      }

      if (res.name === `v${packageJSON.version}` ||
        process.platform === 'linux') { //Linux must be updated outside the application

        //Nothing to update
        resolve();
      }

      //There is something to update
      resolve(res.assets
        .filter(filterWith)
        .reduce(prev => prev).browser_download_url);
    });

    window.fetch('https://api.github.com/repos/720kb/ndm/releases/latest')
      .then(res => {

        if (res.ok) {

          return res.json();
        }

        throw new Error('Connectivity issues');
      })
      .then(onVersionFetched)
      .then(url => $log.info(url))
      .catch(() => {

        //Impossible to get latest version information
      });
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
