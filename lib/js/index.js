/*global require,window*/
import angular from 'angular';
import npmUi from './shell/shell.js';
const electron = require('electron');

window.remote = electron.remote;
//open links in browser and items in folder
window.shell = electron.shell;
window.dialog = window.remote.require('dialog');

angular.module('electron', [
  '720kb.fx',
  'LocalStorageModule',
  npmUi
])

.config(/*@ngInject*/ localStorageServiceProvider => {

  localStorageServiceProvider.setPrefix('electron');
})
.run(/*@ngInject*/ ($window, sessionFactory) => {

  sessionFactory.initialize(); ///FIXME!
});
