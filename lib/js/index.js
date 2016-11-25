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
  ngAceEditor
])
.constant('npmGlobal', '<global>');
