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
const Storage = require('electron-storage');

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
  ngAutoscroll
])
.run(/*@ngInject*/ (appHistoryFile, $log) => {
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
.constant('appHistoryFile', 'snapshots.json')
.constant('npmGlobal', '<global>');
