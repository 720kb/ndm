/*global angular*/

(function withAngular(angular) {
  'use strict';

  angular.module('720kb', [
    'ngRoute',
    '720kb.fx'
  ])
  .controller('myCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
    $timeout(function () {
      $scope.x = 5;
    }, 1000);
    $timeout(function () {
      $scope.x = 1.5;
    }, 3000);
    $timeout(function () {
      $scope.x = 7;
    }, 5000);
    $timeout(function () {
      $scope.x = 70;
    }, 9000);
  }]);
}(angular));
