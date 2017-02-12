/*global require,__dirname,process*/
const {app, Menu, BrowserWindow, shell} = require('electron')
  , supportedPlatforms = ['win32', 'darwin', 'linux']
  , path = require('path')
  , url = require('url')
  , packageJSON = require('./package.json')
  , fetch = require('node-fetch')
  , applicationTemplate = packageJSON.appTemplate
  , operatingSystemSupported = res => new Promise((resolve, reject) => {

    if (supportedPlatforms.indexOf(process.platform) >= 0) {

      return resolve(res);
    }

    reject({
      'code': 123,
      'cause': 'Operating system not supported'
    });
  })
  , onVersionFetched = res => new Promise(resolve => {
    let filterWith;

    if (process.platform === 'win32') {

      filterWith = element => element.name.indexOf('.exe');
    } else {

      filterWith = element => element.name.indexOf('.dmg');
    }

    //Update not present
    if (res.name === `v${packageJSON.version}` ||
      process.platform === 'linux') { //Linux must be updated outside the application

      return resolve(url.format({
        'pathname': path.resolve(__dirname, 'dist', 'index.html'),
        'protocol': 'file:',
        'slashes': true
      }));
    }

    return resolve(url.format({
      'pathname': path.resolve(__dirname, 'dist', 'update.html'),
      'protocol': 'file:',
      'slashes': true,
      'query': {
        'newerVersion': res.assets
          .filter(filterWith)
          .reduce(prev => prev).browser_download_url
      }
    }));
  });

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  app.quit();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', () => {

  let mainWindow = new BrowserWindow(applicationTemplate);
  const OSMenu = require('./menu.js')(mainWindow, shell, packageJSON, app);

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

  // and load the index.html of the app.
  //path.resolve() necessary for windows
  fetch('https://api.github.com/repos/720kb/ndm/releases/latest')
    .then(operatingSystemSupported)
    .then(res => {

      if (res.ok) {

        return res.json();
      }

      throw new Error('Connectivity issues');
    })
    .then(onVersionFetched, () => onVersionFetched({
      'name': `v${packageJSON.version}`
    }))
    .then(page => mainWindow.loadURL(page))
    .catch(({
      cause = 1,
      code = 'Error in application startup'
    }) => {

      process.stderr.write(cause);
      process.exit(code);
    });
});
