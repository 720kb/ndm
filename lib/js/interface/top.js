/*global require */
import angular from 'angular';
const moduleName = 'npm-ui.top-menu'
  , fileSystem = require('fs');

angular.module(moduleName, [])
.controller('TopMenuController', /*@ngInject*/ function TopMenuController($rootScope, $scope, $log, npm, npmGlobal, loadingFactory, notificationFactory, errorsService) {

  const unregisterLeftBarSelectProjectListener = $rootScope.$on('left-bar:select-project', (eventInformation, data) => {
    if (data &&
      data.path) {

      this.activeLink = undefined;
      this.projectPath = data.path;
    }
  })
  , unregisterTopBarNpmVersionsListner = $rootScope.$on('shell:updated-npm', () => {

    notificationFactory.notify('Finished updating npm.');
    this.updateNpmBadgeVersion();
  });

  this.updateNpmBadgeVersion = () => {

    npm.getNpmOutdatedVersion().then(data => {
      if (data.npm) {
        $scope.$apply(() => {
          this.npmLatestVersionBadge = data.npm.latest || undefined;
          this.npmCurrentVersionBadge = data.npm.current || undefined;
        });
      } else {
        //since npm outdated npm does not return the current if up to date
        npm.getNpmVersion().then(version => {
          $scope.$apply(() => {
            this.npmLatestVersionBadge = undefined;
            this.npmCurrentVersionBadge = version || undefined;
          });
        });
      }
    });
  };

  this.installPackage = (pkgs, packageKind) => {
    if (pkgs &&
      pkgs.length > 0 &&
      !this.installingPackage) {

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
            loadingFactory.finished();
            $log.info('Installed all the packages.');
            notificationFactory.notify('Installed all the packages.');
            $scope.$apply(() => {
              this.installingPackage = false;
            });
            $rootScope.$emit('left-bar:select-project', {
              'path': this.projectPath
            });
          }).catch(error => {
            $scope.$apply(() => {
              this.installingPackage = false;
            });
            loadingFactory.finished();
            errorsService.handleError('Error installing packages.', error);
          });
        };

      this.showPackageInstallPrompt = false;
      this.installingPackage = true;
      loadingFactory.loading();

      if (packageKind) {
        choosedPackageKind = 'dev';
      }

      if (this.projectPath === npmGlobal) {

        npmPromise = npm.npmGlobal();
      } else {

        npmPromise = npm.npmInFolder(this.projectPath);
      }
      //if not global install
      if (this.projectPath === npmGlobal) {
        installLaunch();
      } else {
        //read package.json and create it if project is an empty folder
        fileSystem.readFile(`${this.projectPath}/package.json`, 'utf8', (err, packageJson) => {
          if (err ||
            !packageJson ||
            (packageJson &&
             JSON.parse(packageJson).length <= 0 &&
             packageJson !== '{}')) {

            $log.info(`Writing a package.json file in folder ${this.projectPath}`);
            //create package.json if not exist or if exist and not well formatted
            fileSystem.writeFile(`${this.projectPath}/package.json`, '{"name": "ndm-created-project", "description": "add-a-description", "license": "add-a-license", "respository": "add-a-repository"}', error => {
              if (error) {
                installLaunch();
                $log.warn(`Unable to create file: ${this.projectPath}/package.json`);
              } else {
                installLaunch();
                $log.info(`Initialized a package.json file in folder ${this.projectPath}`);
              }
            });
          } else {
            installLaunch();
          }
        });
      }
    }
  };

  this.updatePackage = currentSelectedPackages => {

    let promiseSequence = Promise.resolve()
      , npmPromise;

    loadingFactory.loading();

    if (this.projectPath === npmGlobal) {

      npmPromise = npm.npmGlobal();
    } else {

      npmPromise = npm.npmInFolder(this.projectPath);
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
      loadingFactory.finished();
      $log.info('Updated all the selected packages.');
      notificationFactory.notify('Finished uptading selected packages.');
      $rootScope.$emit('left-bar:select-project', {
        'path': this.projectPath
      });
    }).catch(error => {
      loadingFactory.finished();
      errorsService.handleError('Error updating package.', error);
    });
  };

  this.installLatest = currentSelectedPackages => {
    let npmPromise
      , promiseSequence = Promise.resolve();

    if (this.projectPath === npmGlobal) {

      npmPromise = npm.npmGlobal();
    } else {

      npmPromise = npm.npmInFolder(this.projectPath);
    }

    loadingFactory.loading();

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
      loadingFactory.finished();
      $log.info('Updated all the selected packages to latest versions.');
      notificationFactory.notify('Updated all the selected packages to latest versions.');
      $rootScope.$emit('left-bar:select-project', {
        'path': this.projectPath
      });
    })
    .catch(error => {
      loadingFactory.finished();
      errorsService.handleError('Error updating to latest package version.', error);
    });

  };

  this.installVersionPackage = (currentSelectedPackage, specificVersion) => {
    if (specificVersion &&
      !this.installingPackageVersion) {
      this.showSpecificVersionPrompt = false;
      loadingFactory.loading();
      this.installingPackageVersion = true;

      let npmPromise;

      if (this.projectPath === npmGlobal) {

        npmPromise = npm.npmGlobal();
      } else {

        npmPromise = npm.npmInFolder(this.projectPath);
      }

      $rootScope.$emit('top-bar:installing-version-package');
      npmPromise.catch(error => {
        loadingFactory.finished();
        this.installingPackageVersion = false;
        $rootScope.$emit('top-bar:installing-version-package-error');
        errorsService.showErrorBox('Error', `Error configuring npm for installing ${currentSelectedPackage.name}: ${error}`);
      }).then(npmInFolder => {
        npmInFolder.install(currentSelectedPackage, specificVersion)
        .then(() => {
          loadingFactory.finished();
          this.installingPackageVersion = false;
          notificationFactory.notify(`Finished installing ${currentSelectedPackage.name}@${specificVersion}`);
          $rootScope.$emit('left-bar:select-project', {
            'path': this.projectPath
          });
        }).catch(error => {
          loadingFactory.finished();
          $scope.$apply(() => {
            this.installingPackageVersion = false;
          });
          $rootScope.$emit('top-bar:installing-version-package-error');
          errorsService.showErrorBox('Error', `Error installing ${currentSelectedPackage.name}@${specificVersion}: ${error}`);
        });
      });
    }
  };

  this.uninstallPackage = currentSelectedPackages => {

    let promiseSequence = Promise.resolve()
      , npmPromise;

    loadingFactory.loading();

    if (this.projectPath === npmGlobal) {

      npmPromise = npm.npmGlobal();
    } else {

      npmPromise = npm.npmInFolder(this.projectPath);
    }

    currentSelectedPackages.forEach(pkg => {

      promiseSequence = promiseSequence.then(() => {
        return npmPromise.then(npmInFolder => {
          $log.info(`Preparing to uninstall ${pkg.name}...`);
          return npmInFolder.rm(pkg).then(() => {
            if (this.projectPath === npmGlobal) {
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
      loadingFactory.finished();
      $log.info('Uninstalled all the selected packages.');
      notificationFactory.notify('Uninstalled all the selected packages.');
      $rootScope.$emit('left-bar:select-project', {
        'path': this.projectPath
      });
    }).catch(error => {
      loadingFactory.finished();
      errorsService.handleError('Error uninstalling package.', error);
    });
  };

  this.activeClickedLink = activeLink => {
    if ((activeLink === '1' || activeLink === '4') &&
      this.activeLink === activeLink) {
      //toggle prompts show/hide
      this.activeLink = false;
    } else {

      this.activeLink = activeLink;
      $rootScope.$emit('top-bar:active-link', {
        'link': activeLink
      });
    }
  };

  //show if new npm version is available in view
  this.updateNpmBadgeVersion();

    $rootScope.$on('$destroy', () => {
      unregisterTopBarNpmVersionsListner();
      unregisterLeftBarSelectProjectListener();
    });
  });

export default moduleName;
