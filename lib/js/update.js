/*globals require,window*/
import angular from 'angular';

angular.module('ndm-updater', [])
  .constant('newerVersion', (() => {
    const qs = require('querystring');

    return qs.parse(window.location.search.replace('?', '')).newerVersion;
  })())
  .run(/*ngInject*/ ($log, newerVersion) => {

    $log.info(newerVersion);
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
