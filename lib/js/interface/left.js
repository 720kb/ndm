/*global require*/
import angular from 'angular';
const moduleName = 'npm-ui.left-bar'
  , electron = require('electron')
  , {remote} = electron
  , {Menu, MenuItem} = remote;

angular.module(moduleName, [])
  .controller('LeftBarController', /*@ngInject*/ function LeftBarController($rootScope, $scope, $window, $log, npm, npmGlobal, errorsService, loadingFactory) {

    const unregisterLeftBarSelectedProjectNpmInstall = $rootScope.$on('left-bar:selected-project-npm-install', (eventInformation, data) => {
      let folder = data.path.path
        , projectName = data.path.dirName;

      $scope.$apply(() => {
        this.npmInstallingProjects[projectName] = true;
      });

      npm.npmInFolder(folder).catch(error => {
        delete this.npmInstallingProjects[projectName];
        $log.error(`Configuring npm for $ npm install,  in ${folder}...`, error);
        errorsService.showErrorBox('Error', `Error configuring npm for install in folder ${folder}: ${error}`);
      }).then(npmInFolder => {
        npmInFolder.launchInstall().then(() => {
          $log.info('Finished npm install in folder ${folder}');
          delete this.npmInstallingProjects[projectName];
        }).catch(err => {
          $log.error(err);
          delete this.npmInstallingProjects[projectName];
        });
      });
    });

    this.selectGlobal = () => {

      this.selectedProject = npmGlobal;
      this.global = true;
      $rootScope.$emit('left-bar:select-project', {
        'path': this.selectedProject
      });
    };

    this.rightClickMenu = item => {

      let projectsContextMenu = new Menu()
        , selectedProject = this.selectedProject;

      projectsContextMenu.append(new MenuItem({
        'label': 'Npm Install',
        click() {
        $rootScope.$emit('left-bar:selected-project-npm-install', {
          'path': item
        });
      }}));
      projectsContextMenu.append(new MenuItem({'type': 'separator'}));
      projectsContextMenu.append(new MenuItem({'label': 'Remove',
        click() {

        $scope.$evalAsync(() => {
          this.removedProject = item;
          if (item === selectedProject) {

            delete this.selectedProject;
            $rootScope.$emit('left-bar:delete-selected-project');
          }
        });

        $rootScope.$emit('left-bar:delete-project', {
          'dirName': item.dirName
        });
      }}));

      projectsContextMenu.popup(remote.getCurrentWindow());
    };

    this.selectProject = (item, event) => {
      if (item) {

        this.global = false;
        this.selectedProject = item;
        $rootScope.$emit('left-bar:select-project', {
          'path': this.selectedProject.path
        });
      }
      event.stopPropagation();//prevent folder deletion
    };

    this.deleteProject = (item, event) => {

      loadingFactory.finished();

      if (item) {
        if (item === this.selectedProject) {

          delete this.selectedProject;
          $rootScope.$emit('left-bar:delete-selected-project');
        }
        $rootScope.$emit('left-bar:delete-project', {
          'dirName': item.dirName
        });
      }

      event.stopPropagation();//prevent project selection
    };

    this.npmInstallingProjects = [];
    $scope.$on('$destroy', () => {

      unregisterLeftBarSelectedProjectNpmInstall();
    });
  });

export default moduleName;
