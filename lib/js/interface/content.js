import angular from 'angular';
import npmApi from '../npm/npm-api.js';
const moduleName = 'npm-ui.content';

angular.module(moduleName, [
  npmApi
])
.controller('ContentController', /*@ngInject*/ function ContentController($rootScope, $scope, $log, npmGlobal, npm, loadingFactory) {

  const unregisterShellSelectedPackages = $rootScope.$on('shell:selected-packages', (eventInformation, data) => {
        //selected packages could be multiple, just get only the first one in array
        if (data &&
          data[0]) {
          //update package infos for view
          this.loadPackagesInfos(data[0].name);
        }
      })
      , unregisterTopBarActiveLinkListener = $rootScope.$on('top-bar:active-link', (eventInfo, data) => {
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
    , unregisterInstallVersionPackageErrorListener = $rootScope.$on('top-bar:installing-version-package-error', () => {
        //while selected package and clicked "install" + version, if no version available it shows an error message and we must remove active loading status from that package row in table
        $scope.$apply(() => {
          this.showLoadingSelectedRow = false;
        });
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

      loadingFactory.loading();

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

  this.loadPackagesInfos = packageName => {
    let folder = '/'; //not really needed

    npm.npmInFolder(folder).then(npmInFolder => {
      npmInFolder.view(packageName).then(packageInfos => {
        try {
          $scope.$apply(() => {
            this.packageViewInfos = packageInfos[Object.keys(packageInfos)[0]];
          });
        } catch (e) {
          $log.warn(e);
        };
      }).catch(err => {
        $log.warn(`Problem with npm view ${packageName} in folder ${folder}`, err);
      });
    }).catch(err => {
      $log.warn(`Problem configuring npm for $ npm view ${packageName} in folder ${folder}`, err);
    });
  };
  //array of selected packages in table, we must init the array
  this.selectedPackages = [];

  $scope.$on('$destroy', () => {

    unregisterInstallVersionPackageListener();
    unregisterInstallVersionPackageErrorListener();
    unregisterTopBarActiveLinkListener();
    unregisterLeftBarDeleteSelectedProjectListener();
    unregisterLeftBarSelectProjectListener();
    unregisterShellSelectedPackages();
  });
});

export default moduleName;
