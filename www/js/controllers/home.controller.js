/*global angular*/
(function withAngular(angular) {
  'use strict';

  const exec = require('child_process').exec;

  var HomeController = function HomeController($scope) {
      var that = this
        , setTab = function setactiveTab(tab) {
          that.tab = tab;
        }
        , npmList = exec('npm install angular-fx --save', function(error, stdout, stderr) {
          console.log(error, stdout, stderr);
        });

      npmList.stdout.on('data', function (data) {
        $scope.$evalAsync(function evalAsync() {
        that.a += data;
        });
      });
    that.a = '';
    that.tab = 'installed';
  };

  angular.module('electron.home.controllers', [])
    .controller('HomeController', ['$scope', HomeController]);
}(angular));
