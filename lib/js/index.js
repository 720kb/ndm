import angular from 'angular';
import shellModule from './interface/shell.js';
import contentModule from './interface/content.js';
import leftModule from './interface/left.js';
import topModule from './interface/top.js';

angular.module('ndm', [
  '720kb.fx',
  shellModule,
  contentModule,
  leftModule,
  topModule
]);
