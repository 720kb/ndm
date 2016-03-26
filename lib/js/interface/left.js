import angular from 'angular';
const moduleName = 'npm-ui.left-bar';

angular.module(moduleName, [])
  .controller('LeftBarController', /*@ngInject*/ function LeftBarController($rootScope) {
    console.info('LEFT')
    this.projectsName = [];
    $rootScope.$on('top-menu:new-project', (eventInfos, payload) => {

      console.info(payload);
      if (payload) {

        this.projectsName.unshift(payload);
      }
    });
  });

export default moduleName;
