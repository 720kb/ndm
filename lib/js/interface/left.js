import angular from 'angular';
const moduleName = 'npm-ui.left-bar';

angular.module(moduleName, [])
  .controller('LeftBarController', /*@ngInject*/ function LeftBarController($log) {

    $log.info(this);
  });

export default moduleName;
