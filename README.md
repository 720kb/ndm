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

### Download

Download the latest **ndm** release **[here](https://720kb.github.io/ndm)**

######You can browse all the releases at [github.com/720kb/ndm/releases](https://github.com/720kb/ndm/releases)

### What's ndm ?

**ndm** formally _"Npm Desktop Manager"_ is the desktop GUI for [npm](https://npmjs.com/).

With **ndm** you can easily manage npm and npm modules directly from the couch, without opening the a shell terminal.

**ndm** uses the [npm-cli](https://docs.npmjs.com/cli/npm) - ```require('npm');```- and is packed up thanks to [Electron](https://github.com/electron/electron) with some touch of AngularJS and Sass.

Feel free to reach any of us for any info/question, or to support the project in any way you wish.

### I love the Shell, why use an app?

Of course, we all love it too.

The Shell is obviously very powerful.

However, not all the people know how to use it from the scratch.

Usually novice programmers or web designers can not use the Shell, so we thought we could build an alternative experience to `npm` dependencies management.

Also sometimes we're just lazy, and we want to do everything with few clicks on a nice User Interface. 


Some of the added values of **ndm**:

- Less struggling with multiple terminal tabs
- Long terminal logs and scrolling to find warnings and errors are a things of the past now
- All your projects are "on the same page"
- Intuitive interface (no doc required)
- Notifications (when your long long npm install finishes)
- Check every package npm informations with two clicks
- Run npm commands and scripts in two clicks

More features:

You can edit project package.json in-place, "Snapshot" projects and revert them from the "History" prompt - this makes easier to try any changes before releasing them (i.e: update pkgs, install new pkgs, delete pkgs, and so on..)


**Note that:** using **ndm** doesn't mean you can no longer use the CLI - The power of the Shell is strong! Use it, young Padawan! :D

### Run it locally 

Only the MacOS version is available at the moment to download, but you can build/run `ndm` on your machine following these easy steps:

Choose A (easiest) or B (more convenient - you build the desktop app electron package):


### A. Run 

_Development mode - easiest_

Build and run locally in development

_Setup_

`$ git clone <repo> && cd ndm`

`$ npm install`

_Run app_

`$ npm start`


### B. Build the application 

_generate a Desktop application - the most convenient way_

If you want to build your own executable:

`$ git clone <repo> && cd ndm`

`$ npm install`

Adjust `package.json`  "[build](https://github.com/720kb/ndm/blob/master/package.json)" field according on how [electron-builder](https://github.com/electron-userland/electron-builder) works, then just run:

`$ npm run build`

This will create the executable wich you can run whitout needing to open the terminal.


### Contribute

We'll be much grateful if you help and contribute to the project, in any way, even a feature request.
Feel free to contribute by forking, opening issues, pull requests and whatever you think it's important for the project.

Doors are wide open!

Below are the few guidelines to follow, in case, just that!

[Contributing Guidelines](https://github.com/720kb/ndm/blob/master/CONTRIBUTING.md)

###Recommendations

- Is highly recommended to install node and npm via Brew or Nvm or N
- Is highly recommended to not start the app with `sudo` when developing or testing (WRONG! `sudo npm start`)
- Is recommended to not rename `node_modules/` folder in your projects
- Is recommended to snapshot projects inside ndm (Right click on a project -> snapshot) so that: any change or edit to the project can be reverted from the project History (Right click on a project -> History)
- Is recommended to manage only `.git` projects with ndm (so that everything can be reverted to it's previous status)
- Is recommended to install and use always the LTS nodejs version

### FAQ

**Is ndm stable?**

The first releases are not guaranteed to be very stable, some problem/bug may happen.

Just give it time, have some patience and, if you would, please contribute by forking, PR and/or creating issues, your help is always appreciated.


**Do i have to worry about anything when using ndm?**

Actually not, not really.
ndm does not run any malicious or env/system breaking commands in background, and it doesn't run anything outside npm native commands.
If you want to be 100% sure about this, just look at the source code, which is clear and very readable.


**Why is so slow on my pc?**

ndm speed depends exclusively on your pc/device specs and [npm-cli](https://docs.npmjs.com/cli/npm) speed.
We can't do much to speed up your computer or the npm commands.


**Yarn?**

This project was born several months before Yarn was out.
Yarn is a great tool, we are looking forward to seeing what happens.
Yarn is still quite a brand new project and many things could change in the meantime. That said: if you have any idea or suggestion: here you're welcome to share and discuss!


**Why Mac only?**

We now focus on one OS but the app is developed keeping in mind that it will have to run also on other OSs. We won't _put too much meat on bbq_ for the moment, it is now very important to obtain an OS-abstracted and stable app.

As soon as we are sure that the project is stable, it will be delivered to the other OSs.


**Support?**

Just open an issue we'll be in touch.

### Core team

[720kb](https://720kb.net)

###License

GNU GPLv3 [License](LICENSE.md).


### Contributors list

Contribute and edit the Readme to you to this list:

- [@wouldgo](https://github.com/wouldgo)
- [@45kb](https://github.com/45kb)
- [@makevoid](https://github.com/makevoid)
