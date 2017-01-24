## Recommendations :ok_hand:

- It is highly recommended to install node and npm via brew or nvm or n
- It is highly recommended to not start the app with `sudo` when developing or testing (WRONG! `sudo npm run...`)
- It is recommended to not rename `node_modules/` folder in your projects (which is a standard naming for node pkgs folder)
- It is recommended to manage only versioned projects with ndm (git, svn, mercurial etc..) so that everything can be reverted to it's previous/original status
- It is recommended to install and use always the LTS node version (brew or nvm or n, will help you to manage this with comfort)
- It is highly recommended to fix npm permissions on your machine (if not already fixed). This means no more `sudo`, how to fix them is simple and written here: https://docs.npmjs.com/getting-started/fixing-npm-permissions
- It is recommended to always run the latest version of ndm
- It is highly reccomended to not install packages globally if those packages aren't meant/developed to be installed globally. Installing them globally and you might face strange problems when trying to uninstall them and probably other related problems.
- It is recomended to not change default npm configs and the use of .npmrc are not yet supported by ndm (we will remove this recommandation as soon has these features will be implemented)

🌈 Happy npm desktop managing!
