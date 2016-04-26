/*global require*/
import angular from 'angular';
import npmApi from '../npm/npm-api.js';

const electron = require('electron')
  , shell = electron.shell
  , dialog = electron.remote.dialog
  , moduleName = 'npm-ui.shell';

angular.module(moduleName, [
  npmApi
])
.controller('ShellController', /*@ngInject*/ function HomeController($scope, $window, $log, $document, npm) {
  const localStorageName = 'projects'
   , savedProjects = JSON.parse($window.localStorage.getItem(localStorageName))
   , chooseProjectDir = files => {

     $scope.$apply(() => {

       if (files &&
         files[0]) {
         const newDir = files[0]
           , alreadyPresent = this.projects.some(element => {

             return element.path &&
               element.path === newDir;
           });

         if (alreadyPresent) {

           dialog.showErrorBox('Duplicate', 'You already added this project folder');
         } else {
           const newProject = {
             'dirName': newDir.substring(newDir.lastIndexOf('/') + 1),
             'path': newDir
           };

           this.projects.unshift(newProject);
           $window.localStorage.setItem(localStorageName, JSON.stringify(this.projects));
         }
       } else {

         dialog.showErrorBox('Error', 'Please select a project folder');
       }
     });
   };

  if (savedProjects &&
    savedProjects.length) {

    this.projects = savedProjects;
  } else {

    this.projects = [];
  }

  this.updateNpm = () => {

    if (!this.updatingNpm) {

      this.updatingNpm = true;

      npm.updateNpmGlobally().then(() => {
        this.updatingNpm = undefined;
      }).catch(error => {

        this.updatingNpm = undefined;
        dialog.showErrorBox('Error updating npm...', error);
      });
    }
  };

  this.openChooser = () => {

    dialog.showOpenDialog({
      'properties': [
        'openDirectory'
      ]
    }, files => {

      chooseProjectDir(files);
    });
  };

  this.selectPackage = project => {

    this.currentSelectedPackage = project;
    this.showMenuButtons = true;
  };

  this.openBrowserLink = url => {

    shell.openExternal(url);
  };
});

export default moduleName;
