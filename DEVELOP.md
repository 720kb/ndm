
## Run it locally 

You can build and run `ndm` on Linux, Windows and MacOS, just follow these easy steps:

Choose **A** (easiest) or **B** (more convenient):


### A. Run 

_Development mode - easiest_

Run the app locally in development mode

_Setup_

`$ git clone <repo> && cd ndm`

`$ npm install`

_Run app_

#### Run on Linux
`$ npm run linux`

#### Run on Mac
`$ npm run mac`

#### Run on Windows
`$ npm run win`


### B. Build 

_Generate the Desktop application - the most convenient way_

Create the executables which you can run whitout needing to open the terminal:

`$ git clone <repo> && cd ndm`

`$ npm install`

Adjust `package.json`  "[build](https://github.com/720kb/ndm/blob/master/package.json)" field according on how [electron-builder](https://github.com/electron-userland/electron-builder) works, then just run:

#### Builds for Mac

`$ npm run build-mac`

#### Builds for Linux

`$ npm run build-linux`

#### Builds for Windows

`$ npm run build-win`

The executables will be generated inside the `/resources` folder

