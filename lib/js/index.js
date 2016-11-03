import angular from 'angular';
import loadingModule from './animation/loading.js';
import shellModule from './interface/shell.js';
import contentModule from './interface/content.js';
import leftModule from './interface/left.js';
import topModule from './interface/top.js';
import errorsModule from './errors/errors.js';
import ngRightClickModule from './directives/ng-right-click.js';

angular.module('ndm', [
  '720kb.fx',
  shellModule,
  contentModule,
  leftModule,
  topModule,
  loadingModule,
  errorsModule,
  ngRightClickModule
])
.constant('npmGlobal', '<global>');
