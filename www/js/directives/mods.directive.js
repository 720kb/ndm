/*global angular*/
(function withAngular(angular) {
  'use strict';

  var ModsInstalledDirective = function ModsInstalledDirective($rootScope, npmFactory, loadingService) {
      return {
        'restrict': 'E',
        'templateUrl': 'templates/mods-directive.html',
        'link': function linkingFunction(scope) {

          var json
            , paginate = function Paginate(projectPath) {

              loadingService.loading();

              npmFactory.list($rootScope.globally, projectPath).then(function onListResult(results) {

                json = JSON.parse(results);

                npmFactory.outdated($rootScope.globally, projectPath).then(function onOutdatedResult(result) {

                  var outdated = JSON.parse(result);
                  if (Object.keys(outdated) && Object.keys(outdated).length > 0) {

                    angular.forEach(outdated, function forEachItem(value, key) {

                      angular.forEach(json.dependencies, function forEachOutdated(v, k) {
                        if (key === k) {

                          json.dependencies[k].latest = outdated[key].latest;
                        }
                      });
                    });
                  }
                  scope.$evalAsync(function evalAsync() {

                    scope.json = json;
                    scope.loaded = true;
                    loadingService.finished();
                  });
                }).catch(function onCatch() {

                  scope.$evalAsync(function evalAsync() {

                    scope.json = json;
                    scope.loaded = true;
                    loadingService.finished();
                  });
                });
              }).catch(function onCatch() {

                scope.$evalAsync(function evalAsync() {

                  scope.json = json;
                  scope.loaded = true;
                  loadingService.finished();
                });
              });
            }
            , unregisterOnProjectSelected = $rootScope.$on('user:selected-project', function onSelectedProject(eventInfo, data) {

              scope.loaded = undefined;
              scope.$evalAsync(function evalAsync() {

                scope.json = {};

                paginate(data.path);
              });
            });

          scope.$on('$destroy', function onScopeDestroy() {

            unregisterOnProjectSelected();
          });
        }
      };
    };


  angular.module('electron.mods.directives', [])

  .directive('modsInstalledDirective', ['$rootScope', 'npmFactory', 'loadingService', ModsInstalledDirective]);
}(angular));
