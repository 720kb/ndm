/*global module process*/
(function withNode() {

  module.exports = (mainWindow, shell, packageJSON, app) => {

    let menuTemplate;

    const aboutMenuItem = {
      'submenu': [
        {
          'label': `Version ${packageJSON.version}`,
          'enabled': false
        },
        {
          'label': 'Check for Updates...',
          click() {
            //***!!DEPRECATED this method will be remove ***!!, must be an autoupdater to check for this
            mainWindow.webContents.send('menu:check-for-updates', packageJSON.version);
          }
        },
        {
          'type': 'separator'
        },
        {
          'label': 'Visit Website',
          click() {
            shell.openExternal(packageJSON.homepage);
          }
        },
        {
          'type': 'separator'
        }
      ]
    }
    , fileMenuItem = {
      'label': 'File',
      'submenu': [
        {
          'label': 'Add Project...',
          'accelerator': 'CmdOrCtrl+O',
          click() {
            mainWindow.webContents.send('menu:add-project-folder');
          }
        }
      ]
    }
    , editMenuItem = {
      'label': 'Edit',
      'submenu': [
        {
          'role': 'undo'
        },
        {
          'role': 'redo'
        },
        {
          'type': 'separator'
        },
        {
          'role': 'cut'
        },
        {
          'role': 'copy'
        },
        {
          'role': 'paste'
        },
        {
          'role': 'pasteandmatchstyle'
        },
        {
          'role': 'delete'
        },
        {
          'role': 'selectall'
        }
      ]
    }
    , viewMenuItem = {
      'label': 'View',
      'submenu': [
        {
          'label': 'Developer',
          'submenu': [{
            'label': 'Open DevTools',
            click(item, focusedWindow) {
              if (focusedWindow) {
                focusedWindow.openDevTools();
              }
            }
          }]
        },
        {
          'type': 'separator'
        },
        {
          'role': 'togglefullscreen'
        }
      ]
    }
    , windowMenuItem = {
      'role': 'window',
      'submenu': [
        {
          'role': 'minimize'
        },
        {
          'role': 'close'
        }
      ]
    }
    , helpMenuItem = {
      'role': 'help',
      'submenu': [
        {
          'label': 'More About',
          click() {
            shell.openExternal(`${packageJSON.github}`);
          }
        },
        {
          'label': 'Report an issue',
          click() {
            shell.openExternal(`${packageJSON.bugs.url}`);
          }
        },
        {
          'type': 'separator'
        },
        {
          'label': 'Join Chat',
          click() {
            shell.openExternal(`${packageJSON.social.gitter.url}`);
          }
        },
        {
          'label': 'Follow on Twitter',
          click() {
            shell.openExternal(`${packageJSON.social.twitter.url}`);
          }
        }
      ]
    };

    //now push OS menu items for linux and mac
    if (process.platform &&
      process.platform !== 'win32') {
        //if mac or linux
        aboutMenuItem.label = packageJSON.name;
        //if mac only
        if (process.platform === 'darwin') {
          aboutMenuItem.submenu.unshift({
            'role': 'about'
          });
          aboutMenuItem.submenu.push({
            'role': 'hide'
          });
          aboutMenuItem.submenu.push({
            'role': 'hideothers'
          });
          aboutMenuItem.submenu.push({
            'role': 'unhide'
          });
          aboutMenuItem.submenu.push({
            'type': 'separator'
          });
        }
      } else {
        aboutMenuItem.label = 'About';
      }

      aboutMenuItem.submenu.push({
        'label': 'Restart',
        'accelerator': 'CmdOrCtrl+R',
        click() {
          app.relaunch();
          app.quit();
        }
      });
      aboutMenuItem.submenu.push({
        'role': 'quit'
      });

      menuTemplate = [
        aboutMenuItem,
        fileMenuItem,
        editMenuItem,
        viewMenuItem,
        windowMenuItem,
        helpMenuItem
      ];

      if (process &&
        process.platform !== 'win32' &&
        process.platform !== 'darwin') {
          //if it's linux
          menuTemplate = [
            aboutMenuItem,
            fileMenuItem,
            editMenuItem,
            viewMenuItem,
            helpMenuItem
          ];
        }
    return menuTemplate;
  };
}());
