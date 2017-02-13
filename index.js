/*global require,__dirname*/
const {app, Menu, BrowserWindow, shell} = require('electron')
  , path = require('path')
  , url = require('url')
  , packageJSON = require('./package.json')
  , applicationTemplate = packageJSON.appTemplate;

app.on('window-all-closed', () => {
  app.quit();
});

app.on('ready', () => {

  const mainWindow = new BrowserWindow(applicationTemplate)
    , updateWindow = new BrowserWindow({
      'width': 640,
      'heigth': 480,
      'parent': mainWindow,
      'show': false,
      'title': 'ndm update'
    })
    , OSMenu = require('./menu.js')(mainWindow, updateWindow, shell, packageJSON, app);

  Menu.setApplicationMenu(Menu.buildFromTemplate(OSMenu));
  updateWindow.loadURL(url.format({
    'pathname': path.resolve(__dirname, 'dist', 'update.html'),
    'protocol': 'file:',
    'slashes': true
  }));

  updateWindow.on('close', event => {
    event.preventDefault();

    updateWindow.hide();
  });

  mainWindow.on('page-title-updated', event => {
    //lock app title
    event.preventDefault();
  });

  mainWindow.on('ready-to-show', () => {

    mainWindow.show();
  });

  mainWindow.on('closed', () => {

    app.quit();
  });

  mainWindow.loadURL(url.format({
    'pathname': path.resolve(__dirname, 'dist', 'index.html'),
    'protocol': 'file:',
    'slashes': true
  }));
});
