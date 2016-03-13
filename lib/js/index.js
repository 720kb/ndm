import angular from 'angular';
import electron from 'electron';
import remote from 'remote';
import npmUi from './shell/shell.js';

angular.module('electron', [
  '720kb.fx',
  'LocalStorageModule',
  npmUi
])

.config(/*@ngInject*/ localStorageServiceProvider => {

  localStorageServiceProvider.setPrefix('electron');
})
.run(/*@ngInject*/ ($window, sessionFactory) => {

  $window.remote = remote;
  //open links in browser and items in folder
  $window.shell = electron.shell;

  $window.dialog = $window.remote.require('dialog');
  sessionFactory.initialize(); ///FIXME!
});
