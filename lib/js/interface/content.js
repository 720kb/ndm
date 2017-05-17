/*global require*/
import angular from 'angular';
import npmApi from '../npm/npm-api.js';
const moduleName = 'npm-ui.content'
  , fileSystem = require('fs')
  , Path = require('path');

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
        !this.tabs.includes(payload.path)) {

        this.tabs.unshift(payload.path);
        this.activeTab = this.tabs[0] ? this.tabs[0] : undefined;
      } else {

        this.activeTab = this.tabs[this.tabs.indexOf(payload.path)];
      }
  });

  this.closeProjectTab = tab => {
    if (tab) {
      if (this.tabs.includes(tab)) {
        this.tabs.splice(this.tabs.indexOf(tab), 1);
        //show active tab
        this.activeTab = this.tabs[0] ? this.tabs[0] : undefined;
      }
    }
  };

  this.tabs = [];

  $scope.$on('$destroy', () => {
    unregisterLeftBarSelectProjectListener();
    unregisterLeftBarDeleteProjectListener();
  });
})
.directive('npmTabs', /*@ngInject*/ function npmTabs($rootScope, $log, npmGlobal, npm, errorsService, loadingFactory, notificationFactory) {
  return (scope, element, attrs) => {

    const tabIdentifierPath = attrs.npmTabId
      , unregisterLeftBarSelectProjectListener = $rootScope.$on('left-bar:select-project', (eventInfo, payload) => {

        if (payload &&
          payload.path &&
          payload.path === tabIdentifierPath) {

          if (payload.path === npmGlobal) {

            scope.globalSelected = true;
          } else {
            scope.globalSelected = false;
          }

          scope.listPackages();
        }
      })
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
      , unregisterInstallVersionPackageListener = $rootScope.$on('content:installing-version-package', () => {
          //while selected package and clicked "install release" and clicked prompt dialog button "ok" (while literally installing package new release)
          scope.showLoadingSelectedRow = true;
        })
      , unregisterInstallVersionPackageErrorListener = $rootScope.$on('content:installing-version-package-error', () => {
          //while selected package and clicked "install" + version, if no version available it shows an error message and we must remove active loading status from that package row in table
          scope.$apply(() => {
            scope.showLoadingSelectedRow = false;
          });
        })
      , unregisterLeftBarDeleteSelectedProjectListener = $rootScope.$on('left-bar:delete-selected-project', () => {
        scope.packageInformations = [];
        scope.goBackHome = true;
      });

    scope.installPackage = (pkgs, packageKind) => {
      if (pkgs &&
        pkgs.length > 0 &&
        !scope.performingAction) {

        scope.performingAction = true;
        scope.installingPackage = true;

        let promiseSequence = Promise.resolve()
          , choosedPackageKind
          , npmPromise
          , launchPackagesInstallation = () => {

            pkgs.forEach(pkg => {

              promiseSequence = promiseSequence.then(() => {
                return npmPromise.catch(error => {
                  errorsService.showErrorBox('Error', `Configuring npm for installing ${pkg.name}...`, error);
                })
                .then(npmInFolder => {
                  $log.info(`Now installing ${pkg.name}...`);
                  return npmInFolder.install({
                    'name': pkg.name,
                    'kind': choosedPackageKind
                  }, pkg.version).then(() => {
                    $log.info(`Installed ${pkg.name}...`);
                  }).catch(error => {
                    errorsService.showErrorBox('Error', `Installing ${pkg.name}: ${error}`);
                  });
                });
              });
            });

            scope.showLoadingSelectedRow = true;
            promiseSequence.then(() => {
              scope.$apply(() => {
                scope.showLoadingSelectedRow = false;
                scope.performingAction = false;
                scope.installingPackage = false;
              });
              $log.info('Finished installing packages.');
              notificationFactory.notify('Finished installing packages.');
              scope.listPackages();
            }).catch(error => {
              scope.$apply(() => {
                scope.showLoadingSelectedRow = false;
                scope.performingAction = false;
                scope.installingPackage = false;
              });
              errorsService.handleError('Error installing packages.', error);
              scope.listPackages();
            });
          };

        if (packageKind) {
          choosedPackageKind = 'dev';
        }

        if (tabIdentifierPath === npmGlobal) {

          npmPromise = npm.npmGlobal();
        } else {

          npmPromise = npm.npmInFolder(tabIdentifierPath);
        }
        //if not global install
        if (tabIdentifierPath === npmGlobal) {
          launchPackagesInstallation();
        } else {
          //read package.json and create it if project is an empty folder
          fileSystem.readFile(Path.join(tabIdentifierPath, 'package.json'), 'utf8', (err, packageJson) => {
            if (err ||
              !packageJson ||
              (packageJson &&
               JSON.parse(packageJson).length <= 0 &&
               packageJson !== '{}')) {

              $log.info(`Writing a package.json file in folder ${tabIdentifierPath}`);
              //create package.json if not exist or if exist and not well formatted
              fileSystem.writeFile(Path.join(tabIdentifierPath, 'package.json'), '{"name": "ndm-created-project", "description": "add-a-description", "license": "add-a-license", "respository": "add-a-repository"}', error => {
                if (error) {
                  launchPackagesInstallation();
                  $log.warn(`Unable to create package.json in: ${tabIdentifierPath}`);
                } else {
                  launchPackagesInstallation();
                  $log.info(`Initialized a package.json file in ${tabIdentifierPath}`);
                }
              });
            } else {
              launchPackagesInstallation();
            }
          });
        }
      }
    };

    scope.updatePackage = currentSelectedPackages => {
      if (!scope.performingAction) {
        scope.performingAction = true;

        let promiseSequence = Promise.resolve()
          , npmPromise;

        if (tabIdentifierPath === npmGlobal) {

          npmPromise = npm.npmGlobal();
        } else {

          npmPromise = npm.npmInFolder(tabIdentifierPath);
        }

        currentSelectedPackages.forEach(pkg => {

          promiseSequence = promiseSequence.then(() => {
            return npmPromise.then(npmInFolder => {
              $log.info(`Preparing to update ${pkg.name}...`);
              return npmInFolder.update(pkg).then(() => {
                $log.info(`Updated ${pkg.name}...`);
              }).catch(error => {
                errorsService.handleError(`Error updating ${pkg.name}...`, error);
              });
            }).catch(error => {
              errorsService.handleError(`Error preparing to update ${pkg.name}...`, error);
            });
          });
        });

        scope.showLoadingSelectedRow = true;
        promiseSequence.then(() => {
          notificationFactory.notify('Finished updating selected packages.');
          $log.info('Updated all the selected packages.');
          scope.$apply(() => {
            scope.performingAction = false;
            scope.showLoadingSelectedRow = false;
          });
          scope.listPackages();
        }).catch(error => {
          scope.$apply(() => {
            scope.performingAction = false;
            scope.showLoadingSelectedRow = false;
          });
          scope.listPackages();
          errorsService.handleError('Error updating package.', error);
        });
      }
    };

    scope.installLatest = currentSelectedPackages => {
      if (!scope.performingAction) {
        scope.performingAction = true;

        let npmPromise
        , promiseSequence = Promise.resolve();

        if (tabIdentifierPath === npmGlobal) {

          npmPromise = npm.npmGlobal();
        } else {

          npmPromise = npm.npmInFolder(tabIdentifierPath);
        }

        currentSelectedPackages.forEach(pkg => {

          promiseSequence = promiseSequence.then(() => {
            return npmPromise.then(npmInFolder => {
              $log.info(`Preparing to update latest ${pkg.name}...`);
              return npmInFolder.installLatest(pkg).then(() => {
                $log.info(`Updated to latest ${pkg.name}...`);
              }).catch(error => {
                errorsService.handleError(`Error updating to latest ${pkg.name}...`, error);
              });
            }).catch(error => {
              errorsService.handleError(`Error preparing to update to latest ${pkg.name}...`, error);
            });
          });
        });

        scope.showLoadingSelectedRow = true;
        promiseSequence.then(() => {
          scope.$apply(() => {
            scope.showLoadingSelectedRow = false;
            scope.performingAction = false;
          });
          $log.info('Updated all the selected packages to latest versions.');
          notificationFactory.notify('Updated all the selected packages to latest versions.');
          scope.listPackages();
        })
        .catch(error => {
          scope.$apply(() => {
            scope.showLoadingSelectedRow = false;
            scope.performingAction = false;
          });
          scope.listPackages();
          errorsService.handleError('Error updating to latest package version.', error);
        });
      }
    };

    scope.uninstallPackage = currentSelectedPackages => {
      if (!scope.performingAction) {

        scope.performingAction = true;
        scope.showLoadingSelectedRow = true;

        let promiseSequence = Promise.resolve()
          , npmPromise;

        if (tabIdentifierPath === npmGlobal) {

          npmPromise = npm.npmGlobal();
        } else {

          npmPromise = npm.npmInFolder(tabIdentifierPath);
        }

        currentSelectedPackages.forEach(pkg => {

          promiseSequence = promiseSequence.then(() => {
            return npmPromise.then(npmInFolder => {
              $log.info(`Preparing to uninstall ${pkg.name}...`);
              return npmInFolder.rm(pkg).then(() => {
                if (tabIdentifierPath === npmGlobal) {
                  $log.info(`Uninstalled ${pkg.name} from globals...`);
                } else {
                  $log.info(`Uninstalled ${pkg.name} now pruning...`);
                  return npmInFolder.prune().then(() => {
                    $log.info(`Uninstalled and Pruned ${pkg.name}...`);
                  });
                }
              }).catch(error => {
                errorsService.handleError(`Error uninstalling ${pkg.name}...`, error);
              });
            }).catch(error => {
              errorsService.handleError(`Error preparing to uninstall ${pkg.name}...`, error);
            });
          });
        });

        promiseSequence.then(() => {
          scope.$apply(() => {
            scope.showLoadingSelectedRow = false;
            scope.performingAction = false;
          });
          scope.listPackages();
          $log.info('Uninstalled all the selected packages.');
          notificationFactory.notify('Uninstalled all the selected packages.');
        }).catch(error => {
          scope.$apply(() => {
            scope.showLoadingSelectedRow = false;
            scope.performingAction = false;
          });
          scope.listPackages();
          errorsService.handleError('Error uninstalling package.', error);
        });
      }
    };

    scope.installVersionPackage = (currentSelectedPackage, specificVersion) => {
      if (specificVersion &&
        !scope.performingAction) {

        scope.performingAction = true;
        scope.showLoadingSelectedRow = true;

        let npmPromise;

        if (tabIdentifierPath === npmGlobal) {

          npmPromise = npm.npmGlobal();
        } else {

          npmPromise = npm.npmInFolder(tabIdentifierPath);
        }

        $rootScope.$emit('content:installing-version-package');
        npmPromise.catch(error => {
          scope.installingPackageVersion = false;
          scope.performingAction = false;
          $rootScope.$emit('content:installing-version-package-error');
          scope.listPackages();
          errorsService.showErrorBox('Error', `Error configuring npm for installing ${currentSelectedPackage.name}: ${error}`);
        }).then(npmInFolder => {
          npmInFolder.install(currentSelectedPackage, specificVersion)
          .then(() => {
            scope.installingPackageVersion = false;
            scope.performingAction = false;
            notificationFactory.notify(`Finished installing ${currentSelectedPackage.name}@${specificVersion}`);
            scope.listPackages();
          }).catch(error => {
            scope.$apply(() => {
              scope.installingPackageVersion = false;
              scope.performingAction = false;
            });
            $rootScope.$emit('content:installing-version-package-error');
            scope.listPackages();
            errorsService.showErrorBox('Error', `Error installing ${currentSelectedPackage.name}@${specificVersion}: ${error}`);
          });
        });
      }
    };

    scope.loadPackagesInfos = packageName => {
      let folder = '/'; //not really needed probably

      scope.packageViewInfos = false;
      scope.selectedPackageViewInfos = false;

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

    scope.listPackages = () => {
      if (typeof npm.npmGlobal === 'function' &&
        typeof npm.npmInFolder === 'function') {

        scope.$evalAsync(() => {
          scope.loading = true;
          scope.loaded = false;
          scope.goBackHome = false;
          scope.showLoadingSelectedRow = false;
          scope.packageViewInfos = false;
          scope.packageInformations = [];
          scope.currentSelectedPackages = [];
          scope.showMenuButtons = false;
        });

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
              scope.loading = false;
            });
          })
          .catch(error => {

            scope.$apply(() => {
              scope.packageInformations = false;
              scope.loaded = true;
              scope.loading = false;
            });
            $log.error(error);
          }))
        .catch(error => {

          scope.$apply(() => {
            scope.packageInformations = false;
            scope.loaded = true;
            scope.loading = false;
          });
          $log.error(`Error on npmPomise, content.js: ${error}`);
        });
      } else {
        $log.error('npm.npmGlobal or npm.infolder are not functions ready probably :/ :/ !? :/ content.js');
      }
    };
    //array of selected packages in table, we must init the array
    scope.selectedPackages = [];

    if (tabIdentifierPath) {

      scope.listPackages();
    } else {
      $log.error('Path for tab identifier is missing');
    }

    scope.$on('$destroy', () => {

      unregisterInstallVersionPackageListener();
      unregisterInstallVersionPackageErrorListener();
      unregisterLeftBarSelectProjectListener();
      unregisterLeftBarDeleteSelectedProjectListener();
      unregisterOnContentPackageInfosListener();
    });
  };
});

export default moduleName;
