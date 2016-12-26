## Recommendations

- It is highly recommended to install node and npm via Brew or nvm or n
- It is highly recommended to not start the app with `sudo` when developing or testing (WRONG! `sudo npm start`)
- It is recommended to not rename `node_modules/` folder in your projects
- It is recommended to snapshot projects inside ndm (Right click on a project -> Snapshot) so that: any change or edit to the project can be reverted from the snapshots history (Right click on a project -> History)
- It is recommended to manage only `.git` projects with ndm (so that everything can be reverted to it's previous status)
- It is recommended to install and use always the LTS nodejs version
- It is highly reccomended to not uninstall or install npm globally using ndm if you don't know what you are doing. (npm global installation should be up to specific tools such as nvm, brew, etc..)
