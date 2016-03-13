/*global angular*/
import angular from 'angular';

angular.module('npm-ui.session', [])
  .factory('sessionFactory', /*@ngInject*/ ($rootScope, $window, localStorageService) => {

    let unregisterPathBind
      , unregisterProjectsListBind
      , unregisterGloballyInstalsCountBind
      , initialize = () => {

      if (!unregisterPathBind) {

        unregisterPathBind = localStorageService.bind($rootScope, 'path');
      }

      if (!unregisterProjectsListBind) {

        unregisterProjectsListBind = localStorageService.bind($rootScope, 'projectsList');
      }

      if (!unregisterGloballyInstalsCountBind) {

        unregisterGloballyInstalsCountBind = localStorageService.bind($rootScope, 'globallyInstalsCount');
      }

      //defaults
      $rootScope.path = undefined;
      $rootScope.projectsList = localStorageService.get('projectsList') || new $window.Array();
      $rootScope.globallyInstalsCount = localStorageService.get('globallyInstalsCount') || 0;

    };

    $rootScope.$on('$destroy', () => {

      if (unregisterPathBind) {

        unregisterPathBind();
      }

      if (unregisterProjectsListBind) {

        unregisterProjectsListBind();
      }

      if (unregisterGloballyInstalsCountBind) {

        unregisterGloballyInstalsCountBind();
      }
    });

    return {
      'initialize': initialize
    };
  });

  export default 'npm-ui.session';
