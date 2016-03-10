/*global angular*/

(function withAngular(angular) {
  'use strict';

  var HomeController = function HomeController($rootScope, $scope, $window) {

    var that = this
      , updatePackage = function updatePackage() {

        $rootScope.$emit('user:update-package');
      }
      , installVersionPackage = function installVersionPackage() {

        $rootScope.$emit('user:install-version-package');
      }
      , selectGlobal = function selectGlobalDir() {

          $rootScope.globally = true;
          that.selectedProject = undefined;
          that.showMenuButtons = undefined;
          $rootScope.$emit('user:selected-global');
        }
      , selectProject = function selectProject(project, event) {
        if (event) {
          event.preventDefault();
        }

        $rootScope.globally = undefined;
        that.selectedProject = project;
        $rootScope.$emit('user:selected-project', project);
        that.showMenuButtons = undefined;
        if (event) {
          event.stopPropagation();
        }
      }
      , deleteProject = function deleteProject(project, event) {

        if (event) {
          event.preventDefault();
        }

        var index = $rootScope.projectsList.indexOf(project);

        that.showMenuButtons = undefined;

        $rootScope.projectsList.splice(index, 1);
        $rootScope.$emit('user:deleted-project', project);

        if (event) {
          event.stopPropagation();
        }
      }
      , chooseProjectDir = function chooseProject() {

        var duplicated = false
          , splitForName
          , dir = $window.dialog.showOpenDialog({
          'properties': [
            'openDirectory'
          ]
        });

        if (dir && dir[0]) {
          //check if not a duplicate
          if ($rootScope.projectsList &&
            $rootScope.projectsList.length > 0) {

            angular.forEach($rootScope.projectsList, function forEachProject(value) {

              if (value.path[0] === dir[0]) {

                duplicated = true;
              }
            });
          }

          if (duplicated) {

            $window.dialog.showErrorBox('Error', 'You already added this folder project');
            return;
          }

          if (!duplicated && dir[0].split(/\//g).pop()) {

            splitForName = dir[0].split(/\//g).pop();

            $rootScope.$emit('user:added-new-project', {
              'name': splitForName,
              'path': dir
            });
          } else {

            $window.dialog.showErrorBox('Error', 'Please select a project folder');
          }
        }
      }
      , unregisterOnSelectedPackage = $rootScope.$on('user:selected-package', function onSelectedPackage() {
        that.showMenuButtons = true;
      })
      , unregisterOnNewProject = $rootScope.$on('user:added-new-project', function onNewProject(eventInfo, data) {

        that.showMenuButtons = undefined;

        $scope.$evalAsync(function evalAsync() {

          $rootScope.projectsList.unshift(data);
          selectProject(data);
        });
      });

      $scope.$on('$destroy', function scopeDestroy() {

        unregisterOnNewProject();
        unregisterOnSelectedPackage();
      });

      that.chooseProjectDir = chooseProjectDir;
      that.selectGlobal = selectGlobal;
      that.selectProject = selectProject;
      that.deleteProject = deleteProject;
      that.updatePackage = updatePackage;
      that.installVersionPackage = installVersionPackage;
  };

  angular.module('electron.home.controllers', [])
    .controller('HomeController', ['$rootScope', '$scope', '$window', HomeController]);
}(angular));
