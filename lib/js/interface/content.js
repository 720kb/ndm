import angular from 'angular';
import npmApi from '../npm/npm-api.js';
const moduleName = 'npm-ui.content';

angular.module(moduleName, [
  npmApi
])
.controller('ContentController', /*@ngInject*/ function ContentController($rootScope, $scope, $log) {

  const unregisterLeftBarDeleteProjectListener = $rootScope.$on('left-bar:delete-project', (eventInfo, data) => {
      if (data &&
        data.project &&
        data.project.path) {
        this.closeProjectTab(data.project.path);
      }
    })
    , unregisterLeftBarSelectProjectListener = $rootScope.$on('left-bar:select-project', (eventInformation, payload) => {
      $log.info('Selected project payload', payload);
      if (payload &&
        payload.path) {
        if (!this.tabs.includes(payload.path)) {
          this.tabs.unshift(payload.path);
        }
        //show active tab
        this.activeTab = payload.path;
      }
  });

  this.closeProjectTab = tab => {
    $log.log('before', this.tabs);
    if (tab) {
      if (this.tabs.includes(tab)) {
        this.tabs.forEach((value, index) => {
          if (value === tab) {
            this.tabs.splice(index, 1);
          }
        });
        //show active tab
        this.activeTab = this.tabs[0] ? this.tabs[0] : undefined;
        $log.log('after', this.tabs);
      }
    }
  };

  this.tabs = [];
  $scope.$on('$destroy', () => {
    unregisterLeftBarSelectProjectListener();
    unregisterLeftBarDeleteProjectListener();
  });
})
.directive('npmTabs', /*@ngInject*/ function npmTabs($rootScope, $log, npmGlobal, npm) {
  return (scope, element, attrs) => {

    const tabIdentifierPath = attrs.npmTabId
      , unregisterOnContentPackageInfosListener = $rootScope.$on('content:selected-package-info', (eventInfo, data) => {
        if (data &&
          data.info) {
          scope.$apply(() => {
            scope.selectedPackageViewInfos = data.info;
          });
        } else {
          scope.$apply(() => {
            scope.selectedPackageViewInfos = false;
          });
        }
      })
      , unregisterTopBarActiveLinkListener = $rootScope.$on('top-bar:active-link', (eventInfo, data) => {
        //if selected package and clicked "update package" OR "install latest" OR "uninstall"
        if (data &&
          data.link === '2' ||
          data.link === '3' ||
          data.link === '5') {
          scope.showLoadingSelectedRow = true;
        } else {
          scope.showLoadingSelectedRow = false;
        }
      })
      , unregisterInstallVersionPackageListener = $rootScope.$on('top-bar:installing-version-package', () => {
          //while selected package and clicked "install release" and clicked prompt dialog button "ok" (while literally installing package new release)
          scope.showLoadingSelectedRow = true;
        })
      , unregisterInstallVersionPackageErrorListener = $rootScope.$on('top-bar:installing-version-package-error', () => {
          //while selected package and clicked "install" + version, if no version available it shows an error message and we must remove active loading status from that package row in table
          scope.$apply(() => {
            scope.showLoadingSelectedRow = false;
          });
        })
      , unregisterLeftBarDeleteSelectedProjectListener = $rootScope.$on('left-bar:delete-selected-project', () => {
        scope.packageInformations = [];
        scope.goBackHome = true;
      });

    scope.loadPackagesInfos = packageName => {
      let folder = '/'; //not really needed probably

      scope.packageViewInfos = false;

      npm.npmInFolder(folder).then(npmInFolder => {
        npmInFolder.view(packageName).then(packageInfos => {
          try {
            scope.$apply(() => {
              scope.packageViewInfos = packageInfos[Object.keys(packageInfos)[0]];
            });
          } catch (e) {
            scope.$apply(() => {
              scope.packageViewInfos = false;
            });
            $log.warn(e);
          }
          $rootScope.$emit('content:selected-package-info', {'package': packageName, 'info': scope.packageViewInfos});
        }).catch(err => {
          scope.$apply(() => {
            scope.packageViewInfos = false;
          });
          $log.warn(`Problem with npm view ${packageName} in folder ${folder}`, err);
        });
      }).catch(err => {
        scope.$apply(() => {
          scope.packageViewInfos = false;
        });
        $log.warn(`Problem configuring npm for $ npm view ${packageName} in folder ${folder}`, err);
      });
    };

    scope.selectPackages = packages => {
      scope.currentSelectedPackages = packages;
      scope.showMenuButtons = true;
      scope.loadPackagesInfos(packages[0].name);
    };

    scope.sortTableBy = by => {
      if (!scope.tableOrderBy.includes(by) &&
        !scope.tableOrderBy.includes(`-${by}`)) {
        scope.tableOrderBy.unshift(by);
      } else if (scope.tableOrderBy.includes(by) &&
        !scope.tableOrderBy.includes(`-${by}`)) {
        scope.tableOrderBy.splice(scope.tableOrderBy.indexOf(by), 1);
        scope.tableOrderBy.unshift(`-${by}`);
      } else if (scope.tableOrderBy.includes(`-${by}`)) {
        scope.tableOrderBy.splice(scope.tableOrderBy.indexOf(by), 1);
      }
    };
    //array of selected packages in table, we must init the array
    scope.selectedPackages = [];

    if (tabIdentifierPath) {

      if (typeof npm.npmGlobal === 'function' &&
        typeof npm.npmInFolder === 'function') {

        scope.loading = true;
        scope.loaded = false;
        scope.goBackHome = false;
        scope.showLoadingSelectedRow = false;
        scope.packageViewInfos = false;

        let npmPromise;

        if (tabIdentifierPath === npmGlobal) {
          scope.isGlobalProject = true;
          npmPromise = npm.npmGlobal();
        } else {
          scope.isGlobalProject = false;
          npmPromise = npm.npmInFolder(tabIdentifierPath);
        }

        npmPromise.then(npmInFolder =>
          npmInFolder.listOutdated()
          .then(infos => {

            scope.$apply(() => {
              scope.packageInformations = infos;
              scope.tableOrderBy = ['name'];
              scope.loaded = true;
            });
          })
          .catch(error => {

            scope.$apply(() => {
              scope.packageInformations = false;
            });
            $log.error(error);
          }))
        .catch(error => {

          scope.$apply(() => {
            scope.packageInformations = false;
          });
          $log.error(`Error on npmPomise, content.js: ${error}`);
        });
      } else {
        $log.error('npm.npmGlobal or npm.infolder are not functions ready probably :/ :/ !? :/ content.js');
      }
    } else {
      $log.error('Path for tab identifier is missing');
    }

    scope.$on('$destroy', () => {

      unregisterInstallVersionPackageListener();
      unregisterInstallVersionPackageErrorListener();
      unregisterTopBarActiveLinkListener();
      unregisterLeftBarDeleteSelectedProjectListener();
      unregisterOnContentPackageInfosListener();
    });
  };
});

export default moduleName;
