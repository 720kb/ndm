/*global angular*/
(function withAngular(angular) {
  'use strict';

  var ModsInstalledDirective = function ModsInstalledDirective($rootScope, npmFactory, loadingService) {
      return {
        'restrict': 'E',
        'templateUrl': 'templates/mods-directive.html',
        'link': function linkingFunction(scope) {

          var json
            , choosePackageVersion = function choosePackageVersion() {
              scope.showVersionDialog = true;
              console.log(scope.selectedPackage);
            }
            , updatePackage = function updatePackage(version) {

              npmFactory.update(scope.selectedPackage, scope.projectPath, version).then(function onUpdated(result) {
                scope.showVersionDialog = undefined;
                console.log('updated pakcage', scope.selectedPackage);
              }).catch(function onCatch(err) {
                return err;
              });
            }
            , selectPackage = function selectEmitPackage(item) {

              scope.selectedPackage = item;
              scope.showVersionDialog = undefined;
              $rootScope.$emit('user:selected-package');
            }
            , paginate = function Paginate(projectPath) {

              scope.json = {};
              scope.loaded = undefined;
              scope.error = undefined;
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
                }).catch(function onCatch(err) {

                  scope.$evalAsync(function evalAsync() {
                    scope.error = err;
                    scope.json = {};
                    scope.loaded = true;
                    loadingService.finished();
                  });
                });
              }).catch(function onCatch(error) {

                scope.$evalAsync(function evalAsync() {

                  scope.error = error;
                  scope.json = {};
                  scope.loaded = true;
                  loadingService.finished();
                });
              });
            }
            , unregisterOnUpdatePackage = $rootScope.$on('user:update-package', function onUpdateUpackage(eventInfo, data) {

              choosePackageVersion();
            })
            , unregisterOnProjectSelected = $rootScope.$on('user:selected-project', function onSelectedProject(eventInfo, data) {

              scope.$evalAsync(function evalAsync() {

                scope.json = {};
                scope.loaded = undefined;
                scope.showVersionDialog = undefined;
                scope.projectPath = data.path;
                paginate(data.path);
              });
            });

          scope.selectPackage = selectPackage;
          scope.choosePackageVersion = choosePackageVersion;
          scope.updatePackage = updatePackage;
          scope.$on('$destroy', function onScopeDestroy() {

            unregisterOnProjectSelected();
            unregisterOnUpdatePackage();
          });
        }
      };
    };


  angular.module('electron.mods.directives', [])

  .directive('modsInstalledDirective', ['$rootScope', 'npmFactory', 'loadingService', ModsInstalledDirective]);
}(angular));
