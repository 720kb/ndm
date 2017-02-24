/*global require */
import angular from 'angular';
const moduleName = 'npm-ui.top-menu'
  , fileSystem = require('fs')
  , Path = require('path');

angular.module(moduleName, [])
.directive('topMenu', /*@ngInject*/ function TopMenuController($document, $rootScope, $log, npm, npmGlobal, loadingFactory, notificationFactory, errorsService) {
  return (scope, element, attrs) => {

    const topMenuIdentifierPath = attrs.topMenuId;

    scope.installPackage = (pkgs, packageKind) => {
      if (pkgs &&
        pkgs.length > 0 &&
        !scope.installingPackage) {

        let promiseSequence = Promise.resolve()
          , npmPromise
          , choosedPackageKind
          , installLaunch = () => {

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

            promiseSequence.then(() => {
              $log.info('Finished installing packages.');
              notificationFactory.notify('Finished installing packages.');
              scope.$apply(() => {
                scope.installingPackage = false;
              });
              $rootScope.$emit('left-bar:select-project', {
                'path': topMenuIdentifierPath
              });
            }).catch(error => {
              scope.$apply(() => {
                scope.installingPackage = false;
              });
              loadingFactory.finished();
              errorsService.handleError('Error installing packages.', error);
            });
          };

        scope.showPackageInstallPrompt = false;
        scope.installingPackage = true;

        if (packageKind) {
          choosedPackageKind = 'dev';
        }

        if (topMenuIdentifierPath === npmGlobal) {

          npmPromise = npm.npmGlobal();
        } else {

          npmPromise = npm.npmInFolder(topMenuIdentifierPath);
        }
        //if not global install
        if (topMenuIdentifierPath === npmGlobal) {
          installLaunch();
        } else {
          //read package.json and create it if project is an empty folder
          fileSystem.readFile(Path.join(topMenuIdentifierPath, 'package.json'), 'utf8', (err, packageJson) => {
            if (err ||
              !packageJson ||
              (packageJson &&
               JSON.parse(packageJson).length <= 0 &&
               packageJson !== '{}')) {

              $log.info(`Writing a package.json file in folder ${topMenuIdentifierPath}`);
              //create package.json if not exist or if exist and not well formatted
              fileSystem.writeFile(Path.join(topMenuIdentifierPath, 'package.json'), '{"name": "ndm-created-project", "description": "add-a-description", "license": "add-a-license", "respository": "add-a-repository"}', error => {
                if (error) {
                  installLaunch();
                  $log.warn(`Unable to create package.json in: ${topMenuIdentifierPath}`);
                } else {
                  installLaunch();
                  $log.info(`Initialized a package.json file in ${topMenuIdentifierPath}`);
                }
              });
            } else {
              installLaunch();
            }
          });
        }
      }
    };

    scope.updatePackage = currentSelectedPackages => {

      let promiseSequence = Promise.resolve()
        , npmPromise;

      if (topMenuIdentifierPath === npmGlobal) {

        npmPromise = npm.npmGlobal();
      } else {

        npmPromise = npm.npmInFolder(topMenuIdentifierPath);
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

      promiseSequence.then(() => {
        notificationFactory.notify('Finished updating selected packages.');
        $log.info('Updated all the selected packages.');
        $rootScope.$emit('left-bar:select-project', {
          'path': topMenuIdentifierPath
        });
      }).catch(error => {
        errorsService.handleError('Error updating package.', error);
      });
    };

    scope.installLatest = currentSelectedPackages => {
      let npmPromise
        , promiseSequence = Promise.resolve();

      if (topMenuIdentifierPath === npmGlobal) {

        npmPromise = npm.npmGlobal();
      } else {

        npmPromise = npm.npmInFolder(topMenuIdentifierPath);
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

      promiseSequence.then(() => {
        $log.info('Updated all the selected packages to latest versions.');
        notificationFactory.notify('Updated all the selected packages to latest versions.');
        $rootScope.$emit('left-bar:select-project', {
          'path': topMenuIdentifierPath
        });
      })
      .catch(error => {
        errorsService.handleError('Error updating to latest package version.', error);
      });

    };

    scope.installVersionPackage = (currentSelectedPackage, specificVersion) => {
      if (specificVersion &&
        !scope.installingPackageVersion) {
        scope.showSpecificVersionPrompt = false;
        scope.installingPackageVersion = true;

        let npmPromise;

        if (topMenuIdentifierPath === npmGlobal) {

          npmPromise = npm.npmGlobal();
        } else {

          npmPromise = npm.npmInFolder(topMenuIdentifierPath);
        }

        $rootScope.$emit('top-bar:installing-version-package');
        npmPromise.catch(error => {
          scope.installingPackageVersion = false;
          $rootScope.$emit('top-bar:installing-version-package-error');
          errorsService.showErrorBox('Error', `Error configuring npm for installing ${currentSelectedPackage.name}: ${error}`);
        }).then(npmInFolder => {
          npmInFolder.install(currentSelectedPackage, specificVersion)
          .then(() => {
            scope.installingPackageVersion = false;
            notificationFactory.notify(`Finished installing ${currentSelectedPackage.name}@${specificVersion}`);
            $rootScope.$emit('left-bar:select-project', {
              'path': topMenuIdentifierPath
            });
          }).catch(error => {
            scope.$apply(() => {
              scope.installingPackageVersion = false;
            });
            $rootScope.$emit('top-bar:installing-version-package-error');
            errorsService.showErrorBox('Error', `Error installing ${currentSelectedPackage.name}@${specificVersion}: ${error}`);
          });
        });
      }
    };

    scope.uninstallPackage = currentSelectedPackages => {

      let promiseSequence = Promise.resolve()
        , npmPromise;

      if (topMenuIdentifierPath === npmGlobal) {

        npmPromise = npm.npmGlobal();
      } else {

        npmPromise = npm.npmInFolder(topMenuIdentifierPath);
      }

      currentSelectedPackages.forEach(pkg => {

        promiseSequence = promiseSequence.then(() => {
          return npmPromise.then(npmInFolder => {
            $log.info(`Preparing to uninstall ${pkg.name}...`);
            return npmInFolder.rm(pkg).then(() => {
              if (topMenuIdentifierPath === npmGlobal) {
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
        $log.info('Uninstalled all the selected packages.');
        notificationFactory.notify('Uninstalled all the selected packages.');
        $rootScope.$emit('left-bar:select-project', {
          'path': topMenuIdentifierPath
        });
      }).catch(error => {
        errorsService.handleError('Error uninstalling package.', error);
      });
    };
  };
});

export default moduleName;
