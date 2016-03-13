import angular from 'angular';

angular.module('npm-ui.shell', [])
  .controller('ShellController', /*@ngInject*/ function HomeController($rootScope, $scope, $window) {

    const openBrowserLink = url => {

      $window.shell.openExternal(url);
    }
    , updatePackage = () => {

      $rootScope.$emit('user:update-package');
    }
    , installVersionPackage = () => {

      $rootScope.$emit('user:install-version-package');
    }
    , selectGlobal = () => {

      $rootScope.globally = true;
      this.selectedProject = undefined;
      this.showMenuButtons = undefined;
      $rootScope.$emit('user:selected-global');
    }
    , selectProject = (project, event) => {

      if (event) {

        event.preventDefault();
      }

      $rootScope.globally = undefined;
      this.selectedProject = project;
      $rootScope.$emit('user:selected-project', project);
      this.showMenuButtons = undefined;
      if (event) {

        event.stopPropagation();
      }
    }
    , deleteProject = (project, event) => {

      if (event) {

        event.preventDefault();
      }
      const index = $rootScope.projectsList.indexOf(project);

      this.showMenuButtons = undefined;
      $rootScope.projectsList.splice(index, 1);
      $rootScope.$emit('user:deleted-project', project);
      if (event) {

        event.stopPropagation();
      }
    }
    , chooseProjectDir = () => {

      const dir = $window.dialog.showOpenDialog({
          'properties': [
            'openDirectory'
          ]
        });
      let duplicated = false
       , splitForName;

      if (dir && dir[0]) {
        //check if not a duplicate
        if ($rootScope.projectsList &&
          $rootScope.projectsList.length > 0) {

          $rootScope.projectsList.forEach(element => {

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
    }
    , unregisterOnTotalInstalledPkg = $rootScope.$on('project:total-installed-packages', (eventInfo, data) => {

      if ($rootScope.globally) {

        $rootScope.globalInstalledCount = data;
      }
    })
    , unregisterOnSelectedPackage = $rootScope.$on('user:selected-package', () => {

      this.showMenuButtons = true;
    })
    , unregisterOnNewProject = $rootScope.$on('user:added-new-project', (eventInfo, data) => {

      this.showMenuButtons = undefined;
      $scope.$evalAsync(() => {

        $rootScope.projectsList.unshift(data);
        selectProject(data);
      });
    });

    $scope.$on('$destroy', () => {

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
  });

export default 'npm-ui.shell';
