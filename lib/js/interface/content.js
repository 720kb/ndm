import angular from 'angular';
const moduleName = 'npm-ui.content';

angular.module(moduleName, [])
  .controller('ContentController', /*@ngInject*/ function ContentController($log) {

    $log.info(this);
  });

export default moduleName;
