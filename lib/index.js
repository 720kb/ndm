/*global __dirname,process*/
import electron from 'electron';
import applicationConfiguration from '../conf/application.json';

const application = electron.app // Module to control application life.
  , BrowserWindow = electron.BrowserWindow; // Module to create native browser window.
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow = null;

// Quit when all windows are closed.
application.on('window-all-closed', () => {

  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {

    application.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
application.on('ready', () => {
  // Create the browser window.
  mainWindow = new BrowserWindow(applicationConfiguration);

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);
  mainWindow.toggleDevTools();
  // Emitted when the window is closed.
  mainWindow.on('closed', () => {

    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});
