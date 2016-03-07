/*global angular require*/
(function withAngular(angular) {
  'use strict';


  var exec = require('child_process').exec
    , NpmFactory = function NpmFactory() {

      var list = function list() {

        return new Promise(function listPromise(resolve, reject) {

          exec('npm list --json', function onList(err, stdout, stderr) {

            if (err) {

              reject(err);
            }

            resolve(stdout,stderr);
          });
        });
      }
      , outdated = function outdated() {

        return new Promise(function listPromise(resolve, reject) {

          exec('npm outdated --json', function onList(err, stdout, stderr) {

            if (err) {

              reject(err);
            }

            resolve(stdout,stderr);
          });
        });
      };

      return {
        'list': list,
        'outdated': outdated
      };
    };

  angular.module('electron.npm.factories', [])
    .factory('npmFactory', NpmFactory);
}(angular));
