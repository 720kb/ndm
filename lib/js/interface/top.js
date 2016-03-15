import angular from 'angular';
const moduleName = 'npm-ui.top-menu';

angular.module(moduleName, [])
  .controller('TopMenuController', /*@ngInject*/ function TopMenuController($log) {

    $log.info(this);
  });

export default moduleName;
