/*global angular require*/

(function withAngular(angular){
  'use strict';

  var configurationFunction = function configurationFunction(localStorageServiceProvider) {

    localStorageServiceProvider.setPrefix('electron');
  }
  , bootstrapFunction = function bootstrapFunction($window, sessionFactory) {

    $window.remote = require('remote');
    //open links in browser and items in folder
    $window.shell = require('electron').shell;

    $window.dialog = $window.remote.require('dialog');
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
  .run(['$window', 'sessionFactory', bootstrapFunction]);

}(angular));
