
## Build the app

_Generate the Desktop executables which you can run whitout needing to open the terminal (.dmg, .deb, .exe, etc ..)_ 

#### Setup

```
$ git clone https://github.com/720kb/ndm.git

$ cd ndm`

$ npm install
```


#### Builds for Mac

`$ npm run build-mac`

#### Builds for Linux

`$ npm run build-linux`

#### Builds for Windows

`$ npm run build-win`

#### Builds for all the platforms

`$ npm run build`


The executables are generated thanks to the [electron-builder](https://github.com/electron-userland/electron-builder), if you want you can change the build settings to your needs, just follow their documentation.

The executables will be generated inside the `/releases` folder.
