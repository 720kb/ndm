import angular from 'angular';
import npmApi from '../npm/npm-api.js';
const moduleName = 'npm-ui.content';

angular.module(moduleName, [
  npmApi
])
.controller('ContentController', /*@ngInject*/ function ContentController($rootScope, $scope, $log, npmGlobal, npm, loadingFactory) {

  const unregisterLeftBarDeleteSelectedProjectListener = $rootScope.$on('left-bar:delete-selected-project', () => {

      this.packageInformations = [];
      this.goBackHome = true;
    })
    , unregisterLeftBarSelectProjectListener = $rootScope.$on('left-bar:select-project', (eventInformation, payload) => {

    this.loading = true;
    this.loaded = false;
    this.goBackHome = false;

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

          loadingFactory.finished();

          $scope.$apply(() => {

            this.packageInformations = infos;
            this.loaded = true;
          });
        })
        .catch(error => {

          loadingFactory.finished();
          $log.error(error);
        }))
      .catch(error => {
        loadingFactory.finished();
        $log.error(error);
      });
    } else {

      $log.error(`Path is missing in ${payload}`);
    }
  });

  $scope.$on('$destroy', () => {

    unregisterLeftBarDeleteSelectedProjectListener();
    unregisterLeftBarSelectProjectListener();
  });
});

export default moduleName;
