/*global require*/
import angular from 'angular';
const moduleName = 'npm-ui.errors-handler'
  , electron = require('electron')
  , dialog = electron.remote.dialog;

angular.module(moduleName, [])
  .service('errorsService', /*@ngInject*/ function ErrorHandler() {

    this.showErrorBox = (message, error) => {
      let extra;

      if (error.indexOf('EACCESS') !== -1) {
        extra = '\n\nHave you fixed npm permissions? Check this quick guide: https://docs.npmjs.com/getting-started/fixing-npm-permissions.\n\n';
      }

      dialog.showErrorBox(message, error + extra);

    };
  });

export default moduleName;
