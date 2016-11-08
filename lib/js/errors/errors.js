/*global require*/
import angular from 'angular';
const moduleName = 'npm-ui.errors-handler'
  , electron = require('electron')
  , dialog = electron.remote.dialog;

angular.module(moduleName, [])
  .service('errorsService', /*@ngInject*/ function ErrorHandler() {

    this.showErrorBox = (message, error) => {
      let extra;

      if (error && error.contains('EACCES') !== -1) {
        extra = 'Have you fixed npm permissions? \n\nCheck this simple tutorial: \nhttps://docs.npmjs.com/getting-started/fixing-npm-permissions.';
      }

      dialog.showErrorBox(message, `\n\n${error}\n\n${extra}`);

    };
  });

export default moduleName;
