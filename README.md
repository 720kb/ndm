![github-banner.png](http://i.imgur.com/61OLE5Z.png)
<p align="center" style="text-align:center">
  <img src="http://i.imgur.com/bnxdjg9.png"/>
</p>

<p align="center" style="text-align:center">
<a href="https://github.com/720kb/ndm/releases" target="_blank">
<img src="https://img.shields.io/github/release/720kb/ndm.svg"/>
</a>
<a href="https://720kb.github.io/ndm/" target="_blank">
<img src="https://img.shields.io/github/downloads/720kb/ndm/total.svg"/>
</a>
<a href="https://gitter.im/720kb/ndm" target="_blank">
<img src="https://img.shields.io/gitter/room/ndm/ndm.js.svg"/>
</a>

</p>

## Download
**[Download the latest release](https://720kb.github.io/ndm)**

###### You can browse all the releases at [github.com/720kb/ndm/releases](https://github.com/720kb/ndm/releases)


## Homebrew

Alternatively, you can install **ndm** with [Homebrew Cask](https://caskroom.github.io/):

```bash
$ brew update
$ brew cask install ndm
```
### What's ndm ?

**ndm** formally _"npm desktop manager"_ is the desktop GUI for [npm](https://npmjs.com/).

With **ndm** you can manage npm, npm projects and npm packages with ease.

**ndm** is built with web technologies, it uses the [npm-cli](https://docs.npmjs.com/cli/npm) - ```require('npm');```- and it is packed up thanks to [Electron](https://github.com/electron/electron) with some touch of AngularJS and Sass.

### I love the Shell, why use an app?

Of course, we all love it too.

The Shell is obviously very powerful.

We wanted to build an alternative experience to the `npmCLI` and here is all the GUI pros we think you should not miss:

- Less struggling with multiple terminal tabs
- Less struggling with long terminal logs, scrolling to find warnings and errors are a things of the past now
- All your projects are on the same view
- Intuitive interface.
- Notifications (specially when your long long npm install finishes)
- Check npm packages informations with two clicks (such as repository, author, license and so on...)
- Run npm commands and scripts in two clicks

Also, sometimes we are just lazy and a GUI makes it more handy.

**Note that:** using **ndm** doesn't mean you can no longer use the CLI - The power of the Shell is strong! Keep using it, young Padawan! :D

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


### Contribute

We'll be much grateful if you help and contribute to the project, in any way, even a feature request.
Feel free to contribute by forking, opening issues, pull requests and whatever you think it's important for the project.

Doors are wide open!

Below are the few guidelines to follow in case, just that!

[Contributing Guidelines](https://github.com/720kb/ndm/blob/master/CONTRIBUTING.md)

###Recommendations

- Is highly recommended to install node and npm via Brew or nvm or n
- Is highly recommended to not start the app with `sudo` when developing or testing (WRONG! `sudo npm start`)
- Is recommended to not rename `node_modules/` folder in your projects
- Is recommended to snapshot projects inside ndm (Right click on a project -> Snapshot) so that: any change or edit to the project can be reverted from the snapshots history (Right click on a project -> History)
- Is recommended to manage only `.git` projects with ndm (so that everything can be reverted to it's previous status)
- Is recommended to install and use always the LTS nodejs version
- Is highly reccomended to not uninstall or install npm globally using ndm if you don't know what you are doing. (npm global installation should be up to specific tools such as nvm, brew, etc..)

### FAQ

**Is ndm stable?**

The first releases are not guaranteed to be very stable, some problem/bug may happen.

Just give it time, have some patience and, if you would, please contribute by forking, PR and/or creating issues, your help is always appreciated.


**Do i have to worry about anything when using ndm?**

Actually not, not really.
**ndm** does not run any malicious or env/system breaking commands in background, and it doesn't run anything outside of the npm native commands.
If you want to be 100% sure about it, just look at the source code, which is clear and very readable.

**Why is so slow on my pc?**

ndm speed depends exclusively on your pc/device specs and [npm-cli](https://docs.npmjs.com/cli/npm) speed.
We can't do much to speed up your machine or the npm commands.

**Yarn?**

Premise: **ndm** was born several months before Yarn was out.
Yarn is a great tool, we are looking forward to seeing what happens both on the Yarn and the npm side.
Many things could change in the meantime.
That said: if you have any idea or suggestion, here you are welcome to share and discuss!

**Why Mac only?**

We now focus on one OS but the app is developed keeping in mind that it will have to run also on other OSs. We won't _put too much meat on bbq_ for the moment, it is now very important to obtain an OS-abstracted and stable app.

As soon as we are sure that the project is stable, it will be delivered to the other OSs.

**Support?**

Just open an issue, we'll be in touch.

### Core team

[720kb](https://720kb.net)

###License

[GNU GPLv3](LICENSE.md).


### Contributors

Contribute and edit the Readme to you to this list:

- [@wouldgo](https://github.com/wouldgo)
- [@45kb](https://github.com/45kb)
- [@makevoid](https://github.com/makevoid)
