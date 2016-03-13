/*global angular*/

angular.module('npm-ui.pagination', [])
  .directive('modsInstalledDirective', /*@ngInject*/ ($rootScope, $window, npmFactory, loadingService, $log) => {

      return {
        'restrict': 'E',
        'templateUrl': 'templates/mods-directive.html',
        'link': (scope) => {

          let json;
          const choosePackageVersion = () => {

              scope.errorUpdating = undefined;
              scope.updating = undefined;
              scope.showVersionDialog = true;
              loadingService.finished();
            }
            , installVersionPackage = () => {

              scope.errorUpdating = undefined;
              scope.updating = true;
              loadingService.loading();

              npmFactory.update(scope.selectedPackage.name, scope.projectPath, scope.selectedVersion, scope.selectedEnv)
              .then(() => {

                scope.$evalAsync(() => {
                  scope.showVersionDialog = undefined;
                  scope.updating = undefined;
                  scope.errorUpdating = undefined;
                  loadingService.finished();
                });
              }).catch((err) => {

                $log.error('Error updating lib', err);

                scope.$evalAsync(() => {
                  scope.errorUpdating = true;
                  scope.updating = undefined;
                  loadingService.finished();
                });
              });
            }
            , selectPackage = (item) => {

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
            , paginate = (projectPath) => {

              scope.json = {};
              scope.loaded = undefined;
              scope.error = undefined;
              loadingService.loading();

              npmFactory.list($rootScope.globally, projectPath).then((results) => {

                json = JSON.parse(results);

                //set which are devDeps
                if (json &&
                  Object.keys(json.dependencies) &&
                  Object.keys(json.dependencies).length > 0 &&
                  Object.keys(json.devDependencies) &&
                  Object.keys(json.devDependencies).length > 0) {

                  json.devDependencies.forEach((value, key) => {

                    json.dependencies.forEach((v, k) => {

                      if (key === k) {

                        json.dependencies[k].env = 'dev';
                      }
                    });
                  });
                  //send total installed pkgs number
                  $rootScope.$emit('project:total-installed-packages', json.dependencies.length);
                }

                npmFactory.outdated($rootScope.globally, projectPath).then((result) => {

                  if (result &&
                    result.length > 0) {

                    let outdated = JSON.parse(result);

                    if (Object.keys(outdated) && Object.keys(outdated).length > 0) {

                      angular.forEach(outdated, (value, key) => {

                        angular.forEach(json.dependencies[0], (v, k) => {
                          if (key === k) {

                            json.dependencies[k].latest = outdated[key].latest;
                          }
                        });
                      });
                    }
                  }
                  scope.$evalAsync(() => {

                    scope.json = json;
                    scope.loaded = true;
                    loadingService.finished();
                  });
                }).catch((err) => {

                  $log.info('Error1', err);

                  scope.$evalAsync(() => {

                    scope.error = err;
                    scope.json = {};
                    scope.loaded = true;
                    loadingService.finished();
                  });
                });
              }).catch((error) => {

                $log.info('Error2', error);
                scope.$evalAsync(() => {

                  scope.error = error;
                  scope.json = {};
                  scope.loaded = true;
                  loadingService.finished();
                });
              });
            }
            , unregisterOnUpdatePackage = $rootScope.$on('user:install-version-package', () => {

              choosePackageVersion();
            })
            , unregisterOnInstallVersionPackage = $rootScope.$on('user:update-package', () => {

              if (scope.selectedPackage &&
                scope.selectedPackage.latest) {

                scope.selectedVersion = scope.selectedPackage.latest;

                installVersionPackage();
              } else {

                $window.dialog.showErrorBox('npm', 'The package is already up to latest version');
              }
            })
            , unregisterOnGlobalSelected = $rootScope.$on('user:selected-global', () => {

              scope.$evalAsync(() => {
                scope.json = {};
                scope.loaded = undefined;
                scope.showVersionDialog = undefined;
                paginate();
              });
            })
            , unregisterOnProjectSelected = $rootScope.$on('user:selected-project', (eventInfo, data) => {

              scope.$evalAsync(() => {

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
          //$rootScope.$emit('user:selected-global');

          scope.$on('$destroy', () => {

            unregisterOnProjectSelected();
            unregisterOnUpdatePackage();
            unregisterOnInstallVersionPackage();
            unregisterOnGlobalSelected();
          });
        }
      };
    });

export default 'npm-ui.pagination';
