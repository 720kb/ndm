(function withAngular(angular){
  'use strict';

  angular.module('electron', [
    'ngRoute',
    'electron.controllers',
    'electron.factories'
  ]);
}(angular));
