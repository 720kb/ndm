/*global require*/
import angular from 'angular';
const moduleName = 'npm-ui.left-bar'
  , electron = require('electron')
  , {remote} = electron
  , {Menu, MenuItem} = remote
  , Storage = require('electron-storage')
  , fs = require('fs');

angular.module(moduleName, [])
  .controller('LeftBarController', /*@ngInject*/ function LeftBarController($rootScope, $scope, $window, $filter, $log, npm, npmGlobal, errorsService, loadingFactory, notificationFactory, appHistoryFile) {

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

    this.turnPathToKey = path => {
      return path.toString().toLowerCase().trim().replace(/\//g, '-');
    };

    this.deleteSnapshot = () => {

      let projectKey = this.turnPathToKey(this.rightClickedProject.path)
        , selectedSnapshot = this.selectedSnapshot;

      Storage.get(appHistoryFile, (err, data) => {
        if (err) {
          errorsService.showErrorBox('Error', `Error retrieving snapshots: ${err}`);
        } else {

          let indexItem;

          data[projectKey].forEach((item, index) => {
            if (item.datetime === selectedSnapshot.datetime) {
              indexItem = index;
            }
          });

          data[projectKey].splice(indexItem, 1);

          if (data[projectKey].length <= 0) {

            delete data[projectKey];
          }

          $scope.$apply(() => {
            this.projectHistory = data[projectKey] || [];
          });
          Storage.set(appHistoryFile, data, error => {
            if (err) {
              errorsService.showErrorBox('Error', `Error deleting snapshot: ${error}`);
            }
          });
        }
      });
    };

    this.restoreSnapshot = () => {

      let projectKey = this.turnPathToKey(this.rightClickedProject.path)
        , selectedSnapshot = this.selectedSnapshot
        , toRestoreSnapshot;

      this.restoredSnapshot = false;
      this.restoringSnapshot = true;

      Storage.get(appHistoryFile, (err, data) => {
        if (err) {
          errorsService.showErrorBox('Error', `Error retrieving snapshots: ${err}`);
          this.restoringSnapshot = false;
        } else {

          let indexItem;

          data[projectKey].forEach((item, index) => {
            if (item.datetime === selectedSnapshot.datetime) {
              indexItem = index;
            }
          });
          //write snapshotted package.json
          fs.writeFileSync(`${selectedSnapshot.path}/package.json`, data[projectKey][indexItem].status, {'flag': 'w'}, 'utf8');

          npm.npmInFolder(selectedSnapshot.path).catch(error => {
            $log.error(`Error configuring npm for $ npm install to restore snapshot,  in folder ${selectedSnapshot.path}...`, error);
            errorsService.handleError('Error', `Error configuring npm for install in folder ${selectedSnapshot.path} for restoring snapshot: ${error}`);
            this.restoringSnapshot = false;
          }).then(npmInFolder => {
            npmInFolder.launchInstall().then(() => {
              npmInFolder.prune().then(() => {
                $scope.$apply(() => {
                  this.restoredSnapshot = true;
                  this.restoringSnapshot = false;
                });
                $log.info(`Restored snapshot in project ${selectedSnapshot.path}`);
                notificationFactory.notify(`Restored snapshot in folder: ${selectedSnapshot.path}`);
              }).catch(problem => {
                $log.error(`Error npm prune (restoring snapshot) in folder ${selectedSnapshot.path}: ${problem}`);
                errorsService.showErrorBox('Error', 'Something went wrong while restoring the snapshot. \nPlease double-check the project package.json');
              });
            }).catch(warn => {
              $log.error(`Error npm install (restoring snapshot) in folder ${selectedSnapshot.path}: ${warn}`);
              errorsService.showErrorBox('Error', 'Something went wrong while restoring the snapshot. \nPlease double-check the project package.json');
            });
          }).catch(e => {
            $log.error(e);
            errorsService.showErrorBox('Error', `Error running $ npm install in folder ${selectedSnapshot.path} for restoring snapshot: ${e}`);
            this.restoringSnapshot = false;
          });
        }
      });
    };

    this.createSnapshot = project => {

      let datetime = $filter('date')(new Date(), 'medium')
        , status = fs.readFileSync(`${project.path}/package.json`).toString();

      if (project &&
        project.path) {

        Storage.get(appHistoryFile, (err, data) => {
          if (err) {
            errorsService.showErrorBox('Error', `Error creating snapshot: ${err}`);
          } else {

            let storageData = data || {}
              //storageKey can't be project name, you can have subdirs with same name for example.
              , storageKey = this.turnPathToKey(project.path)
              , path = project.path;

            if (storageData &&
              storageData[storageKey]) {
              storageData[storageKey].push({
                datetime,
                status,
                path
              });
            } else {
              storageData[storageKey] = [{
                datetime,
                status,
                path
              }];
            }

            Storage.set(appHistoryFile, storageData, error => {
              if (error) {
                errorsService.showErrorBox('Error', `Error creating ${project.dirName} project snapshot: ${error}`);
              } else {
                $scope.$apply(() => {
                  this.projectHistory = storageData[storageKey];
                });
              }
            });
          }
        });
      }
    };

    this.openHistoryPrompt = project => {
      Storage.get(appHistoryFile, (err, data) => {
        if (err) {
          errorsService.showErrorBox('Error', `Error retrieving snapshots: ${err}`);
        }
        this.projectHistory = data[this.turnPathToKey(project.path)];
        $scope.$apply(() => {
          this.showHistoryPrompt = true;
        });
      });
    };

    this.rightClickMenu = item => {

      let projectsContextMenu = new Menu()
        , selectedProject = item
        , snapshot = this.createSnapshot
        , openHistory = this.openHistoryPrompt;

      this.rightClickedProject = item;
      projectsContextMenu.append(new MenuItem({
        'label': 'Npm Install',
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
      projectsContextMenu.append(new MenuItem({
        'label': 'Snapshot',
        click() {
          snapshot(item);
        }
      }));

      projectsContextMenu.append(new MenuItem({
        'label': 'History',
        click() {
          openHistory(item);
        }
      }));

      projectsContextMenu.append(new MenuItem({
        'type': 'separator'
      }));
      projectsContextMenu.append(new MenuItem({
        'label': 'Edit',
        click() {
          $rootScope.$emit('left-bar:edit-project', {
            'dirName': `${item.path}/package.json`
          });
        }
      }));

      projectsContextMenu.append(new MenuItem({
        'label': 'Remove',
        click() {
          $scope.$evalAsync(() => {
            this.removedProject = item;
            if (item === selectedProject) {
              $rootScope.$emit('left-bar:delete-selected-project');
            }
          });

          $rootScope.$emit('left-bar:delete-project', {
            'dirName': item.dirName
          });
        }
      }));

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
