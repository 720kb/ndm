/*global require*/
import angular from 'angular';
const moduleName = 'npm-ui.left-bar'
  , electron = require('electron')
  , {remote} = electron
  , {Menu, MenuItem} = remote
  , Storage = require('electron-storage')
  , fs = require('fs');

angular.module(moduleName, [])
  //create storage file if doesn't exists
  .run(/*@ngInject*/ (appHistoryFile, $log) => {
    //create storage file if not exists
    Storage.isPathExists(appHistoryFile, exist => {
      if (exist) {
        $log.info('Storage: OK');
      } else {
        Storage.set(appHistoryFile, '{}', err => {
          if (err) {
            $log.error('Not able to initialize storage for the app');
          } else {
            $log.info('Storage initialized for the app');
          }
        });
      }
    });
  })
  .controller('LeftBarController', /*@ngInject*/ function LeftBarController($rootScope, $scope, $window, $log, npm, npmGlobal, errorsService, loadingFactory, notificationFactory, appHistoryFile) {

    const unregisterLeftbarEditProject = $rootScope.$on('left-bar:edit-project', (eventInfo, data) => {
        $scope.$apply(() => {
          this.editorFilePath = data.dirName;
        });
      })
      , unregisterLeftBarSelectedProjectNpmInstall = $rootScope.$on('left-bar:selected-project-npm-install', (eventInformation, data) => {
        let folder = data.path.path
          , projectName = data.path.dirName
          , deleteProjectName = item => {

            $scope.$apply(() => {
              delete this.npmInstallingProjects[item];
            });
          };

        $scope.$apply(() => {
          this.npmInstallingProjects[projectName] = true;
        });

        npm.npmInFolder(folder).catch(error => {
          deleteProjectName(projectName);
          $log.error(`Configuring npm for $ npm install,  in ${folder}...`, error);
          errorsService.handleError('Error', `Error configuring npm for install in folder ${folder}: ${error}`);
        }).then(npmInFolder => {
          npmInFolder.launchInstall().then(() => {
            $log.info(`Finished npm install in project ${folder}`);
            notificationFactory.notify(`Finished $ npm install in project ${projectName}`);
            deleteProjectName(projectName);
        }).catch(err => {
          deleteProjectName(projectName);
          $log.error(err);
          errorsService.showErrorBox('Error', `Error running $ npm install in folder ${folder}: ${err}`);
        });
      });
    })
    , unregisterLeftBarSelectedProjectNpmPrune = $rootScope.$on('left-bar:selected-project-npm-prune', (eventInformation, data) => {
      let folder = data.path.path
        , projectName = data.path.dirName
        , deleteProjectName = item => {
          $scope.$apply(() => {
            delete this.npmPruningProjects[item];
          });
        };

      $scope.$apply(() => {
        this.npmPruningProjects[projectName] = true;
      });

      npm.npmInFolder(folder).catch(error => {
        deleteProjectName(projectName);
        $log.error(`Configuring npm for $ npm prune,  in ${folder}...`, error);
        errorsService.handleError('Error', `Error configuring npm for prune in folder ${folder}: ${error}`);
      }).then(npmInFolder => {
        npmInFolder.prune().then(() => {
          $log.info(`Finished npm prune in project ${folder}`);
          notificationFactory.notify(`Finished $ npm prune in project ${projectName}`);
          deleteProjectName(projectName);
        }).catch(err => {
          deleteProjectName(projectName);
          $log.error(err);
          errorsService.showErrorBox('Error', `Error running $ npm prune in folder ${folder}: ${err}`);
        });
      });
    })
    , unregisterLeftBarSelectedProjectNpmDedupe = $rootScope.$on('left-bar:selected-project-npm-dedupe', (eventInformation, data) => {
      let folder = data.path.path
        , projectName = data.path.dirName
        , deleteProjectName = item => {
          $scope.$apply(() => {
            delete this.npmDedupingProjects[item];
          });
        };

      $scope.$apply(() => {
        this.npmDedupingProjects[projectName] = true;
      });

      npm.npmInFolder(folder).catch(error => {
        deleteProjectName(projectName);
        $log.error(`Configuring npm for $ npm dedupe,  in ${folder}...`, error);
        errorsService.handleError('Error', `Error configuring npm for dedupe in folder ${folder}: ${error}`);
      }).then(npmInFolder => {
        npmInFolder.dedupe().then(() => {
          $log.info(`Finished npm dedupe in project folder ${folder}`);
          notificationFactory.notify(`Finished $ npm dedupe in project ${projectName}`);
          deleteProjectName(projectName);
        }).catch(err => {
          $log.error(err);
          errorsService.showErrorBox('Error', `Error running $ npm dedupe in folder ${folder}: ${err}`);
          deleteProjectName(projectName);
        });
      });
    });

    this.selectGlobal = () => {

      this.selectedProject = npmGlobal;
      this.global = true;
      $rootScope.$emit('left-bar:select-project', {
        'path': this.selectedProject
      });
    };

    this.createSnapshot = project => {
      if (project &&
        project.path) {
        Storage.get(appHistoryFile, (err, data) => {
          if (err) {
            errorsService.showErrorBox('Error', `Error creating snapshot: ${err}`);
          } else {
            let storageData = data || {}
              //storageKey can't be project name, you can have subdirs with same name for example.
              , storageKey = project.path.toString().toLowerCase().trim().replace(/\//g, '-');

            if (storageData &&
              storageData[storageKey]) {

              storageData[storageKey].push({
                'datetime': new Date().toString(),
                'status': fs.readFileSync(`${project.path}/package.json`).toString()
              });
            } else {
              storageData[storageKey] = [{
                'datetime': new Date().toString(),
                'status': 'the_package.json'
              }];
            }

            Storage.set(appHistoryFile, storageData, error => {
              if (error) {
                errorsService.showErrorBox('Error', `Error creating ${project.dirName} project snapshot: ${error}`);
              }
            });
          }
        });
      }
    };

    this.openHistoryPrompt = project => {
      this.showHistoryPrompt = true;
    };

    this.rightClickMenu = item => {

      let projectsContextMenu = new Menu()
        , selectedProject = this.selectedProject
        , snapshot = this.createSnapshot
        , openHistory = this.openHistoryPrompt;

      projectsContextMenu.append(new MenuItem({
        'label': 'Npm Install',
        'disabled': true,
        'checked': true,
        click() {
          $rootScope.$emit('left-bar:selected-project-npm-install', {
            'path': item
          });
        }
      }));

      projectsContextMenu.append(new MenuItem({
        'label': 'Prune',
        click() {
          $rootScope.$emit('left-bar:selected-project-npm-prune', {
            'path': item
          });
        }
      }));

      projectsContextMenu.append(new MenuItem({
        'label': 'Dedupe',
        click() {
          $rootScope.$emit('left-bar:selected-project-npm-dedupe', {
            'path': item
          });
        }
      }));

      projectsContextMenu.append(new MenuItem({
        'type': 'separator'
      }));
      projectsContextMenu.append(new MenuItem({'label': 'Snapshot',
        click() {
          snapshot(item);
      }}));

      projectsContextMenu.append(new MenuItem({'label': 'Restore',
        click() {
          openHistory(item);
      }}));

      projectsContextMenu.append(new MenuItem({
        'type': 'separator'
      }));
      projectsContextMenu.append(new MenuItem({'label': 'Edit',
        click() {
          $rootScope.$emit('left-bar:edit-project', {
            'dirName': `${item.path}/package.json`
          });
      }}));

      projectsContextMenu.append(new MenuItem({'label': 'Remove',
        click() {

        $scope.$evalAsync(() => {
          this.removedProject = item;
          if (item === selectedProject) {

            delete this.selectedProject;
            $rootScope.$emit('left-bar:delete-selected-project');
          }
        });

        $rootScope.$emit('left-bar:delete-project', {
          'dirName': item.dirName
        });
      }}));

      projectsContextMenu.popup(remote.getCurrentWindow());
    };

    this.selectProject = (item, event) => {
      if (item) {

        this.global = false;
        this.selectedProject = item;
        $rootScope.$emit('left-bar:select-project', {
          'path': this.selectedProject.path
        });
      }
      event.stopPropagation();//prevent folder deletion
    };

    this.deleteProject = (item, event) => {

      loadingFactory.finished();

      if (item) {
        if (item === this.selectedProject) {

          delete this.selectedProject;
          $rootScope.$emit('left-bar:delete-selected-project');
        }
        $rootScope.$emit('left-bar:delete-project', {
          'dirName': item.dirName
        });
      }

      event.stopPropagation();//prevent project selection
    };

    this.npmInstallingProjects = [];
    this.npmPruningProjects = [];
    this.npmDedupingProjects = [];

    $scope.$on('$destroy', () => {

      unregisterLeftBarSelectedProjectNpmInstall();
      unregisterLeftBarSelectedProjectNpmPrune();
      unregisterLeftBarSelectedProjectNpmDedupe();
      unregisterLeftbarEditProject();
    });
  });

export default moduleName;
