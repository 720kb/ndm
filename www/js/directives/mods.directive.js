/*global angular*/
(function withAngular(angular) {
  'use strict';

  var ModsInstalledDirective = function ModsInstalledDirective($rootScope, $window, npmFactory, loadingService, $log) {
      return {
        'restrict': 'E',
        'templateUrl': 'templates/mods-directive.html',
        'link': function linkingFunction(scope) {

          var json
            , choosePackageVersion = function choosePackageVersion() {

              scope.errorUpdating = undefined;
              scope.updating = undefined;
              scope.showVersionDialog = true;
              loadingService.finished();
            }
            , installVersionPackage = function installVersionPackage() {

              scope.errorUpdating = undefined;
              scope.updating = true;
              loadingService.loading();

              npmFactory.update(scope.selectedPackage.name, scope.projectPath, scope.selectedVersion, scope.selectedEnv)
              .then(function onUpdated() {

                scope.$evalAsync(function evalAsync() {
                  scope.showVersionDialog = undefined;
                  scope.updating = undefined;
                  scope.errorUpdating = undefined;
                  loadingService.finished();
                });
              }).catch(function onCatch(err) {

                $log.error('Error updating lib', err);

                scope.$evalAsync(function evalAsync() {
                  scope.errorUpdating = true;
                  scope.updating = undefined;
                  loadingService.finished();
                });
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

                  angular.forEach(json.devDependencies, function forEachDevDep(value, key) {

                    angular.forEach(json.dependencies, function forEachDep(v, k) {

                      if (key === k) {

                        json.dependencies[k].env = 'dev';
                      }
                    });
                  });
                  //send total installed pkgs number
                  $rootScope.$emit('project:total-installed-packages', json.dependencies.length);
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
            , unregisterOnUpdatePackage = $rootScope.$on('user:install-version-package', function onUpdateUpackage() {

              choosePackageVersion();
            })
            , unregisterOnInstallVersionPackage = $rootScope.$on('user:update-package', function onInstallVersionPackage () {

              if (scope.selectedPackage &&
                scope.selectedPackage.latest) {

                  scope.selectedVersion = scope.selectedPackage.latest;

                  installVersionPackage();
              } else {

                $window.dialog.showErrorBox('npm', 'The package is already up to latest version');
              }
            })
            , unregisterOnGlobalSelected = $rootScope.$on('user:selected-global', function onGlobalSelected() {

              scope.$evalAsync(function evalAsync() {
                scope.json = {};
                scope.loaded = undefined;
                scope.showVersionDialog = undefined;
                paginate();
              });
            })
            , unregisterOnProjectSelected = $rootScope.$on('user:selected-project', function onSelectedProject(eventInfo, data) {

              scope.$evalAsync(function evalAsync() {

                $rootScope.globally = false;
                scope.json = {};
                scope.loaded = undefined;
                scope.showVersionDialog = undefined;
                scope.projectPath = data.path;
                paginate(data.path);
              });
            });

          scope.selectPackage = selectPackage;
          scope.choosePackageVersion = choosePackageVersion;
          scope.installVersionPackage = installVersionPackage;

          //launch global list
        //  $rootScope.$emit('user:selected-global');

          scope.$on('$destroy', function onScopeDestroy() {

            unregisterOnProjectSelected();
            unregisterOnUpdatePackage();
            unregisterOnInstallVersionPackage();
            unregisterOnGlobalSelected();
          });
        }
      };
    };

  angular.module('electron.mods.directives', [])

  .directive('modsInstalledDirective', ['$rootScope', '$window', 'npmFactory', 'loadingService', '$log', ModsInstalledDirective]);
}(angular));
