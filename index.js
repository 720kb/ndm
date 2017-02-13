/*global require __dirname*/
(function withNode() {

  const {app, Menu, BrowserWindow, shell} = require('electron')
    , path = require('path')
    , url = require('url')
    , packageJSON = require('./package.json')
    , applicationTemplate = packageJSON.appTemplate;

  let mainWindow
    , OSMenu;

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    app.quit();
  });
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  app.on('ready', () => {

    mainWindow = new BrowserWindow(applicationTemplate);
    OSMenu = require('./menu.js')(mainWindow, shell, packageJSON, app);

    Menu.setApplicationMenu(Menu.buildFromTemplate(OSMenu));

    mainWindow.on('ready-to-show', () => {
      //show it now to avoid blank page on rendering
      mainWindow.show();
    });
    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      mainWindow = null;
    });
    mainWindow.on('page-title-updated', event => {
      //lock app title
      event.preventDefault();
    });
    // and load the index.html of the app.
    //path.join() necessary for windows
    mainWindow.loadURL(url.format({
      'pathname': path.join(__dirname, 'dist', 'index.html'),
      'protocol': 'file:',
      'slashes': true
    }));
  });
}());
