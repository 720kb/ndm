import angular from 'angular';
import npmApi from '../npm/npm-api.js';

var gui = require('nw.gui');
const moduleName = 'npm-ui.shell';

angular.module(moduleName, [
  npmApi
])
.controller('ShellController', /*@ngInject*/ function HomeController($scope, $window, $log, $document, npm) {
  const localStorageName = 'projects'
   , savedProjects = JSON.parse($window.localStorage.getItem(localStorageName));

  if (savedProjects &&
    savedProjects.length) {

    this.projects = savedProjects;
  } else {

    this.projects = [];
  }

  this.updateNpm = () => {

    $log.info('Launch cli update!');
    npm.npmGlobal().then(npmInFolder =>
      npmInFolder.outdated()
      .then(infos => $log.info(infos))
      .catch(error => $log.error(error)))
    .catch(error => $log.error(error));
  };

  this.chooseProjectDir = files => {

    $scope.$apply(() => {

      if (files &&
        files[0]) {
        const newDir = files[0]
          , alreadyPresent = this.projects.some(element => {

            return element.path &&
              element.path === newDir;
          });

        if (alreadyPresent) {

          $window.dialog.showErrorBox('Error', 'You already added this project folder');
        } else {
          const newProject = {
            'dirName': newDir.name,
            'path': newDir.path
          };

          this.projects.unshift(newProject);
          $window.localStorage.setItem(localStorageName, JSON.stringify(this.projects));
        }
      } else {

        $window.dialog.showErrorBox('Error', 'Please select a project folder');
      }
    });
  };

  this.selectPackage = project => {

    this.currentSelectedPackage = project;
    this.showMenuButtons = true;
  };

  this.openBrowserLink = url => {

    gui.Shell.openExternal(url);
  };
});

export default moduleName;
