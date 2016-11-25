/*global require Notification*/
import angular from 'angular';
const moduleName = 'npm-ui.notification'
  , electron = require('electron')
  , BrowserWindow = electron.remote.BrowserWindow;

angular.module(moduleName, [])
  .service('notificationFactory', /*@ngInject*/ () => {

    const notify = body => {
      if (!BrowserWindow.getFocusedWindow()) {

          let notification = new Notification('ndm', {
            body,
            'sticky': true
          });

          notification.onclick = () => {
            let windows = BrowserWindow.getAllWindows();

            windows.forEach(window => {
              window.show();
              window.focus();
            });
            notification = undefined;
          };
        }
      };

    return {
      notify
    };
  });

export default moduleName;
