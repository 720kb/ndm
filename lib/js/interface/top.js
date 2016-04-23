import angular from 'angular';
const moduleName = 'npm-ui.top-menu'
  , localStorageName = 'top-menu-projects';

angular.module(moduleName, [])
.controller('TopMenuController', /*@ngInject*/ function TopMenuController($rootScope, $log, npm) {

  const unregisterLeftBarSelectProjectListener = $rootScope.$on('left-bar:select-project', (eventInformation, payload) => {

    if (payload &&
      payload.path) {

      this.projectPath = payload.path;
    }
  });

  this.uninstallPackage = currentSelectedPackage => {

    npm.npmInFolder(this.projectPath)
      .then(npmInFolder =>
        npmInFolder.rm(currentSelectedPackage)
        .then(infos => $log.info(infos))
        .catch(error => $log.error(error)))
      .catch(error => $log.error(error));
  };

  this.updateVersionPackage = currentSelectedPackage => {

    $log.info(currentSelectedPackage);
  };

  this.updatePackage = currentSelectedPackage => {

    npm.npmInFolder(this.projectPath)
      .then(npmInFolder =>
        npmInFolder.update(currentSelectedPackage)
        .then(infos => $log.info(infos))
        .catch(error => $log.error(error)))
      .catch(error => $log.error(error));
  };

  $rootScope.$on('$destroy', () => {

    unregisterLeftBarSelectProjectListener();
  });
});

export default moduleName;
