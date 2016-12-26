
### Run it locally 

You can build and run `ndm` on Linux, Windows and MacOS, just follow these easy steps:

Choose **A** (easiest) or **B** (more convenient):


### A. Run 

_Development mode - easiest_

Build and run the app locally in development mode

_Setup_

`$ git clone <repo> && cd ndm`

`$ npm install`

_Run app_

`$ npm start`


### B. Build the application 

_Generate the Desktop application - the most convenient way_

Create the executables which you can run whitout needing to open the terminal:

`$ git clone <repo> && cd ndm`

`$ npm install`

Adjust `package.json`  "[build](https://github.com/720kb/ndm/blob/master/package.json)" field according on how [electron-builder](https://github.com/electron-userland/electron-builder) works, then just run:

`$ npm run build`

