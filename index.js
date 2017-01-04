/*global require process __dirname*/
(function withNode() {

  process.env.PATH = require('shell-path').sync();

  const {app, Menu, BrowserWindow, shell} = require('electron')
    , path = require('path')
    , packageJSON = require('./package.json')
    , applicationTemplate = packageJSON.appTemplate;
  // Keep a global reference of the window object, if you don't, the window will
  // be closed automatically when the JavaScript object is garbage collected.
  let mainWindow = null;

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    app.quit();
  });

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  app.on('ready', () => {

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
          'label': 'Documentation',
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
        },
        {
          'type': 'separator'
        },
        {
          'role': 'minimize'
        },
        {
          'role': 'close'
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

    let menuTemplate = [
      aboutMenuItem,
      editMenuItem,
      viewMenuItem,
      windowMenuItem,
      helpMenuItem
    ];

    Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));
    // Create the browser window.
    mainWindow = new BrowserWindow(applicationTemplate);
    // and load the index.html of the app.
    //path.join() necessary for windows
    mainWindow.loadURL(path.join('file://', __dirname, '/dist/index.html'));

    mainWindow.on('ready-to-show', () => {
      mainWindow.show();
    });
    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      mainWindow = null;
    });
  });
}());
