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
.controller('ShellController', /*@ngInject*/ function HomeController($rootScope, $scope, $window, $log, $document, npm) {
  const localStorageName = 'projects'
   , unregisterLeftBarSelectProjectListener = $rootScope.$on('left-bar:select-project', () => {
     this.showMenuButtons = false;
     this.currentSelectedPackage = false;
   })
   , unregisterLeftBarDeleteProjectListener = $rootScope.$on('left-bar:delete-project', (eventInfo, data) => {

     if (this.projects.length > 0) {

       angular.forEach(this.projects, (item, key) => {
         if (item.dirName === data.dirName) {

           this.projects.splice(key, 1);
         }
       });

       $window.localStorage.setItem(localStorageName, JSON.stringify(this.projects));
       $log.info('Deleted project folder', data);
     } else {

       $log.warn('Delete project event fired BUT projects array is empty!');
     }
   })
   , savedProjects = JSON.parse($window.localStorage.getItem(localStorageName))
   , chooseProjectDir = files => {

     $scope.$apply(() => {

       files.forEach(folder => {

         if (folder) {

           const newDir = folder
             , alreadyPresent = this.projects.some(element => {

               return element.path &&
                 element.path === newDir;
             });

           let dirName = newDir.substring(newDir.lastIndexOf('/') + 1);

           if (alreadyPresent) {

             dialog.showErrorBox('Duplicate', `You already added this project folder: /${dirName}`);
           } else {
             const newProject = {
               'dirName': dirName,
               'path': newDir
             };

             this.projects.unshift(newProject);
             $window.localStorage.setItem(localStorageName, JSON.stringify(this.projects));
           }
         }
       });
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
        'openDirectory',
        'createDirectory',
        'multiSelections'
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

  $rootScope.$on('$destroy', () => {

    unregisterLeftBarSelectProjectListener();
    unregisterLeftBarDeleteProjectListener();
  });
});

export default moduleName;
