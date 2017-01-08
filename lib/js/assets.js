/*global require,console*/
import angular from 'angular';

const moduleName = 'npm-ui.assets'
  , fs = require('fs')
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
            let isPath;

            if (item &&
              item.path) {

                try {

                  if (fs.lstatSync(item.path).isDirectory()) {

                    isPath = true;
                  } else {

                    isPath = false;
                  }
                } catch (excp) {

                  isPath = false;
                  console.warn(`Unable to read project path: ${excp}`);
                }

                if (isPath) {

                  projects.push(item);
                }
              }
          });
        }
      })
      .catch(err => console.err);

    projects.save = projectInfo => storage.set(projectsFolder, projectInfo);

    this.$get = /*@ngInject*/ () => ({
      projects
    });
  });

export default moduleName;
