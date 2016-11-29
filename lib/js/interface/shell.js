/*global require*/
import angular from 'angular';
import npmApi from '../npm/npm-api.js';

const electron = require('electron')
  , fs = require('fs')
  , shell = electron.shell
  , remote = electron.remote
  , dialog = electron.remote.dialog
  , moduleName = 'npm-ui.shell';

angular.module(moduleName, [
  npmApi
])
.controller('ShellController', /*@ngInject*/ function HomeController($rootScope, $scope, $window, $log, $document, npm, npmGlobal, errorsService, loadingFactory) {
  const localStorageName = 'projects'
    , isNpmInstalled = npm.isNpmInstalled()
    , savedProjects = JSON.parse($window.localStorage.getItem(localStorageName))
    , chooseProjectDir = files => {

      $scope.$apply(() => {

        files.forEach(folder => {

          if (folder) {
            const newDir = folder
              , alreadyPresent = this.projects.some(element => {

                return element.path &&
                  element.path === newDir;
              })
              , dirName = newDir.substring(newDir.lastIndexOf('/') + 1);

            if (alreadyPresent) {

              errorsService.showErrorBox('Duplicate', `You already added this project folder: /${dirName}`);
            } else {
              const newProject = {
                dirName,
                'path': newDir
              };

              this.projects.unshift(newProject);
              $window.localStorage.setItem(localStorageName, JSON.stringify(this.projects));
            }
          }
        });
      });
    }
    , unregisterDragAndDropListener = $rootScope.$on('shell:file-drop', (eventInfo, data) => {
      if (data &&
        data.dataTransfer &&
        data.dataTransfer.files) {

          let paths = []
            , files = data.dataTransfer.files;

          Object.keys(files).forEach(file => {
            if (fs.lstatSync(files[file].path).isDirectory()) {
              paths.push(files[file].path);
            }
          });

          if (paths &&
            paths.length > 0) {

            chooseProjectDir(paths);
          }
      }
    })
    , unregisterNpmGlobalPrivilegeCheckResult = $rootScope.$on('npm:global-privilege-check', (eventInfo, data) => {

      try {
        if (data.group === data.processGroup) {
          $log.info('Global is enabled');
          this.globalDisabled = false;
        } else {
          $log.info('Global is disabled');
          this.globalDisabled = true;
        }
      } catch (exc) {

        $log.info('Global is disabled but there is a problem...', exc);
        this.globalDisabled = true;
      }
    })
    , unregisterLeftBarSelectProjectListener = $rootScope.$on('left-bar:select-project', (eventInfo, data) => {

      this.showMenuButtons = false;
      this.currentSelectedPackages = [];
      if (data &&
      data.path === npmGlobal) {

        this.globalSelected = true;
      } else {

        this.globalSelected = false;
      }
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
    });

  if (savedProjects &&
    savedProjects.length) {

    this.projects = savedProjects;
  } else {

    this.projects = [];
  }

  this.enableGlobal = () => {

    const buttons = ['Cancel', 'Read Tutorial', 'Done']/*, 'Move global folder', 'Fix permissions']*/;

    dialog.showMessageBox({
      'title': 'Global Access',
      'message': 'ndm wants to access your global folder',
      'detail': 'Please follow the tutorial:\nhttps://docs.npmjs.com/getting-started/fixing-npm-permissions\n\nClick "Done" when you have fixed npm permissions.\n',
      buttons
    }, buttonIndex => {
      //move global folder
      if (buttonIndex === 1) {
        this.openBrowserLink('https://docs.npmjs.com/getting-started/fixing-npm-permissions#option-1-change-the-permission-to-npms-default-directory');
      }
      if (buttonIndex === 2) {
        remote.app.relaunch();
        remote.app.quit();
      }
      /*
      THESE BUTTONS LAUNCHES AUTOMATIC FIX FOR PERMISSIONS, STILL NOT TESTED WELL SO THEY ARE COMMENTED
      if (buttonIndex === 1) {
        npm.changeGlobalFolder().then(() => {
          this.globalDisabled = false;
        }).catch(error => {

          errorsService.handleError('Error', `Not able to change global folder for npm: ${error}`);
        });
      }

      //fix permissions
      if (buttonIndex === 2) {

        npm.changeGlobalFolder().then(() => {
          this.globalDisabled = false;
        }).catch(error => {

          errorsService.handleError('Error', `Not able to change permissions in global npm folder: ${error}`);
        });
      }*/
    });
  };

  this.updateNpm = () => {

    if (!this.updatingNpm) {

      this.updatingNpm = true;

      npm.updateNpmGlobally().then(() => {

        $rootScope.$emit('shell:updated-npm');
        this.updatingNpm = undefined;
      }).catch(error => {

        this.updatingNpm = undefined;
        errorsService.handleError('Error updating npm...', error);
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

  this.selectPackages = packages => {

    this.currentSelectedPackages = packages;
    this.showMenuButtons = true;
    $rootScope.$emit('shell:selected-packages', packages);
  };

  this.openBrowserLink = url => {

    shell.openExternal(url);
  };

  if (isNpmInstalled.toString().toLowerCase().includes('command not found') ||
    isNpmInstalled.toString().toLowerCase().includes('command failed')) {
    loadingFactory.freeze();
    dialog.showMessageBox({
      'title': 'npm not installed',
      'message': 'You have not installed npm on your machine.',
      'detail': 'Relaunch ndm as you have installed it.',
      'buttons': ['Quit', 'Relaunch']
    }, buttonIndex => {
      if (buttonIndex === 0) {
        remote.app.quit();
      }
      if (buttonIndex === 1) {
        remote.app.relaunch();
        remote.app.quit();
      }
    });
  }

  $rootScope.$on('$destroy', () => {

    unregisterNpmGlobalPrivilegeCheckResult();
    unregisterLeftBarSelectProjectListener();
    unregisterLeftBarDeleteProjectListener();
    unregisterDragAndDropListener();
  });
});

export default moduleName;
