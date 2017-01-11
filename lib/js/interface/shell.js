/*global process window require*/
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
.controller('ShellController', /*@ngInject*/ function HomeController($rootScope,
  $scope,
  $log,
  $document,
  npm,
  npmGlobal,
  errorsService,
  loadingFactory,
  assets) {
  const isNpmInstalled = npm.isNpmInstalled()
    , chooseProjectDir = files => {
      let pathExt;

      if (process &&
        process.platform === 'win32') {
        //if windows path has backslashes
        pathExt = '\\';
      } else {
        pathExt = '/';
      }

      if (files &&
        files.length > 0) {
        $scope.$apply(() => {

        files.forEach(folder => {

          if (folder) {
            const newDir = folder
              , alreadyPresent = this.projects.some(element => {

                return element.path &&
                  element.path === newDir;
              })
              , dirName = newDir.substring(newDir.lastIndexOf(pathExt) + 1);

            if (!alreadyPresent) {
              const newProject = {
                dirName,
                'path': newDir
              };

              this.projects.unshift(newProject);
              assets.projects.save(this.projects);
            }
          }
        });
      });
      }
    }
    , unregisterDragAndDropListener = $rootScope.$on('shell:file-drop', (eventInfo, data) => {
      if (data &&
        data.dataTransfer &&
        data.dataTransfer.files) {

          const paths = []
            , files = data.dataTransfer.files;

          Object.keys(files).forEach(file => {

            if (fs.lstatSync(files[file].path).isDirectory()) {

              paths.push(files[file].path);
            }
          });

          if (paths &&
            paths.length) {

            chooseProjectDir(paths);
          }
      }
    })
    , unregisterNpmGlobalPrivilegeCheckResult = $rootScope.$on('npm:global-privilege-check', (eventInfo, data) => {

      try {

        if (data.user === data.processUser ||
          data.group === data.processGroup) {

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

      const allProjects = this.projects;

      if (data &&
        data.project &&
        data.project.path &&
        this.projects.length > 0) {

        allProjects.forEach((item, key) => {
          if (item.path === data.project.path) {

            this.projects.splice(key, 1);
          }
        });

        assets.projects.save(this.projects);
        $log.info('Deleted project folder', data);
      } else {

        $log.warn('Delete project event fired BUT projects array is empty!');
      }
    });

  this.projects = assets.projects;
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

  this.checkRegistryStatus = () => {
    if (!this.loadingRegistryStatus) {

      this.loadingRegistryStatus = true;

      npm.pingRegistry().then(response => {
        if (response &&
          response.trim() === '{}') {
          $scope.$apply(() => {
            this.registryStatus = true;
          });
        } else {
          $scope.$apply(() => {
            this.registryStatus = false;
          });
        }
        $scope.$apply(() => {
          this.loadingRegistryStatus = false;
        });
      }).catch(err => {
        $scope.$apply(() => {
          this.registryStatus = false;
          this.loadingRegistryStatus = false;
        });
        $log.error('Unable to ping registry for checking status', err);
      });
    }
  };
  //is npm installed globally?
  if (isNpmInstalled.toString().toLowerCase().includes('command not found') ||
    isNpmInstalled.toString().toLowerCase().includes('command failed')) {
    //loadingFactory.freeze();
    window.alert('not installed');
    /*dialog.showMessageBox({
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
    });*/
  }

  $rootScope.$on('$destroy', () => {
    unregisterNpmGlobalPrivilegeCheckResult();
    unregisterLeftBarSelectProjectListener();
    unregisterLeftBarDeleteProjectListener();
    unregisterDragAndDropListener();
  });
});

export default moduleName;
