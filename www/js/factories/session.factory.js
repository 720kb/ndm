/*global angular*/
(function withAngular(angular) {
  'use strict';

  var sessionFactory = function sessionFactory($rootScope, $window, localStorageService) {

      var unregisterPathBind
        , unregisterProjectsListBind
        , unregisterGloballyInstalsCountBind
        , initialize = function initialize() {

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

      $rootScope.$on('$destroy', function unregisterListener() {

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
    };

  angular.module('electron.session.factories', [])
    .factory('sessionFactory',['$rootScope', '$window', 'localStorageService', sessionFactory]);
}(angular));
