/*global require*/
import angular from 'angular';
const moduleName = 'npm-api.service'
  , npm = require('npm');

angular.module(moduleName, [])
.service('npm', /*@ngInject*/ function NpmService() {

  this.npmInFolder = folder => {

    const toReturn = new Promise((resolve, reject) => {

      npm.load({
        'prefix': folder
      }, (err, configuredNpm) => {
        if (err) {

          return reject(err);
        }

        return resolve({
          'outdated': () => new Promise((rejectOutdated, resolveOutdated) => {

            configuredNpm.commands.outdated([], true, (outdatedError, packageInformations) => {

              if (outdatedError) {

                return rejectOutdated(outdatedError);
              }

              return resolveOutdated(packageInformations);
            });
          })
        });
      });
    });

    return toReturn;
  };
});

export default moduleName;
