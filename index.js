/*global require,process,__dirname*/
(function withNode() {

  const {app, Menu, BrowserWindow} = require('electron');
  // Keep a global reference of the window object, if you don't, the window will
  // be closed automatically when the JavaScript object is garbage collected.
  let mainWindow = null;
  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {

      app.quit();
    }
  });

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  app.on('ready', () => {

      const template = [
        {
          label: 'Edit',
          submenu: [
            {
              role: 'undo'
            },
            {
              role: 'redo'
            },
            {
              type: 'separator'
            },
            {
              role: 'cut'
            },
            {
              role: 'copy'
            },
            {
              role: 'paste'
            },
            {
              role: 'pasteandmatchstyle'
            },
            {
              role: 'delete'
            },
            {
              role: 'selectall'
            }
          ]
        },
        {
          label: 'View',
          submenu: [
            {
              label: 'Reload',
              accelerator: 'CmdOrCtrl+R',
              click (item, focusedWindow) {
                if (focusedWindow) focusedWindow.reload()
              }
            },
            {
              label: 'Toggle Developer Tools',
              accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
              click (item, focusedWindow) {
                if (focusedWindow) focusedWindow.toggleDevTools()
              }
            },
            {
              type: 'separator'
            },
            {
              role: 'resetzoom'
            },
            {
              role: 'zoomin'
            },
            {
              role: 'zoomout'
            },
            {
              type: 'separator'
            },
            {
              role: 'togglefullscreen'
            }
          ]
        },
        {
          role: 'window',
          submenu: [
            {
              role: 'minimize'
            },
            {
              role: 'close'
            }
          ]
        },
        {
          role: 'help',
          submenu: [
            {
              label: 'Learn More',
              click () {
                shell.openExternal('http://electron.atom.io')
              }
            },
            {
              label: 'Documentation',
              click () {
                shell.openExternal(
                  `https://github.com/electron/electron/tree/v${process.versions.electron}/docs#readme`
                )
              }
            },
            {
              label: 'Community Discussions',
              click () {
                shell.openExternal('https://discuss.atom.io/c/electron')
              }
            },
            {
              label: 'Search Issues',
              click () {
                shell.openExternal('https://github.com/electron/electron/issues')
              }
            }
          ]
        }
      ]

      if (process.platform === 'darwin') {
        template.unshift({
          label: 'Electron',
          submenu: [
            {
              role: 'about'
            },
            {
              type: 'separator'
            },
            {
              role: 'services',
              submenu: []
            },
            {
              type: 'separator'
            },
            {
              role: 'hide'
            },
            {
              role: 'hideothers'
            },
            {
              role: 'unhide'
            },
            {
              type: 'separator'
            },
            {
              role: 'quit'
            }
          ]
        })
        template[1].submenu.push(
          {
            type: 'separator'
          },
          {
            label: 'Speech',
            submenu: [
              {
                role: 'startspeaking'
              },
              {
                role: 'stopspeaking'
              }
            ]
          }
        )
        template[3].submenu = [
          {
            role: 'close'
          },
          {
            role: 'minimize'
          },
          {
            role: 'zoom'
          },
          {
            type: 'separator'
          },
          {
            role: 'front'
          }
        ]
      } else {
        template.unshift({
          label: 'File',
          submenu: [
            {
              role: 'quit'
            }
          ]
        })
      }

      const menu = Menu.buildFromTemplate(template);
      Menu.setApplicationMenu(menu);
    // Create the browser window.
    mainWindow = new BrowserWindow({
      'title': 'ndm',
      'width': 720,
      'height': 480,
      'minWidth': 720,
      'show': false,
      'minHeight': 460,
      'center': true,
      'movable': true,
      'resizable': true,
      'minimizable': true,
      'maximizable': true,
      'closable': true,
      'fullscreenable': true,
      'dragable': true,
      'titleBarStyle': 'hidden'
    });
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
