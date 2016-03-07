/*global angular*/
(function withAngular(angular) {
  'use strict';


  var NpmFactory = function NpmFactory($scope) {

      var npmOutdated = function npmOutdated() {

      };

      return {
        'outdated': npmOutdated
      }
  };

  angular.module('electron.npm.factories', [])
    .factory('npm', ['$scope', NpmFactory]);
}(angular));
