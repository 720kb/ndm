/*global angular*/
(function withAngular(angular) {
  'use strict';
  var loadingService = function loadingService($window) {

    this.loading = function isLoading() {
      $window.document.body.classList.add('loading');
    };

    this.finished = function isFinished() {

      $window.document.body.classList.remove('loading');
    }
  };
  angular.module('electron.loading.services', [])
    .service('loadingService',['$window', loadingService]);
}(angular));
