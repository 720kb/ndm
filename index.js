/*global require,__dirname,process*/
const {app, Menu, BrowserWindow, shell} = require('electron')
  , path = require('path')
  , url = require('url')
  , fs = require('fs')
  , exec = require('child_process').execFile
  , packageJSON = require('./package.json')
  , fetch = require('node-fetch')
  , applicationTemplate = packageJSON.appTemplate;

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

  mainWindow.on('page-title-updated', event => {
    //lock app title
    event.preventDefault();
  });

  // and load the index.html of the app.
  //path.resolve() necessary for windows
  fetch('https://api.github.com/repos/720kb/ndm/releases/latest')
    .then(res => res.json())
    .then(res => {
      if (res.name === `v${packageJSON.version}`) {

        mainWindow.loadURL(url.format({
          'pathname': path.resolve(__dirname, 'dist', 'index.html'),
          'protocol': 'file:',
          'slashes': true
        }));
      } else {
        const assets = res.assets
          , tmpFolder = path.resolve(path.sep, 'tmp', path.sep, 'ndm-');

        let toDownload;

        if (process &&
          process.platform === 'win32') {
          const newVersion = assets
            .filter(element => element.name.indexOf('.exe'))
            .reduce(prev => prev);

          toDownload = newVersion.browser_download_url;
        } else if (process &&
          process.platform === 'darwin') {

          const newVersion = assets
            .filter(element => element.name.indexOf('.exe'))
            .reduce(prev => prev);

          toDownload = newVersion.browser_download_url;
        } else { //Linux

          const newVersion = assets
            .filter(element => element.name.indexOf('.exe'))
            .reduce(prev => prev);

          toDownload = newVersion.browser_download_url;
        }

        fs.mkdtemp(tmpFolder, (err, folder) => {
          if (err) {

            throw err;
          }
          fetch(toDownload)
            .then(downloadedFile => {
                const fileToSave = path.resolve(folder, downloadedFile)
                  , dest = fs.createWriteStream(fileToSave);

                dest.on('finish', () => {

                  exec(fileToSave, execErr => {
                    if (execErr) {

                      throw execErr;
                    }
                  });
                });

                downloadedFile.body.pipe(dest);
            });
        });
      }
    });
});
