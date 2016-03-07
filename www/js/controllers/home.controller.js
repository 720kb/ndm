/*global angular*/
(function withAngular(angular) {
  'use strict';

  var HomeController = function HomeController() {

    var that = this
      , setTab = function setactiveTab(tab) {
        that.tab = tab;
      };

    that.setTab = setTab;
    that.tab = 'installed';
  };

  angular.module('electron.home.controllers', [])
    .controller('HomeController', [HomeController]);
}(angular));
