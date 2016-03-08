/*global angular*/
(function withAngular(angular) {
  'use strict';
  var loadingService = function loadingService($window) {

    this.loading = function isLoading() {
      $window.document.body.style.pointerEvents = 'none';
    };

    this.finished = function isFinished() {

      $window.document.body.style.pointerEvents = '';
    }
  };
  angular.module('electron.loading.services', [])
    .service('loadingService',['$window', loadingService]);
}(angular));
