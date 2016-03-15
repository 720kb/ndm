/*global require,window*/
import angular from 'angular';
import sessionModule from './session.js';
import shellModule from './interface/shell.js';
import contentModule from './interface/content.js';
import leftModule from './interface/left.js';
import topModule from './interface/top.js';
const electron = require('electron');

window.remote = electron.remote;
//open links in browser and items in folder
window.shell = electron.shell;
window.dialog = window.remote.require('dialog');

window.remote.getCurrentWindow().toggleDevTools();

angular.module('ndm', [
  '720kb.fx',
  shellModule,
  sessionModule,
  contentModule,
  leftModule,
  topModule
])

.config(/*@ngInject*/ sessionProvider => {

  sessionProvider.registerInSession({
    'name': 'path',
    'reset': true
  }, {
    'name': 'projectsList',
    'default': []
  }, {
    'name': 'globallyInstalsCount',
    'default': 0
  });
})

.run(/*@ngInject*/ ($log, session) => {

  $log.info(session);
});
