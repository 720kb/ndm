import angular from 'angular';
const moduleName = 'npm-ui.top-menu'
  , localStorageName = 'top-menu-projects';

angular.module(moduleName, [])
.controller('TopMenuController', /*@ngInject*/ function TopMenuController($window) {
});

export default moduleName;
