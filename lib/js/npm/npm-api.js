/*global require*/
import angular from 'angular';
const moduleName = 'npm-api.service'
  , freshy = require('freshy')
  , exec = require('child_process').exec;

angular.module(moduleName, [])
.service('npm', /*@ngInject*/ function NpmService() {

  exec('npm root -g', (errr, stdout, stderr) => {

    if (errr || stderr) {

      throw new Error(errr || stderr);
    }

    this.npmGlobal = () => {

      const toReturn = new Promise((resolve, reject) => {
        const npm = freshy.reload('npm');

        npm.load({
          'prefix': stdout.replace('/node_modules', '')
        }, (err, configuredNpm) => {
          if (err) {

            return reject(err);
          }

          return resolve({
            'root': () => new Promise((rejectRoot, resolveRoot) => {

              configuredNpm.commands.root([], (rootError, rootInfo) => {

                if (rootError) {

                  return rejectRoot(rootError);
                }

                return resolveRoot(rootInfo);
              });
            }),
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

  this.npmInFolder = folder => {

    const toReturn = new Promise((resolve, reject) => {
      const npm = freshy.reload('npm');

      npm.load({
        'prefix': folder
      }, (err, configuredNpm) => {
        if (err) {

          return reject(err);
        }

        return resolve({
          'root': () => new Promise((rejectRoot, resolveRoot) => {

            configuredNpm.commands.root([], (rootError, rootInfo) => {

              if (rootError) {

                return rejectRoot(rootError);
              }

              return resolveRoot(rootInfo);
            });
          }),
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
