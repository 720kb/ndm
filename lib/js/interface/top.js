/*global require*/
import angular from 'angular';
const moduleName = 'npm-ui.top-menu'
  , fileSystem = require('fs')
  , electron = require('electron')
  , dialog = electron.remote.dialog;

angular.module(moduleName, [])
.controller('TopMenuController', /*@ngInject*/ function TopMenuController($rootScope, $log, npm, npmGlobal, loadingFactory) {

  const unregisterLeftBarSelectProjectListener = $rootScope.$on('left-bar:select-project', (eventInformation, payload) => {

    if (payload &&
      payload.path) {

      this.activeLink = undefined;
      this.projectPath = payload.path;
    }
  });

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
          dialog.showErrorBox('Error', `Configuring npm for installing ${packageName}...`, error);
        })
        .then(npmInFolder =>
          npmInFolder.install({
            'name': packageName,
            'kind': choosedPackageKind
          }).then(() => {

            loadingFactory.finished();
            this.installingPackage = false;
            $rootScope.$emit('left-bar:select-project', {
              'path': this.projectPath
            });
          }).catch(error => {
            loadingFactory.finished();
            this.installingPackage = false;
            $log.error(`Installing ${packageName}...`, error);
            dialog.showErrorBox('Error', `Installing ${packageName}...`, error);
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

  this.updatePackage = currentSelectedPackage => {

    let npmPromise;

    loadingFactory.loading();
    if (this.projectPath === npmGlobal) {

      npmPromise = npm.npmGlobal();
    } else {

      npmPromise = npm.npmInFolder(this.projectPath);
    }

    npmPromise.catch(error => {
      loadingFactory.finished();
      $log.error(`Configuring npm for updating ${currentSelectedPackage.name}...`, error);
      dialog.showErrorBox('Error', `Error configuring npm for updating ${currentSelectedPackage.name}: ${error}`);
    }).then(npmInFolder =>
      npmInFolder.update(currentSelectedPackage)
      .then(() => {
        loadingFactory.finished();
        $rootScope.$emit('left-bar:select-project', {
          'path': this.projectPath
        });
      }).catch(error => {
        loadingFactory.finished();
        $log.error(`Updating ${currentSelectedPackage.name}...`, error);
        dialog.showErrorBox('Error', `Error updating ${currentSelectedPackage.name}: ${error}`);
      }));
  };

  this.installLatest = currentSelectedPackage => {
    let npmPromise;

    loadingFactory.loading();
    if (this.projectPath === npmGlobal) {

      npmPromise = npm.npmGlobal();
    } else {

      npmPromise = npm.npmInFolder(this.projectPath);
    }

    npmPromise.catch(error => {
      loadingFactory.finished();
      $log.error(`Configuring npm for installing latest ${currentSelectedPackage.name}...`, error);
      dialog.showErrorBox('Error', `Error configuring npm for installing latest ${currentSelectedPackage.name}: ${error}`);
    }).then(npmInFolder =>
      npmInFolder.installLatest(currentSelectedPackage)
      .then(() => {
        loadingFactory.finished();
        $rootScope.$emit('left-bar:select-project', {
          'path': this.projectPath
        });
      })
      .catch(error => {
        loadingFactory.finished();
        $log.error(`Installing latest ${currentSelectedPackage.name}...`, error);
        dialog.showErrorBox('Error', `Error installing latest ${currentSelectedPackage.name}: ${error}`);
      }));
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
      dialog.showErrorBox('Error', `Error configuring npm for installing ${currentSelectedPackage.name}: ${error}`);
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
        dialog.showErrorBox('Error', `Error installing ${currentSelectedPackage.name}: ${error}`);
      }));
  };

  this.uninstallPackage = currentSelectedPackage => {
    let npmPromise;

    loadingFactory.loading();
    if (this.projectPath === npmGlobal) {

      npmPromise = npm.npmGlobal();
    } else {

      npmPromise = npm.npmInFolder(this.projectPath);
    }

    npmPromise.catch(error => {
      loadingFactory.finished();
      $log.error(`Configuring npm for uninstalling ${currentSelectedPackage.name}...`, error);
      dialog.showErrorBox('Error', `Error configuring npm for uninstalling ${currentSelectedPackage.name}: ${error}`);
    }).then(npmInFolder =>
      npmInFolder.rm(currentSelectedPackage)
      .then(() => {
        loadingFactory.finished();
        $rootScope.$emit('left-bar:select-project', {
          'path': this.projectPath
        });
      }).catch(error => {
        loadingFactory.finished();
        $log.error(`Uninstalling ${currentSelectedPackage.name}...`, error);
        dialog.showErrorBox('Error', `Error uninstalling ${currentSelectedPackage.name}: ${error}`);
      }));
  };

  this.activeClickedLink = activeLink => {

    this.activeLink = activeLink;
    $rootScope.$emit('top-bar:active-link', {
      'link': activeLink
    });
  };

  $rootScope.$on('$destroy', () => {

    unregisterLeftBarSelectProjectListener();
  });
});

export default moduleName;
