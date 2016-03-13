'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var electron = _interopDefault(require('electron'));

var title = "Npm manager";
var icon = "";
var width = 690;
var height = 450;
var minWidth = 650;
var minHeight = 400;
var center = true;
var movable = true;
var resizable = true;
var minimizable = true;
var maximizable = true;
var closable = true;
var fullscreenable = true;
var dragable = true;
var titleBarStyle = "hidden";
var applicationConfiguration = {
	title: title,
	icon: icon,
	width: width,
	height: height,
	minWidth: minWidth,
	minHeight: minHeight,
	center: center,
	movable: movable,
	resizable: resizable,
	minimizable: minimizable,
	maximizable: maximizable,
	closable: closable,
	fullscreenable: fullscreenable,
	dragable: dragable,
	titleBarStyle: titleBarStyle
};

var application = electron.app;
var BrowserWindow = electron.BrowserWindow;
// Module to create native browser window.
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

// Quit when all windows are closed.
application.on('window-all-closed', function () {

  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {

    application.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
application.on('ready', function () {
  // Create the browser window.
  mainWindow = new BrowserWindow(applicationConfiguration);

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {

    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});
//# sourceMappingURL=index.js.map