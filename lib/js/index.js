/*globals require process navigator */
import angular from 'angular';
import shellModule from './interface/shell.js';
import contentModule from './interface/content.js';
import leftModule from './interface/left.js';
import topModule from './interface/top.js';
import ngRightClickModule from './directives/ng-right-click.js';
import ngDragDropModule from './directives/ng-drag-drop.js';
import ngAceEditor from './directives/ng-ace-editor.js';
import ngResizable from './directives/ng-resizable.js';
import ngAutoscroll from './directives/ng-auto-scroll.js';
import ngAutofocus from './directives/ng-autofocus.js';
import ngTagInput from './directives/ng-tag-input.js';
import ngTableKeyboard from './directives/ng-table-keyboard.js';

import assetsModule from './assets.js';
import loadingModule from './loading.js';
import errorsModule from './errors.js';
import filtersModule from './filters.js';
import notificationModule from './notification.js';

const Storage = require('electron-storage')
  , {ipcRenderer} = require('electron')
  , analytics = require('universal-analytics')
  , uuid = require('uuid/v4')
  , visitorId = uuid()
  , visitor = analytics('UA-90211405-1', visitorId);

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
  ngAutofocus,
  ngTagInput,
  ngTableKeyboard,
  assetsModule,
  filtersModule
])
.constant('timeoutForWhenUserIsPresent', 2500)
.constant('appHistoryFile', 'snapshots.json')
.constant('npmGlobal', '<global>')
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
.run(/*@ngInject*/ function onLoadingEvents(loadingFactory) {
  ipcRenderer.on('loading:freeze-app', () => {
    loadingFactory.freeze();
  });

  ipcRenderer.on('loading:unfreeze-app', () => {
    loadingFactory.unfreeze();
  });
})
.run(/*@ngInject*/ function RunOnlineOfflineCheck($window, notificationFactory) {
  //alert user when he goes offLine
  const showMessageAlert = () => {
      notificationFactory.notify('You are offline. ndm may not work as expected.', true);
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
  });
});
