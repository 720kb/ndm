'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var angular = _interopDefault(require('angular'));
var electron = _interopDefault(require('electron'));
var remote = _interopDefault(require('remote'));

angular.module('npm-ui.shell', []).controller('ShellController', /*@ngInject*/["$rootScope", "$scope", "$window", function HomeController($rootScope, $scope, $window) {
  var _this = this;

  var openBrowserLink = function openBrowserLink(url) {

    $window.shell.openExternal(url);
  },
      updatePackage = function updatePackage() {

    $rootScope.$emit('user:update-package');
  },
      installVersionPackage = function installVersionPackage() {

    $rootScope.$emit('user:install-version-package');
  },
      selectGlobal = function selectGlobal() {

    $rootScope.globally = true;
    _this.selectedProject = undefined;
    _this.showMenuButtons = undefined;
    $rootScope.$emit('user:selected-global');
  },
      selectProject = function selectProject(project, event) {

    if (event) {

      event.preventDefault();
    }

    $rootScope.globally = undefined;
    _this.selectedProject = project;
    $rootScope.$emit('user:selected-project', project);
    _this.showMenuButtons = undefined;
    if (event) {

      event.stopPropagation();
    }
  },
      deleteProject = function deleteProject(project, event) {

    if (event) {

      event.preventDefault();
    }
    var index = $rootScope.projectsList.indexOf(project);

    _this.showMenuButtons = undefined;
    $rootScope.projectsList.splice(index, 1);
    $rootScope.$emit('user:deleted-project', project);
    if (event) {

      event.stopPropagation();
    }
  },
      chooseProjectDir = function chooseProjectDir() {

    var dir = $window.dialog.showOpenDialog({
      'properties': ['openDirectory']
    });
    var duplicated = false,
        splitForName = void 0;

    if (dir && dir[0]) {
      //check if not a duplicate
      if ($rootScope.projectsList && $rootScope.projectsList.length > 0) {

        $rootScope.projectsList.forEach(function (element) {

          if (element.path[0] === dir[0]) {

            duplicated = true;
          }
        });
      }

      if (duplicated) {

        return $window.dialog.showErrorBox('Error', 'You already added this folder project');
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
  },
      unregisterOnTotalInstalledPkg = $rootScope.$on('project:total-installed-packages', function (eventInfo, data) {

    if ($rootScope.globally) {

      $rootScope.globalInstalledCount = data;
    }
  }),
      unregisterOnSelectedPackage = $rootScope.$on('user:selected-package', function () {

    _this.showMenuButtons = true;
  }),
      unregisterOnNewProject = $rootScope.$on('user:added-new-project', function (eventInfo, data) {

    _this.showMenuButtons = undefined;
    $scope.$evalAsync(function () {

      $rootScope.projectsList.unshift(data);
      selectProject(data);
    });
  });

  $scope.$on('$destroy', function () {

    unregisterOnNewProject();
    unregisterOnSelectedPackage();
    unregisterOnTotalInstalledPkg();
  });

  this.chooseProjectDir = chooseProjectDir;
  this.selectGlobal = selectGlobal;
  this.selectProject = selectProject;
  this.deleteProject = deleteProject;
  this.updatePackage = updatePackage;
  this.installVersionPackage = installVersionPackage;
  this.openBrowserLink = openBrowserLink;
  $rootScope.globally = true;
}]);

var npmUi = 'npm-ui.shell';

angular.module('electron', ['720kb.fx', 'LocalStorageModule', npmUi]).config( /*@ngInject*/["localStorageServiceProvider", function (localStorageServiceProvider) {

  localStorageServiceProvider.setPrefix('electron');
}]).run( /*@ngInject*/["$window", "sessionFactory", function ($window, sessionFactory) {

  $window.remote = remote;
  //open links in browser and items in folder
  $window.shell = electron.shell;

  $window.dialog = $window.remote.require('dialog');
  sessionFactory.initialize(); ///FIXME!
}]);
//# sourceMappingURL=index.js.map