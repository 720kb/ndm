/*global require process __dirname*/
(function withNode() {

  process.env.PATH = require('shell-path').sync();

  const {app, Menu, BrowserWindow, shell} = require('electron')
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
    const menuTemplate = [
      {
      'label': packageJSON.name,
      'submenu': [
        {
          'role': 'about'
        },
        {
          'type': 'separator'
        },
        {
          'label': 'Check for Updates',
          click() {
            //***!!DEPRECATED this method will be remove ***!!, must be an autoupdater to check for this
            mainWindow.webContents.send('menu:check-for-updates', packageJSON.version);
          }
        },
        {
          'type': 'separator'
        },
        {
          'type': 'separator'
        },
        {
          'role': 'hide'
        },
        {
          'role': 'hideothers'
        },
        {
          'role': 'unhide'
        },
        {
          'type': 'separator'
        },
        {
          'label': 'Website',
          click() {
            shell.openExternal(packageJSON.homepage);
          }
        },
        {
          'type': 'separator'
        },
        {
          'label': 'Debug',
          click(item, focusedWindow) {
            if (focusedWindow) {
              focusedWindow.openDevTools();
            }
          }
        },
        {
          'type': 'separator'
        },
        {
          'label': 'Documentation',
          click() {
            shell.openExternal(`${packageJSON.github}`);
          }
        },
        {
          'label': 'Report issues',
          click() {
            shell.openExternal(`${packageJSON.bugs.url}`);
          }
        },
        {
          'type': 'separator'
        },
        {
          'label': 'Restart',
          'accelerator': 'CmdOrCtrl+R',
          click() {
            app.relaunch();
            app.quit();
          }
        },
        {
          'type': 'separator'
        },
        {
          'role': 'quit'
        }
      ]
    },
    {
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
    }];

    Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));
    // Create the browser window.
    mainWindow = new BrowserWindow(applicationTemplate);
    // and load the index.html of the app.
    mainWindow.loadURL(`file://'${__dirname}/dist/index.html`);

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
