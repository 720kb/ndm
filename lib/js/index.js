/*globals require process navigator */
import angular from 'angular';
import loadingModule from './loading.js';
import notificationModule from './notification.js';
import shellModule from './interface/shell.js';
import contentModule from './interface/content.js';
import leftModule from './interface/left.js';
import topModule from './interface/top.js';
import errorsModule from './errors.js';
import ngRightClickModule from './directives/ng-right-click.js';
import ngDragDropModule from './directives/ng-drag-drop.js';
import ngAceEditor from './directives/ng-ace-editor.js';
import ngResizable from './directives/ng-resizable.js';
import ngAutoscroll from './directives/ng-auto-scroll.js';
import ngAutofocus from './directives/ng-autofocus.js';
import ngTagInput from './directives/ng-tag-input.js';
import ngTableKeyboard from './directives/ng-table-keyboard.js';

import assetsModule from './assets.js';

const Storage = require('electron-storage')
  , {ipcRenderer, shell, remote} = require('electron')
  , dialog = remote.dialog
  , analytics = require('universal-analytics')
  , uuid = require('uuid/v4')
  , visitorId = uuid()
  , visitor = analytics('UA-90211405-1', visitorId);

angular.module('ndm', [
  'ui.router',
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
  ngAutofocus,
  ngTagInput,
  ngTableKeyboard,
  assetsModule
])
.constant('timeoutForWhenUserIsPresent', 2500)
.constant('appHistoryFile', 'snapshots.json')
.constant('npmGlobal', '<global>')
.config(/*@ngInject*/ function configNg($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/');
  $stateProvider
  .state('project', {
    'url': '/?{project:json}',
    'templateUrl': 'content.html'
  });
})
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
            notificationFactory.notify(`A new ndm version is available at:\n${downloadDmgUrl}`, true, () => {
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
.run(/*@ngInject*/ function RunOnlineOfflineCheck($window) {
  //alert user when he goes offLine
  const showMessageAlert = () => {
      dialog.showMessageBox({
        'type': 'warning',
        'message': 'You are offline',
        'detail': 'ndm may not work as expected.'
      });
    }
    , onOffline = () => {
      showMessageAlert();
    }
    , onStart = () => {
      if (navigator &&
        !navigator.onLine) {
        showMessageAlert();
      }
    };

  angular.element($window).on('offline', onOffline);
  onStart();
})
.run(/*ngInject*/ function runDomReady($document, $rootScope, $timeout, $log, loadingFactory, timeoutForWhenUserIsPresent) {
  loadingFactory.freeze();
  $document.ready(() => {
    $log.info('DOM is ready');
    //communicate to the app DOM is ready
    $rootScope.$emit('dom:ready');
    $timeout(() => {
      //ga user is on
      try {
        visitor.pageview(`/platform/${process.platform}`).send();
        $log.info(`Platform ${process.platform}`);
      } catch (excp) {
        $log.warn('Unable to send ga pageview', excp);
      }
    }, timeoutForWhenUserIsPresent);
  });
})
.run(/*ngInject*/ function runNpmReady($rootScope, $log, loadingFactory) {
  $rootScope.$on('npm:ready', () => {
    $log.info('npm is ready');
    loadingFactory.appReady();
    loadingFactory.unfreeze();
  });
});
