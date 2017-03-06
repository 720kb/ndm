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
              if (windows[0] && windows[1]) {
                //hide updates window and show main window
                windows[0].hide();
                windows[1].show();
                windows[1].focus();
                windows[0].hide();
              }
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
