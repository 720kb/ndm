/*global angular*/
(function withAngular(angular){
  'use strict';
  /*
  * APP EVENTS
  - 'user:added-new-project' {path: pathToDir}
  - 'user:deleted-project' {id: projectdId}
  - 'user:selected-new-project' {id: project, path: pathToDir}
  - 'user:selected-global' {}
  - 'user:selected-package-in-list' {package:name, project: pathToDir}
  - 'user:uninstall-package' {package:name, project: pathToDir}
  - 'user:update-package' {package:name, project: pathToDir}
  - 'user:update-npm' {package:name, project: pathToDir}
  */
  var configurationFunction = function configurationFunction(localStorageServiceProvider) {

    localStorageServiceProvider.setPrefix('electron');
  }
  , bootstrapFunction = function bootstrapFunction(sessionFactory, $rootScope) {

    sessionFactory.initialize();
  };

  angular.module('electron', [
    'ngRoute',
    '720kb.fx',
    'LocalStorageModule',
    'electron.controllers',
    'electron.services',
    'electron.factories',
    'electron.directives'
  ])

  .config(['localStorageServiceProvider', configurationFunction])
  .run(['sessionFactory', '$rootScope', bootstrapFunction]);

}(angular));
