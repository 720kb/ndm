import angular from 'angular';
const moduleName = 'npm-ui.left-bar';

angular.module(moduleName, [])
  .controller('LeftBarController', /*@ngInject*/ function LeftBarController($rootScope, $window, npmGlobal, loadingFactory) {

    this.selectGlobal = () => {

      this.selectedProject = npmGlobal;
      this.global = true;
      loadingFactory.loading();
      $rootScope.$emit('left-bar:select-project', {
        'path': this.selectedProject
      });
    };

    this.selectProject = (item, event) => {
      if (item) {

        this.global = false;
        this.selectedProject = item;
        loadingFactory.loading();
        $rootScope.$emit('left-bar:select-project', {
          'path': this.selectedProject.path
        });
      }
      event.stopPropagation();//prevent folder deletion
    };

    this.deleteProject = (item, event) => {

      loadingFactory.finished();

      if (item &&
        item === this.selectedProject) {

        delete this.selectedProject;
        $rootScope.$emit('left-bar:delete-project', {
          'dirName': item.dirName
        });
      }
      event.stopPropagation();//prevent project selection
    };
  });

export default moduleName;
