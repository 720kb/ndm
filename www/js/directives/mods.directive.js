/*global angular*/
(function withAngular(angular) {
  'use strict';
  var ModsInstalledDirective = function ModsInstalledDirective() {
    return {
      'restrict': 'E',
      'link': function linkingFunction() {
        alert('antani');
      }
    }
  };

  angular.module('electron.mods.directives')

  .directive('modsInstalledDirective', ModsInstalledDirective);
}(angular));
