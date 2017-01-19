/*global require,console*/
import angular from 'angular';

const moduleName = 'npm-ui.assets'
  , fs = require('fs')
  , Path = require('path')
  , storage = require('electron-storage');

angular.module(moduleName, [])
  .provider('assets', /*@ngInject*/ function Session() {
    const projectsFolder = 'projects.json'
      , projects = [];

    storage.get(projectsFolder)
      .then(data => {

        if (data &&
          data.length) {

          data.forEach(item => {
            let isPath
              , isShrinkwrap;

            if (item &&
              item.path) {

                try {
                  //is a directory?
                  if (fs.lstatSync(item.path).isDirectory()) {
                    isPath = true;
                  } else {
                    isPath = false;
                  }
                } catch (excp) {
                  isPath = false;
                  console.warn(`Unable to read project path: ${excp}`);
                }

                try {
                  //is shrinkwrapped -> has npm-shrinkwrap.json inside?
                  if (fs.existsSync(Path.join(item.path, 'npm-shrinkwrap.json'))) {
                    isShrinkwrap = true;
                  } else {
                    isShrinkwrap = false;
                  }
                } catch (excp) {
                  isShrinkwrap = false;
                  console.warn(`No npm-shrinkwrap.json found in project path: ${excp}`);
                }

                if (isShrinkwrap) {
                  item.shrinkwrap = true;
                } else {
                  item.shrinkwrap = false;
                }

                if (isPath) {
                  console.log(item);
                  projects.push(item);
                }
              }
          });
        }
      })
      .catch(err => () => {
        console.err(`Unable to retrieve saved projects: ${err}`);
      });

    projects.save = projectInfo => storage.set(projectsFolder, projectInfo);

    this.$get = /*@ngInject*/ () => ({
      projects
    });
  });

export default moduleName;
