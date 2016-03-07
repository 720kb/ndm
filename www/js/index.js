/*global angular*/
(function withAngular(angular){
  'use strict';

  angular.module('electron', [
    'ngRoute',
    '720kb.fx',
    'electron.controllers',
    'electron.factories',
    'electron.directives'
  ]);

}(angular));
