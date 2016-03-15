import angular from 'angular';
const moduleName = 'npm-ui.shell';

angular.module(moduleName, [])
  .controller('ShellController', /*@ngInject*/ function HomeController($window) {

    this.openBrowserLink = url => {

      $window.shell.openExternal(url);
    };
  });

export default moduleName;
