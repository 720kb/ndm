/*global module process*/
(function withNode() {

  module.exports = (mainWindow, updateWindow, shell, packageJSON, app) => {

    let menuTemplate;

    const aboutMenuItem = {
      'submenu': [
        {
          'role': 'about'
        },
        {
          'label': `Version ${packageJSON.version}`,
          'enabled': false
        },
        {
          'label': 'Check for Updates...',
          click() {

            mainWindow.webContents.send('loading:freeze-app');
            updateWindow.setMenu(null);
            updateWindow.show();
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
          'role': 'togglefullscreen'
        },
        {
          'type': 'separator'
        },
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
          'label': 'Donate',
          click() {
            shell.openExternal(packageJSON.donate.opencollective);
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

    if (process.platform !== 'darwin' &&
    process.platform !== 'win32') {

      //if linux no need for "check for updates"
      aboutMenuItem.submenu.splice(2, 1);
    }

    if (process.platform &&
      process.platform === 'darwin') {
        aboutMenuItem.label = packageJSON.name;
          aboutMenuItem.submenu.push({
            'type': 'separator'
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
      } else {
        aboutMenuItem.label = 'About';

        viewMenuItem.submenu.unshift({
          'label': 'Toggle menu',
          click() {
            mainWindow.setAutoHideMenuBar(true);
            if (mainWindow.isMenuBarVisible()) {

              mainWindow.setMenuBarVisibility(false);
            } else {

              mainWindow.setMenuBarVisibility(true);
            }
          }
        });

        menuTemplate = [
          fileMenuItem,
          editMenuItem,
          viewMenuItem,
          helpMenuItem,
          aboutMenuItem
        ];
      }

    return menuTemplate;
  };
}());
