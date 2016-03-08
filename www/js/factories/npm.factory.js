/*global angular require*/
(function withAngular(angular) {
  'use strict';


  var npm = require('npm')
    , NpmFactory = function NpmFactory($log) {

      var list = function list(globally, path, dev, prod) {

        var listOptions = [];

        listOptions.prefix = path;
        listOptions.json = true;

        if (globally) {

          listOptions.global = true;
        }

        if (dev) {

          listOptions.dev = true;
        }

        if (prod) {

          listOptions.prod = true;
        }

        return new Promise(function listPromise(resolve, reject) {

          npm.load({
            'prefix': path,
            'cache': false,
            'logLevel': 'none'
          }, function onNpmLoad(err) {

           if (err) {

             reject(err);
           }

           npm.commands.list(listOptions, function onList(listError, installedDeps) {

            if (listError) {

              $log.error('Error npm list', listError);
              reject(listError);
            }

            resolve(installedDeps);
            });
          });
        });
      }
      , outdated = function outdated(globally, path, dev, prod) {

        var listOptions = [];

        listOptions.json = true;

        if (globally) {

          listOptions.global = true;
        }

        if (dev) {

          listOptions.dev = true;
        }

        if (prod) {

          listOptions.prod = true;
        }

        return new Promise(function listPromise(resolve, reject) {

          npm.load({
            'prefix': path,
            'cache': false
          }, function onNpmLoad(err) {

            if (err) {

              reject(err);
            }

            npm.commands.outdated(listOptions, function onList(listError, outdatedDeps) {

              if (listError) {

                $log.error('Error npm list', listError);
                reject(listError);
              }

              resolve(outdatedDeps);
            });
          });
        });
      };

      return {
        'list': list,
        'outdated': outdated
      };
    };
  angular.module('electron.npm.factories', [])
    .factory('npmFactory',['$log', NpmFactory]);
}(angular));
