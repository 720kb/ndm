/*global require*/
import angular from 'angular';
const moduleName = 'npm-ui.left-bar'
  , electron = require('electron')
  , {remote} = electron
  , {Menu, MenuItem} = remote
  , Storage = require('electron-storage')
  , fs = require('fs')
  , exec = require('child_process').exec
  , rmRf = require('rimraf');

angular.module(moduleName, [])
  .controller('LeftBarController', /*@ngInject*/ function LeftBarController($rootScope, $scope, $window, $filter, $log, npm, npmGlobal, errorsService, loadingFactory, notificationFactory, appHistoryFile) {
    const unregisterLeftbarEditProject = $rootScope.$on('left-bar:edit-project', (eventInfo, data) => {
        $scope.$apply(() => {
          this.editorFilePath = data.dirName;
        });
      })
    , unregisterLeftBarSelectedProjectNpmReinstall = $rootScope.$on('left-bar:selected-project-npm-reinstall', (eventInformation, data) => {
        let folder = data.path.path
          , projectName = data.path.dirName
          , deleteProjectName = item => {

            $scope.$apply(() => {
              delete this.npmReinstallingProjects[item];
            });
          };

        $scope.$apply(() => {
          this.npmReinstallingProjects[projectName] = true;
        });
        //delete old node_modules
        rmRf(`${folder}/node_modules`, errRm => {
          if (errRm) {
            deleteProjectName(projectName);
            errorsService.showErrorBox('Warning', `Error deleting node_modules/ in folder ${folder} for clean installation: \n${errRm}`);
          }
          npm.npmInFolder(folder).catch(error => {
            deleteProjectName(projectName);
            $log.error(`Configuring npm for clean $ npm install,  in ${folder}...`, error);
            errorsService.handleError('Error', `Error configuring npm for clean installation in folder ${folder}: ${error}`);
          }).then(npmInFolder => {
            npmInFolder.launchInstall().then(() => {
              $log.info(`Finished npm reinstall in project ${folder}`);
              notificationFactory.notify(`Finished $ npm install in project ${projectName}`);
              deleteProjectName(projectName);
            }).catch(err => {
                deleteProjectName(projectName);
                $log.error(err);
                errorsService.showErrorBox('Error', `Error running $ npm install for clean installation in folder ${folder}: ${err}`);
            });
          });
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
    })
    , unregisterLeftBarSelectedProjectNpmBuild = $rootScope.$on('left-bar:selected-project-npm-build', (eventInformation, data) => {
      let folder = data.path.path
        , projectName = data.path.dirName
        , deleteProjectName = item => {
          $scope.$apply(() => {
            delete this.npmBuildingProjects[item];
          });
        };

      $scope.$apply(() => {
        this.npmBuildingProjects[projectName] = true;
      });

      npm.npmInFolder(folder).catch(error => {
        deleteProjectName(projectName);
        $log.error(`Configuring npm for $ npm build,  in ${folder}...`, error);
        errorsService.handleError('Error', `Error configuring npm for build in folder ${folder}: ${error}`);
      }).then(npmInFolder => {
        npmInFolder.build(folder).then(() => {
          $log.info(`Finished npm build in project folder ${folder}`);
          notificationFactory.notify(`Finished $ npm build in project ${projectName}`);
          deleteProjectName(projectName);
        }).catch(err => {
          $log.error(err);
          errorsService.showErrorBox('Error', `Error running $ npm build in folder ${folder}: ${err}`);
          deleteProjectName(projectName);
        });
      });
    })
    , unregisterLeftBarSelectedProjectNpmRebuild = $rootScope.$on('left-bar:selected-project-npm-rebuild', (eventInformation, data) => {
      let folder = data.path.path
        , projectName = data.path.dirName
        , deleteProjectName = item => {
          $scope.$apply(() => {
            delete this.npmRebuildingProjects[item];
          });
        };

      $scope.$apply(() => {
        this.npmRebuildingProjects[projectName] = true;
      });

      npm.npmInFolder(folder).catch(error => {
        deleteProjectName(projectName);
        $log.error(`Configuring npm for $ npm rebuild,  in ${folder}...`, error);
        errorsService.handleError('Error', `Error configuring npm for rebuild in folder ${folder}: ${error}`);
      }).then(npmInFolder => {
        npmInFolder.rebuild(folder).then(() => {
          $log.info(`Finished npm rebuild in project folder ${folder}`);
          notificationFactory.notify(`Finished $ npm rebuild in project ${projectName}`);
          deleteProjectName(projectName);
        }).catch(err => {
          $log.error(err);
          errorsService.showErrorBox('Error', `Error running $ npm rebuild in folder ${folder}: ${err}`);
          deleteProjectName(projectName);
        });
      });
    })
    , unregisterLeftBarSelectedProjectNpmRunScript = $rootScope.$on('left-bar:selected-project-npm-run-script', (eventInformation, data) => {
      if (data &&
        data.dirName &&
        data.script &&
        data.scriptName) {
        /*$scope.$apply(() => {
          this.npmRunningScriptsProject[data.dirName] = [];

        });

        exec(data.script, {'cwd': data.dirName}, (error, stdout, stderr) => {
            $log.log(error, stdout, stderr);
        });*/
      }
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
        , flagIdentifier = this.rightClickedProject.path
        , endRestore = () => {
          $scope.$apply(() => {
            this.restoredSnapshot[flagIdentifier] = true;
            this.restoringSnapshot[flagIdentifier] = false;
          });
        };

      this.restoringSnapshot = this.restoringSnapshot || [];
      this.restoredSnapshot = this.restoredSnapshot || [];
      this.restoredSnapshot[flagIdentifier] = false;
      this.restoringSnapshot[flagIdentifier] = true;

      Storage.get(appHistoryFile, (err, data) => {
        if (err) {
          errorsService.showErrorBox('Error', `Error retrieving snapshots: ${err}`);
          endRestore();
        } else {

          let indexItem;

          data[projectKey].forEach((item, index) => {
            if (item.datetime === selectedSnapshot.datetime) {
              indexItem = index;
            }
          });
          //write snapshotted package.json
          fs.writeFileSync(`${selectedSnapshot.path}/package.json`, data[projectKey][indexItem].status, {'flag': 'w'}, 'utf8');
          //delete old node_modules
          rmRf(`${selectedSnapshot.path}/node_modules`, errRm => {
            if (errRm) {
              errorsService.showErrorBox('Warning', `Error deleting node_modules/ in folder ${selectedSnapshot.path}, going to run a simple $ npm install but that's not a clean reinstallation: \n${errRm}`);
            }
            npm.npmInFolder(selectedSnapshot.path).catch(error => {
              $log.error(`Error configuring npm for $ npm install to restore snapshot,  in folder ${selectedSnapshot.path}...`, error);
              errorsService.handleError('Error', `Error configuring npm for install in folder ${selectedSnapshot.path} for restoring snapshot: ${error}`);
              this.restoringSnapshot[projectKey] = false;
            }).then(npmInFolder => {
              npmInFolder.launchInstall().then(() => {
                endRestore();
                $log.info(`Restored snapshot in project ${selectedSnapshot.path}`);
                notificationFactory.notify(`Restored snapshot in folder: ${selectedSnapshot.path}`);
              }).catch(warn => {
                endRestore();
                $log.error(`Error npm install (restoring snapshot) in folder ${selectedSnapshot.path}: ${warn}`);
                errorsService.showErrorBox('Error', `Something went wrong in folder ${selectedSnapshot.path} while restoring the snapshot. \n${warn}`);
              });
            }).catch(e => {
              endRestore();
              $log.error(e);
              errorsService.showErrorBox('Error', `Error running $ npm install in folder ${selectedSnapshot.path} for restoring snapshot: ${e}`);
            });
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

      try {
        let packageJSON = JSON.parse(fs.readFileSync(`${item.path}/package.json`));

        item.scripts = packageJSON.scripts;
      } catch (excp) {
        $log.warn(`No scripts found in package.json for ${item.path}`, excp);
      }

      let projectsContextMenu = new Menu()
        , snapshot = this.createSnapshot
        , openHistory = this.openHistoryPrompt
        , selectedProject = item
        , scriptsSubmenu = [];

      this.rightClickedProject = item;
      projectsContextMenu.append(new MenuItem({
        'label': 'Install',
        click() {
          $rootScope.$emit('left-bar:selected-project-npm-install', {
            'path': item
          });
        }
      }));

      projectsContextMenu.append(new MenuItem({
        'label': 'Reinstall',
        click() {
          $rootScope.$emit('left-bar:selected-project-npm-reinstall', {
            'path': item
          });
        }
      }));

      projectsContextMenu.append(new MenuItem({
        'type': 'separator'
      }));

      projectsContextMenu.append(new MenuItem({
        'label': 'Build',
        click() {
          $rootScope.$emit('left-bar:selected-project-npm-build', {
            'path': item
          });
        }
      }));

      projectsContextMenu.append(new MenuItem({
        'label': 'Rebuild',
        click() {
          $rootScope.$emit('left-bar:selected-project-npm-rebuild', {
            'path': item
          });
        }
      }));

      projectsContextMenu.append(new MenuItem({
        'type': 'separator'
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
      //append scripts if any in project package.json
      if (item.scripts) {

        Object.keys(item.scripts).forEach(scriptName => {

          scriptsSubmenu.push({
            'label': scriptName,
            click() {
              $rootScope.$emit('left-bar:selected-project-npm-run-script', {
                'dirName': `${item.path}`,
                'script': item.scripts[scriptName].toString(),
                scriptName
              });
            }
          });
        });

        projectsContextMenu.append(new MenuItem({
          'type': 'separator'
        }));

        projectsContextMenu.append(new MenuItem({
          'label': 'Run script',
          'submenu': scriptsSubmenu,
          click() {
          }
        }));
      }

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
    this.npmReinstallingProjects = [];
    this.npmBuildingProjects = [];
    this.npmRebuildingProjects = [];
    this.npmPruningProjects = [];
    this.npmDedupingProjects = [];

    $scope.$on('$destroy', () => {

      unregisterLeftBarSelectedProjectNpmInstall();
      unregisterLeftBarSelectedProjectNpmReinstall();
      unregisterLeftBarSelectedProjectNpmPrune();
      unregisterLeftBarSelectedProjectNpmDedupe();
      unregisterLeftBarSelectedProjectNpmBuild();
      unregisterLeftBarSelectedProjectNpmRebuild();
      unregisterLeftBarSelectedProjectNpmRunScript();
      unregisterLeftbarEditProject();
    });
  });

export default moduleName;
