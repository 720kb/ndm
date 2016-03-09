/*global angular*/
(function withAngular(angular) {
  'use strict';

  var ModsInstalledDirective = function ModsInstalledDirective($rootScope, npmFactory, loadingService, $log) {
      return {
        'restrict': 'E',
        'templateUrl': 'templates/mods-directive.html',
        'link': function linkingFunction(scope) {

          var json
            , choosePackageVersion = function choosePackageVersion() {
              scope.showVersionDialog = true;
            }
            , updatePackage = function updatePackage() {

              scope.errorUpdating = undefined;

              npmFactory.update(scope.selectedPackage.name, scope.projectPath, scope.selectedVersion, scope.selectedEnv)
              .then(function onUpdated() {
                scope.showVersionDialog = undefined;

              }).catch(function onCatch(err) {
                $log.info('Error updating lib', err);
                scope.errorUpdating = true;
              });
            }
            , selectPackage = function selectEmitPackage(item) {

              scope.selectedPackage = item;
              scope.showVersionDialog = undefined;
              scope.selectedVersion = item.latest;
              scope.selectedEnv = item.env;

              $rootScope.$emit('user:selected-package', {
                'package': scope.selectedPackage,
                'path': scope.projectPath,
                'env': scope.selectedEnv
              });
            }
            , paginate = function Paginate(projectPath) {

              scope.json = {};
              scope.loaded = undefined;
              scope.error = undefined;
              loadingService.loading();

              npmFactory.list($rootScope.globally, projectPath).then(function onListResult(results) {

                json = JSON.parse(results);
                //set which are devDeps
                if (json &&
                  Object.keys(json.dependencies) &&
                  Object.keys(json.dependencies).length > 0 &&
                  Object.keys(json.devDependencies) &&
                  Object.keys(json.devDependencies).length > 0) {

                  angular.forEach(json.devDependencies, function forEachDevDep(value, key){

                    angular.forEach(json.dependencies, function forEachDep(v, k) {

                      if (key === k) {

                        json.dependencies[k].env = 'dev';
                      }
                    });
                  });
                }

                npmFactory.outdated($rootScope.globally, projectPath).then(function onOutdatedResult(result) {

                  if (result &&
                    result.length > 0) {

                    var outdated = JSON.parse(result);

                    if (Object.keys(outdated) && Object.keys(outdated).length > 0) {

                      angular.forEach(outdated, function forEachItem(value, key) {

                        angular.forEach(json.dependencies[0], function forEachOutdated(v, k) {
                          if (key === k) {

                            json.dependencies[k].latest = outdated[key].latest;
                          }
                        });
                      });
                    }
                  }
                  scope.$evalAsync(function evalAsync() {

                    scope.json = json;
                    scope.loaded = true;
                    loadingService.finished();
                  });
                }).catch(function onCatch(err) {

                  $log.info('Error1', err);

                  scope.$evalAsync(function evalAsync() {
                    scope.error = err;
                    scope.json = {};
                    scope.loaded = true;
                    loadingService.finished();
                  });
                });
              }).catch(function onCatch(error) {

                $log.info('Error2', error);
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

  .directive('modsInstalledDirective', ['$rootScope', 'npmFactory', 'loadingService', '$log', ModsInstalledDirective]);
}(angular));
