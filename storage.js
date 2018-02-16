'use strict';

const storage = require('electron-storage')
  , FILE_NAME = 'window-state.json'
  , DEFAULT = {
      title: "ndm",
      window: {
        width: 640,
        height: 420,
      }
    };

//Set main window height bigger for Windows ONLY
if (process.platform === 'win32') {
  DEFAULT.window.height += 30;
}
//Set main window height smaller for Linux ONLY
if (process.platform !== 'win32' &&
  process.platform !== 'darwin') {
  DEFAULT.window.height -= 20;
}

module.exports = {
  loadData() {
    return storage.isPathExists(FILE_NAME).then( exists => {
      return exists ? _retrieve() : _create();
    });
  },

  saveData(data) {
    return storage.set(FILE_NAME, data).then(() => data).catch(console.error);
  },
};

function _retrieve() {
  return storage.get(FILE_NAME).then( data => data).catch(console.error);
}

function _create() {
  return storage.set(FILE_NAME, DEFAULT).then(() => DEFAULT).catch(console.error);
}

