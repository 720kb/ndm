/*global angular*/
(function withAngular(angular) {
  'use strict';

  angular.module('electron.factories', [
    'electron.npm.factories',
    'electron.session.factories'
  ]);
}(angular));
