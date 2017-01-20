/*global require Notification*/
import angular from 'angular';
const moduleName = 'npm-ui.notification'
  , electron = require('electron')
  , BrowserWindow = electron.remote.BrowserWindow;

angular.module(moduleName, [])
  .service('notificationFactory', /*@ngInject*/ () => {

    const notify = (body, skeepFocus, onClickCallback) => {
      if (!BrowserWindow.getFocusedWindow() || skeepFocus) {

          let windows
            , notification = new Notification('ndm', {
            body,
            'sticky': true
          });

          notification.onclick = () => {
            if (!skeepFocus) {
              windows = BrowserWindow.getAllWindows();

              windows.forEach(window => {
                window.show();
                window.focus();
              });
            }
            notification = undefined;

            if (onClickCallback) {
              return onClickCallback();
            }
          };
        }
      };

    return {
      notify
    };
  });

export default moduleName;
