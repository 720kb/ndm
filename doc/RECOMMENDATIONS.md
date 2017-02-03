## Recommendations :ok_hand:

- It is highly recommended to install node and npm via brew or nvm or n or similars
- It is highly recommended (when developing or testing ndm) to not start the app with `sudo` (WRONG! `sudo npm run...`)
- It is recommended to not rename `node_modules/` folder in your projects (which is a standard naming for node pkgs folder and should never be renamed)
- It is recommended to manage only versioned projects (git, svn, mercurial etc..) with ndm so that everything can be reverted to it's previous/original status in case of unlikely event that gone wrong.
- It is recommended to install and use always the LTS node version (brew or nvm or n or similars will help you to manage this with comfort)
- It is highly recommended to fix npm permissions on your machine (if not already fixed). This means no more `sudo` when installing pkgs. How to fix them is simple and clearly written here: https://docs.npmjs.com/getting-started/fixing-npm-permissions
- It is recommended to always run the latest version of ndm
- It is highly reccomended to not install packages globally if those packages aren't meant/developed to be installed globally.  Installing them globally you might face strange problems when trying to uninstall them and probably other related problems.
- It is recomended to not change default npm configs and the use of .npmrc are not yet supported by ndm (we will remove this recommandation as soon has these features will be implemented/supported)

🌈 Happy npm desktop managing!
