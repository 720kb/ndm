import angular from 'angular';
import npmApi from '../npm/npm-api.js';
const moduleName = 'npm-ui.content';

angular.module(moduleName, [
  npmApi
])
.controller('ContentController', /*@ngInject*/ function ContentController($rootScope, $scope, $log, npmGlobal, npm, loadingFactory) {

  const unregisterTopBarActiveLinkListener = $rootScope.$on('top-bar:active-link', (eventInfo, data) => {
      //if selected package and clicked "update package" OR "install latest" OR "uninstall"
      if (data &&
        data.link === '2' ||
        data.link === '3' ||
        data.link === '5') {
        this.showLoadingSelectedRow = true;
      } else {

        this.showLoadingSelectedRow = false;
      }
    })
    , unregisterInstallVersionPackageListener = $rootScope.$on('top-bar:installing-version-package', () => {
        //while selected package and clicked "install release" and clicked prompt dialog button "ok" (while literally installing package new release)
        this.showLoadingSelectedRow = true;
      })
    , unregisterLeftBarDeleteSelectedProjectListener = $rootScope.$on('left-bar:delete-selected-project', () => {

      this.packageInformations = [];
      this.goBackHome = true;
    })
    , unregisterLeftBarSelectProjectListener = $rootScope.$on('left-bar:select-project', (eventInformation, payload) => {

    this.loading = true;
    this.loaded = false;
    this.goBackHome = false;
    this.showLoadingSelectedRow = false;

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

    unregisterInstallVersionPackageListener();
    unregisterTopBarActiveLinkListener();
    unregisterLeftBarDeleteSelectedProjectListener();
    unregisterLeftBarSelectProjectListener();
  });
});

export default moduleName;
