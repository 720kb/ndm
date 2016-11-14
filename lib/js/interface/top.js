/*global require Notification*/
import angular from 'angular';
const moduleName = 'npm-ui.top-menu'
  , fileSystem = require('fs')
  , electron = require('electron')
  , BrowserWindow = electron.remote.BrowserWindow;

angular.module(moduleName, [])
.controller('TopMenuController', /*@ngInject*/ function TopMenuController($rootScope, $scope, $log, npm, npmGlobal, loadingFactory, errorsService) {

  const unregisterLeftBarSelectProjectListener = $rootScope.$on('left-bar:select-project', (eventInformation, payload) => {

    if (payload &&
      payload.path) {

      this.activeLink = undefined;
      this.projectPath = payload.path;
    }
  })
  , unregisterTopBarNpmVersionsListner = $rootScope.$on('shell:updated-npm', () => {

    if (!BrowserWindow.getFocusedWindow()) {

      let notify = new Notification('ndm', {
        'body': 'Finished updating npm.',
        'sticky': true
      });

      notify.onclick = () => {
        BrowserWindow.show();
        BrowserWindow.focus();
        notify = undefined;
      };
    }
    this.updateNpmBadgeVersion();
  });

  this.updateNpmBadgeVersion = () => {

    npm.getNpmInstalledAndAvailableVersion().then(data => {

      if (data.npm) {

        $scope.$apply(() => {
          this.npmCurrentVersionBadge = data.npm.current || undefined;
          this.npmLatestVersionBadge = data.npm.latest || undefined;
        });
      }
    });
  };

  this.installPackage = (packageName, packageKind) => {

    this.showPackageInstallPrompt = false;
    this.installingPackage = true;
    loadingFactory.loading();

    let npmPromise
      , choosedPackageKind
      , installLaunch = () => {

        npmPromise.catch(error => {

          loadingFactory.finished();
          this.installingPackage = false;
          $log.error(`Configuring npm for installing ${packageName}...`, error);
          errorsService.showErrorBox('Error', `Configuring npm for installing ${packageName}...`, error);
        })
        .then(npmInFolder =>
          npmInFolder.install({
            'name': packageName,
            'kind': choosedPackageKind
          },
          this.newPackageVersion).then(() => {

            loadingFactory.finished();
            this.installingPackage = false;
            $rootScope.$emit('left-bar:select-project', {
              'path': this.projectPath
            });
          }).catch(error => {
            loadingFactory.finished();
            this.installingPackage = false;
            $log.error(`Installing ${packageName}...`, error);
            errorsService.showErrorBox('Error', `Installing ${packageName}: ${error}`);
          }));
      };

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
          fileSystem.writeFile(`${this.projectPath}/package.json`, '{"name": "ndm-created-project"}', error => {
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
  };

  this.updatePackage = currentSelectedPackages => {

    let allPromises = []
      , npmPromise;

    loadingFactory.loading();

    if (this.projectPath === npmGlobal) {

      npmPromise = npm.npmGlobal();
    } else {

      npmPromise = npm.npmInFolder(this.projectPath);
    }

    currentSelectedPackages.forEach(currentSelectedPackage => {

      let aPromise = new Promise((resolve, reject) => {

        return npmPromise.catch(error => {

          $log.error(`Configuring npm for updating ${currentSelectedPackage.name}...`, error);
          errorsService.showErrorBox('Error', `Error configuring npm for updating ${currentSelectedPackage.name}: ${error}`);
          reject();
        }).then(npmInFolder =>
          npmInFolder.update(currentSelectedPackage)
          .then(() => {
            $log.info(`Updated ${currentSelectedPackage.name} resolving ...`);
            resolve();
          }).catch(error => {
            $log.error(`Updating ${currentSelectedPackage.name}...`, error);
            errorsService.showErrorBox('Error', `Error updating ${currentSelectedPackage.name}: ${error}`);
            reject();
          }));
      });

      allPromises.push(aPromise);
    });

    Promise.all(allPromises).then(() => {
      loadingFactory.finished();
      $rootScope.$emit('left-bar:select-project', {
        'path': this.projectPath
      });
      $log.info('Updated all packages...');
    }).catch(error => {
      $log.error('Error updating packages...', error);
    });
  };

  this.installLatest = currentSelectedPackages => {
    let allPromises = []
      , npmPromise;

    if (this.projectPath === npmGlobal) {

      npmPromise = npm.npmGlobal();
    } else {

      npmPromise = npm.npmInFolder(this.projectPath);
    }

    loadingFactory.loading();

    currentSelectedPackages.forEach(currentSelectedPackage => {

      let aPromise = new Promise((resolve, reject) => {

        return npmPromise.catch(error => {
          loadingFactory.finished();
          $log.error(`Configuring npm for installing latest ${currentSelectedPackage.name}...`, error);
          errorsService.showErrorBox('Error', `Error configuring npm for installing latest ${currentSelectedPackage.name}: ${error}`);
          reject();
        }).then(npmInFolder =>
          npmInFolder.installLatest(currentSelectedPackage)
          .then(() => {
            $log.info(`Installed latest version of ${currentSelectedPackage.name} resolving ...`);
            resolve();
          })
          .catch(error => {
            loadingFactory.finished();
            $log.error(`Installing latest ${currentSelectedPackage.name}...`, error);
            errorsService.showErrorBox('Error', `Error installing latest ${currentSelectedPackage.name}: ${error}`);
            reject();
          }));
      });

      allPromises.push(aPromise);
    });

    Promise.all(allPromises).then(() => {
      $log.info('Installed all packages latests...');
      loadingFactory.finished();
      $rootScope.$emit('left-bar:select-project', {
        'path': this.projectPath
      });
    }).catch(error => {
      $log.error('Error installing latest of packages...', error);
    });
  };

  this.installVersionPackage = (currentSelectedPackage, specificVersion) => {

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
      $log.error(`Configuring npm for installing ${currentSelectedPackage.name}...`, error);
      errorsService.showErrorBox('Error', `Error configuring npm for installing ${currentSelectedPackage.name}: ${error}`);
    }).then(npmInFolder =>
      npmInFolder.install(currentSelectedPackage, specificVersion)
      .then(() => {
        loadingFactory.finished();
        this.installingPackageVersion = false;
        $rootScope.$emit('left-bar:select-project', {
          'path': this.projectPath
        });
      }).catch(error => {
        loadingFactory.finished();
        this.installingPackageVersion = false;
        $rootScope.$emit('top-bar:installing-version-package-error');
        $log.error(`Installing ${currentSelectedPackage.name}...`, error);
        errorsService.showErrorBox('Error', `Error installing ${currentSelectedPackage.name}: ${error}`);
      }));
  };

  this.uninstallPackage = currentSelectedPackages => {

    let allPromises = []
      , npmPromise;

    loadingFactory.loading();
    if (this.projectPath === npmGlobal) {

      npmPromise = npm.npmGlobal();
    } else {

      npmPromise = npm.npmInFolder(this.projectPath);
    }

    currentSelectedPackages.forEach(currentSelectedPackage => {

      let aPromise = new Promise((resolve, reject) => {

      return npmPromise.catch(error => {
        loadingFactory.finished();
        $log.error(`Configuring npm for uninstalling ${currentSelectedPackage.name}...`, error);
        errorsService.showErrorBox('Error', `Error configuring npm for uninstalling ${currentSelectedPackage.name}: ${error}`);
        reject();
      }).then(npmInFolder =>
        npmInFolder.rm(currentSelectedPackage)
        .then(() => {
          $log.info('Unistalled all packages latests, now Pruning...');
          npmInFolder.prune().then(() => {
            resolve();
          }).catch(error => {
            $log.error('Unable to prune project, something went wrong', error);
          });
          resolve();
        }).catch(error => {
          loadingFactory.finished();
          $log.error(`Uninstalling ${currentSelectedPackage.name}...`, error);
          errorsService.showErrorBox('Error', `Error uninstalling ${currentSelectedPackage.name}: ${error}`);
          reject();
        }));
      });

      allPromises.push(aPromise);
    });

    Promise.all(allPromises).then(() => {

      $log.info('Unistalled and Pruned all packages.');
      loadingFactory.finished();
      $rootScope.$emit('left-bar:select-project', {
        'path': this.projectPath
      });
    }).catch(error => {
      $log.error('Error uninstalling packages...', error);
    });
  };

  this.activeClickedLink = activeLink => {

    this.activeLink = activeLink;
    $rootScope.$emit('top-bar:active-link', {
      'link': activeLink
    });
  };

  //show if new npm version is available in view
  this.updateNpmBadgeVersion();

  $rootScope.$on('$destroy', () => {
    unregisterTopBarNpmVersionsListner();
    unregisterLeftBarSelectProjectListener();
  });
});

export default moduleName;
