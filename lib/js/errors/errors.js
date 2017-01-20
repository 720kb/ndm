/*global require*/
import angular from 'angular';
const moduleName = 'npm-ui.errors-handler'
  , electron = require('electron')
  , {remote} = electron
  , dialog = remote.dialog;

angular.module(moduleName, [])
  .service('errorsService', /*@ngInject*/ function ErrorHandler($log) {

    this.handleError = (message, error) => {

      /*if (error && error.toString().includes('EACCES')) {
        dialog.showErrorBox(message, `\n\n${error}\n\nHave you fixed npm permissions? \n\nCheck this simple tutorial: \nhttps://docs.npmjs.com/getting-started/fixing-npm-permissions.`);
      }*/
      $log.error(message, error);
    };

    this.showErrorBox = (message, error) => {

      dialog.showErrorBox(message, error);
    };
  });

export default moduleName;
