/*global angular*/
(function withAngular(angular) {
  'use strict';

  var HomeController = function HomeController($scope) {
      var that = this;
      const exec = require('child_process').exec;

      exec('npm list', function(error, stdout, stderr) {
  console.log(error, stdout, stderr);
});
      that.a = 'yoyoyo';
  };

  angular.module('electron.home.controllers', [])
    .controller('HomeController', ['$scope', HomeController]);
}(angular));
