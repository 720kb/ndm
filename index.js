/*global require,process,__dirname*/
const {app, Menu, BrowserWindow, shell} = require('electron')
  , path = require('path')
  , url = require('url')
  , packageJSON = require('./package.json')
  , storage = require('./storage')
  , _ = require('lodash');

app.on('window-all-closed', () => {
  app.quit();
});

app.on('ready', () => {

  storage.loadData().then(data => {

    windowOptions = {
      'width': data.window.width,
      'height': data.window.height,
      'title': data.title
    }

    const mainWindow = new BrowserWindow(windowOptions)
      , updateWindow = new BrowserWindow({
        'width': 400,
        'height': 192,
        'parent': mainWindow,
        'show': false,
        'resizable': false,
        'maximizable': false,
        'alwaysOnTop': true,
        'fullscreenable': false,
        'title': ''
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

      mainWindow.webContents.send('loading:unfreeze-app');
      updateWindow.hide();
    });

    mainWindow.on('ready-to-show', () => {

      mainWindow.show();
    });

    mainWindow.on('page-title-updated', event => {
      //lock app title otherwise gets the index.html filename
      event.preventDefault();
    });

    mainWindow.on('restore', () => {
      //hide autoupdates window
      updateWindow.hide();
      mainWindow.webContents.send('loading:unfreeze-app');
    });

    mainWindow.on('enter-full-screen', () => {
      //hide autoupdates window
      updateWindow.hide();
      mainWindow.webContents.send('loading:unfreeze-app');
    });

    mainWindow.on('closed', () => {

      app.quit();
    });

    mainWindow.loadURL(url.format({
      'pathname': path.resolve(__dirname, 'dist', 'index.html'),
      'protocol': 'file:',
      'slashes': true
    }));

    const windowBounds = _.throttle(() => {
      const bounds = mainWindow.getBounds();
      data.window = bounds;
      storage.saveData(data);
    }, 500);

    mainWindow.on('resize', windowBounds );

  });
});
