/*global require*/
import angular from 'angular';
const moduleName = 'npm-ui.left-bar'
  , {remote, shell, clipboard} = require('electron')
  , {Menu, MenuItem} = remote
  , Storage = require('electron-storage')
  , fs = require('fs')
  , Path = require('path')
  , rmRf = require('rimraf');

angular.module(moduleName, [])
  .controller('LeftBarController', /*@ngInject*/ function LeftBarController($state, $rootScope, $scope, $window, $filter, $log, npm, npmGlobal, errorsService, loadingFactory, notificationFactory, appHistoryFile) {

    const unregisterOnTopBarActiveLink = $rootScope.$on('top-bar:active-link', (eventInfo, data) => {
      if (data &&
        data.link) {
        $scope.$evalAsync(() => {
          this.editorFilePath = false;
          this.editorFileName = false;
          this.showHistoryPrompt = false;
        });
      }
    })
    , unregisterLeftbarEditProject = $rootScope.$on('left-bar:edit-project', (eventInfo, data) => {
        $scope.$apply(() => {
          this.editorFilePath = data.dirName;
          this.editorFileName = data.fileName;
          this.showHistoryPrompt = false;
        });
      })
    , unregisterLeftBarSelectedProjectNpmUnshrinkwrap = $rootScope.$on('left-bar:selected-project-npm-unshrinkwrap', (eventInformation, data) => {
        const folder = data.path.path
          , projectName = data.path.dirName;

        //delete old node_modules
        rmRf(Path.join(folder, 'npm-shrinkwrap.json'), errRm => {
          if (errRm) {
            return errorsService.showErrorBox('Warning', `Error deleting npm-shrinkwrap.json in folder ${folder}: \n${errRm}`);
          }

          $rootScope.$emit('left-bar:unshrinkwrap-project', {'project': data.path});
          $log.info(`Removed npm-shrinkwrap.json in project ${folder}`);
          notificationFactory.notify(`Removed npm-shrinkwrap.json in project ${projectName}`);
        });
      })
    , unregisterLeftBarSelectedProjectNpmShrinkwrap = $rootScope.$on('left-bar:selected-project-npm-shrinkwrap', (eventInformation, data) => {
        const folder = data.path.path
          , projectName = data.path.dirName
          , deleteProjectName = item => {
            $scope.$apply(() => {
              this.deleteShrinkwrappingProjects(item);
            });
          };

        $scope.$apply(() => {
          this.npmShrinkwrappingProjects[projectName] = true;
        });

        npm.npmInFolder(folder).catch(error => {
          deleteProjectName(projectName);
          $log.error(`Configuring npm for $ npm shrinkwrap,  in ${folder}...`, error);
          errorsService.handleError('Error', `Error configuring npm for shrinkwrap in folder ${folder}: ${error}`);
        }).then(npmInFolder => {
          npmInFolder.shrinkwrap().then(() => {
            $rootScope.$emit('left-bar:shrinkwrap-project', {'project': data.path});
            $log.info(`Finished npm shrinkwrap in project ${folder}`);
            notificationFactory.notify(`Finished $ npm shrinkwrap in project ${projectName}`);
            deleteProjectName(projectName);
          }).catch(err => {
            deleteProjectName(projectName);
            $log.error(err);
            errorsService.showErrorBox('Error', `Error running $ npm shrinkwrap in folder ${folder}: ${err}`);
          });
        });
      })
    , unregisterLeftBarSelectedProjectNpmReinstall = $rootScope.$on('left-bar:selected-project-npm-reinstall', (eventInformation, data) => {
        const folder = data.path.path
          , projectName = data.path.dirName
          , deleteProjectName = item => {
            $scope.$apply(() => {
              this.deleteReinstallingProjects(item);
            });
          };

        $scope.$apply(() => {
          this.npmReinstallingProjects[projectName] = true;
        });
        //delete old node_modules
        rmRf(Path.join(folder, 'node_modules'), errRm => {
          if (errRm) {
            deleteProjectName(projectName);
            return errorsService.showErrorBox('Warning', `Error deleting "node_modules" in project ${folder} for re-installation: \n${errRm}`);
          }
          npm.npmInFolder(folder).catch(error => {
            deleteProjectName(projectName);
            $log.error(`Configuring npm for re-installation,  in ${folder}...`, error);
            errorsService.handleError('Error', `Error configuring npm for clean installation in folder ${folder}: ${error}`);
          }).then(npmInFolder => {
            npmInFolder.launchInstall().then(() => {
              $log.info(`Finished re-installation in project ${folder}`);
              notificationFactory.notify(`Finished re-installation in project ${projectName}`);
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
        const folder = data.path.path
          , projectName = data.path.dirName
          , deleteProjectName = item => {
            $scope.$apply(() => {
              this.deleteInstallingProjects(item);
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
      const folder = data.path.path
        , projectName = data.path.dirName
        , deleteProjectName = item => {
          $scope.$apply(() => {
            this.deletePruningProjects(item);
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
      const folder = data.path.path
        , projectName = data.path.dirName
        , deleteProjectName = item => {
          $scope.$apply(() => {
            this.deleteDedupingProjects(item);
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
      const folder = data.path.path
        , projectName = data.path.dirName
        , deleteProjectName = item => {
          $scope.$apply(() => {
            this.deleteBuildingProjects(item);
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
    , unregisterLeftBarSelectedProjectNpmRunScript = $rootScope.$on('left-bar:selected-project-npm-run-script', (eventInformation, data) => {
      const deleteRunningScript = (dirName, scriptName) => {
        //remove running script from view
        try {
          $scope.$apply(() => {
            this.deleteRunningScript(dirName, scriptName);
          });
        } catch (excp) {
          $log.warn(excp);
        }
      };

      if (data &&
        data.dirName &&
        data.script &&
        data.scriptName) {

        $scope.$apply(() => {
          if (!this.npmRunningScriptsProject[data.dirName]) {
            this.npmRunningScriptsProject[data.dirName] = [];
          }

          if (this.npmRunningScriptsProject[data.dirName] &&
            this.npmRunningScriptsProject[data.dirName].indexOf(data.scriptName) === -1) {

            this.npmRunningScriptsProject[data.dirName].push(data.scriptName);

            npm.npmInFolder(data.dirName, data.scriptName).catch(error => {
              deleteRunningScript(data.dirName, data.scriptName);
              $log.error(`Error configuring npm for $ npm run ${data.scriptName},  in folder ${data.dirName}...`, error);
              errorsService.handleError('Error', `Error configuring npm for run ${data.scriptName} in folder ${data.dirName}:\n${error}`);
            }).then(npmInFolder => {
              $log.info(`Going to launch: npm run ${data.scriptName}`, `in folder ${data.dirName}`);
              npmInFolder.run(data.scriptName).then(() => {
                $log.info(`Finished running: npm run ${data.scriptName}`, `in folder: ${data.dirName}`);
                notificationFactory.notify(`Finished $ npm run ${data.scriptName} in project ${data.dirName}`);
                deleteRunningScript(data.dirName, data.scriptName);
              }).catch(warn => {
                deleteRunningScript(data.dirName, data.scriptName);
                errorsService.showErrorBox('Error', `Error running script "${data.scriptName}" in folder ${data.dirName}:\n${warn}`);
                $log.error(`Error running script "${data.scriptName}" in folder ${data.dirName}:\n${warn}`);
              });
            }).catch(e => {
              deleteRunningScript(data.dirName, data.scriptName);
              $log.error(e);
              errorsService.showErrorBox('Error', `Error running $ npm run ${data.scriptName} in folder ${data.dirName}: ${e}`);
            });
          }
        });
      }
    });

    this.deleteRunningScript = (dirName, scriptName) => {
      this.npmRunningScriptsProject[dirName].splice(this.npmRunningScriptsProject[dirName].indexOf(scriptName), 1);
    };

    this.deleteBuildingProjects = item => {
      delete this.npmBuildingProjects[item];
    };

    this.deleteShrinkwrappingProjects = item => {
      delete this.npmShrinkwrappingProjects[item];
    };

    this.deleteInstallingProjects = item => {
      delete this.npmInstallingProjects[item];
    };

    this.deleteReinstallingProjects = item => {
      delete this.npmReinstallingProjects[item];
    };

    this.deleteDedupingProjects = item => {
      delete this.npmDedupingProjects[item];
    };

    this.deletePruningProjects = item => {
      delete this.npmPruningProjects[item];
    };

    this.selectGlobal = () => {

      this.selectedProject = npmGlobal;
      this.global = true;

      $state.transitionTo('project', {'project': {'path': this.selectedProject}}, {'reload': true});
    };

    this.deleteSnapshot = () => {

      const projectKey = this.rightClickedProject.path
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

      const projectKey = this.rightClickedProject.path
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
          fs.writeFileSync(Path.join(selectedSnapshot.path, 'package.json'), data[projectKey][indexItem].status, {'flag': 'w'}, 'utf8');
          //delete old node_modules
          rmRf(Path.join(selectedSnapshot.path, 'node_modules'), errRm => {
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

      const datetime = $filter('date')(new Date(), 'medium')
        , status = (() => {
          try {
            return fs.readFileSync(Path.join(project.path, 'package.json')).toString();
          } catch (e) {
            return errorsService.showErrorBox('Error', `No package.json found in folder ${project.path}`);
          }
        })()
        , packageJSON = status;

      if (project &&
        project.path) {

        Storage.get(appHistoryFile, (err, data) => {
          if (err) {
            errorsService.showErrorBox('Error', `Error creating snapshot: ${err}`);
          } else {

            let storageData = data || {}
              //storageKey can't be project name, you can have subdirs with same name for example.
              , storageKey = project.path
              , path = project.path;

            if (storageData &&
              storageData[storageKey]) {
              storageData[storageKey].push({
                datetime,
                'status': packageJSON,
                path
              });
            } else {
              storageData[storageKey] = [{
                datetime,
                'status': packageJSON,
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

      $rootScope.$emit('left-bar:open-project-history', {
        project
      });

      Storage.get(appHistoryFile, (err, data) => {
        if (err) {
          errorsService.showErrorBox('Error', `Error retrieving snapshots: ${err}`);
        }
        this.projectHistory = data[project.path];
        $scope.$apply(() => {
          this.showHistoryPrompt = true;
          this.editorFilePath = false;
        });
      });
    };

    this.rightClickMenu = item => {

      try {
        let packageJSON = JSON.parse(fs.readFileSync(Path.join(item.path, 'package.json')));

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
        'label': `${item.dirName}`,
        'enabled': false
      }));

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

      projectsContextMenu.append(new MenuItem({
        'label': 'Shrinkwrap',
        click() {
          $rootScope.$emit('left-bar:selected-project-npm-shrinkwrap', {
            'path': item
          });
        }
      }));

      projectsContextMenu.append(new MenuItem({
        'label': 'Unshrinkwrap',
        click() {
          $rootScope.$emit('left-bar:selected-project-npm-unshrinkwrap', {
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
        'label': 'Edit',
        'submenu': [{
          'label': 'package.json',
          click() {
            $rootScope.$emit('left-bar:edit-project', {
              'dirName': Path.join(item.path, 'package.json'),
              'fileName': 'package.json'
            });
          }
        },
        {
          'label': '.npmrc',
          click() {
            $rootScope.$emit('left-bar:edit-project', {
              'dirName': Path.join(item.path, '.npmrc'),
              'fileName': '.npmrc'
            });
          }
        }]
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
            'project': item
          });
        }
      }));

      projectsContextMenu.append(new MenuItem({
        'type': 'separator'
      }));

      projectsContextMenu.append(new MenuItem({
        'label': 'Copy Full Path',
        click() {
          clipboard.write({
            'text': item.path
          });
        }
      }));
      projectsContextMenu.append(new MenuItem({
        'label': 'Open Folder',
        click() {
          shell.showItemInFolder(item.path);
        }
      }));

      projectsContextMenu.popup(remote.getCurrentWindow());
    };

    this.selectProject = (item, event) => {

      if (item) {

        this.global = false;
        this.selectedProject = item;
        $state.transitionTo('project', {'project': item}, {'reload': true});
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
          'project': item
        });
      }
      event.stopPropagation();//prevent project selection
    };

    //show loading/progress commands under project folders
    this.npmInstallingProjects = [];
    this.npmReinstallingProjects = [];
    this.npmBuildingProjects = [];
    this.npmPruningProjects = [];
    this.npmDedupingProjects = [];
    this.npmRunningScriptsProject = [];
    this.npmShrinkwrappingProjects = [];

    $scope.$on('$destroy', () => {
      unregisterLeftBarSelectedProjectNpmShrinkwrap();
      unregisterLeftBarSelectedProjectNpmUnshrinkwrap();
      unregisterLeftBarSelectedProjectNpmInstall();
      unregisterLeftBarSelectedProjectNpmReinstall();
      unregisterLeftBarSelectedProjectNpmPrune();
      unregisterLeftBarSelectedProjectNpmDedupe();
      unregisterLeftBarSelectedProjectNpmBuild();
      unregisterLeftBarSelectedProjectNpmRunScript();
      unregisterLeftbarEditProject();
      unregisterOnTopBarActiveLink();
    });
  });

export default moduleName;
