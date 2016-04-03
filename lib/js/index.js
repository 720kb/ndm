/*global require,window*/
import angular from 'angular';
import shellModule from './interface/shell.js';
import contentModule from './interface/content.js';
import leftModule from './interface/left.js';
import topModule from './interface/top.js';
const electron = require('electron');

window.remote = electron.remote;
//open links in browser and items in folder
window.shell = electron.shell;
window.dialog = window.remote.require('dialog');

angular.module('ndm', [
  '720kb.fx',
  shellModule,
  contentModule,
  leftModule,
  topModule
]);
