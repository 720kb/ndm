/*global angular*/
(function withAngular(angular) {
  'use strict';
  var ModsInstalledDirective = function ModsInstalledDirective(npmFactory) {
      return {
        'restrict': 'E',
        'templateUrl': 'templates/directives/mods-installed.html',
        'link': function linkingFunction(scope) {

          npmFactory.list().then(function onResolve(stdout) {
            scope.$evalAsync(function evalAsync() {

              scope.deps = JSON.parse(stdout);

              scope.loaded = true;
            });
          });
          scope.deps = [];
        }
      };
    }
    , ModsOutdatedDirective = function ModsOutdatedDirective(npmFactory) {
      return {
        'restrict': 'E',
        'templateUrl': 'templates/directives/mods-outdated.html',
        'link': function linkingFunction(scope) {

          npmFactory.outdated().then(function onResolve(stdout) {
            scope.$evalAsync(function evalAsync() {

              scope.deps = JSON.parse(stdout);

              scope.loaded = true;
            });
          });
          scope.deps = [];
        }
      };
    };


  angular.module('electron.mods.directives', [])

  .directive('modsInstalledDirective', ['npmFactory', ModsInstalledDirective])
  .directive('modsOutdatedDirective', ['npmFactory', ModsOutdatedDirective]);
}(angular));
