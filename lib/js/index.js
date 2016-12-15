/*globals require */
import angular from 'angular';
import loadingModule from './animation/loading.js';
import notificationModule from './notifications/notification.js';
import shellModule from './interface/shell.js';
import contentModule from './interface/content.js';
import leftModule from './interface/left.js';
import topModule from './interface/top.js';
import errorsModule from './errors/errors.js';
import ngRightClickModule from './directives/ng-right-click.js';
import ngDragDropModule from './directives/ng-drag-drop.js';
import ngAceEditor from './directives/ng-ace-editor.js';
import ngResizable from './directives/ng-resizable.js';
import ngAutoscroll from './directives/ng-auto-scroll.js';
import ngAutofocus from './directives/ng-autofocus.js';

const Storage = require('electron-storage')
  , {ipcRenderer, shell} = require('electron');

angular.module('ndm', [
  'selectionModel',
  shellModule,
  contentModule,
  leftModule,
  topModule,
  loadingModule,
  notificationModule,
  errorsModule,
  ngRightClickModule,
  ngDragDropModule,
  ngAceEditor,
  ngResizable,
  ngAutoscroll,
  ngAutofocus
])
.run(/*@ngInject*/ function RunInitStorage(appHistoryFile, $log) {
  //create storage file in case
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
//***!!DEPRECATED this method below will be removed!! must be autoupdater to check for such things.
.run(/*@ngInject*/ function RunCheckForUpdates($window, $log, $timeout, notificationFactory) {

  let downloadDmgUrl = 'https://720kb.github.io/ndm/';

  ipcRenderer.on('menu:check-for-updates', (eventInfo, installedVersion) => {

    notificationFactory.notify('Checking for updates ...', true);

    $window.fetch('https://720kb.github.io/ndm/parsable.html', {
      'method': 'GET'
    }).then(response => {
      if (response && response.status === 200) {
        response.text().then(contents => {

          let theJSON = JSON.parse(contents.toString().trim());

          if (theJSON &&
            installedVersion &&
          theJSON.latestRelease &&
          theJSON.latestRelease !== installedVersion) {
            notificationFactory.notify(`A new version is available at:\n${downloadDmgUrl}`, true, () => {
              shell.openExternal(downloadDmgUrl);
            });
          } else {
            notificationFactory.notify('No updates available for ndm.', true);
          }
          $log.info('Checked for updates', theJSON);
        });
      } else {
        notificationFactory.notify('No updates available.', true);
      }
    }).catch(err => {
      $log.error('Looking for updates', err);
      notificationFactory.notify('No updates available.', true);
    });
  });
})
.constant('appHistoryFile', 'snapshots.json')
.constant('npmGlobal', '<global>');
