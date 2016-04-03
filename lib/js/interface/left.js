import angular from 'angular';
const moduleName = 'npm-ui.left-bar';

angular.module(moduleName, [])
  .controller('LeftBarController', /*@ngInject*/ function LeftBarController($rootScope, $window, $log) {

    this.selectGlobal = () => {

      this.selectedProject = '<global>';
      $rootScope.$emit('left-bar:select-project', {
        'dirName': this.selectedProject
      });
    };

    this.selectProject = (item, $event) => {

      $log.info($event);
      if (item) {

        this.selectedProject = item;
        $rootScope.$emit('left-bar:select-project', {
          'path': this.selectedProject.path
        });
      } else {

        $window.dialog.showErrorBox('Error', 'No project selected. Please select one.');
      }
    };

    this.deleteProject = (item, $event) => {

      $log.info($event);
      if (item &&
        item === this.selectedProject) {

        delete this.selectedProject;
        $rootScope.$emit('left-bar:delete-project', {
          'dirName': item
        });
      } else {

        $window.dialog.showErrorBox('Error', 'No project selected. Please select one to remove.');
      }
    };
  });

export default moduleName;
