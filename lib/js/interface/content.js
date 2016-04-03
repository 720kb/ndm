import angular from 'angular';
import npmApi from '../npm/npm-api.js';
const moduleName = 'npm-ui.content';

angular.module(moduleName, [
  npmApi
])
.controller('ContentController', /*@ngInject*/ ($rootScope, $scope, $log, npm) => {

  const unregisterLeftBarSelectProjectListener = $rootScope.$on('left-bar:select-project', (eventInformation, payload) => {
    if (payload &&
      payload.path) {

      npm.npmInFolder(payload.path).then(npmInFolder =>
        npmInFolder.outdated()
        .then(infos => $log.info(infos))
        .catch(error => $log.error(error)))
      .catch(error => $log.error(error));
    } else {

      $log.error(`Path is missing in ${payload}`);
    }
  });

  $scope.$on('$destroy', () => {

    unregisterLeftBarSelectProjectListener();
  });
});

export default moduleName;
