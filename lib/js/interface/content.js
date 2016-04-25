import angular from 'angular';
import npmApi from '../npm/npm-api.js';
const moduleName = 'npm-ui.content';

angular.module(moduleName, [
  npmApi
])
.controller('ContentController', /*@ngInject*/ function ContentController($rootScope, $scope, $log, npmGlobal, npm) {

  const unregisterLeftBarSelectProjectListener = $rootScope.$on('left-bar:select-project', (eventInformation, payload) => {
    if (payload &&
      payload.path) {
      let npmPromise;

      if (payload.path === npmGlobal) {

        npmPromise = npm.npmGlobal();
      } else {

        npmPromise = npm.npmInFolder(payload.path);
      }

      npmPromise.then(npmInFolder =>
        npmInFolder.listOutdated()
        .then(infos => {

          $scope.$apply(() => {

            this.packageInformations = infos;
            this.loaded = true;
          });
        })
        .catch(error => $log.error(error)))
      .catch(error => $log.error(error));
    } else {

      $log.error(`Path is missing in ${payload}`);
    }
  })
  , unregisterNpmLogListener = $rootScope.$on('npm:log', (eventInformation, payload) => {

    $log.info(payload);
  });

  $scope.$on('$destroy', () => {

    unregisterLeftBarSelectProjectListener();
    unregisterNpmLogListener();
  });
});

export default moduleName;
