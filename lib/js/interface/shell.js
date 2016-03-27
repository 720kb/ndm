import angular from 'angular';
const moduleName = 'npm-ui.shell';

angular.module(moduleName, [])
  .controller('ShellController', /*@ngInject*/ function HomeController($window) {
    const localStorageName = 'projects'
     , savedProjects = JSON.parse($window.localStorage.getItem(localStorageName));

    if (savedProjects &&
      savedProjects.length) {

      this.projects = savedProjects;
    } else {

      this.projects = [];
    }

    this.chooseProjectDir = () => {

      const dir = $window.dialog.showOpenDialog({
        'properties': [
          'openDirectory'
        ]
      });

      if (dir &&
        dir[0]) {
        const newDir = dir[0]
          , alreadyPresent = this.projects.some(element => {

            return element.path &&
              element.path === newDir;
          });

        if (alreadyPresent) {

          $window.dialog.showErrorBox('Error', 'You already added this project folder');
        } else {
          const newProject = {
            'dirName': newDir.split(/\//g).pop(),
            'path': newDir
          };

          this.projects.unshift(newProject);
          $window.localStorage.setItem(localStorageName, JSON.stringify(this.projects));
        }
      } else {

        $window.dialog.showErrorBox('Error', 'Please select a project folder');
      }
    };

    this.openBrowserLink = url => {

      $window.shell.openExternal(url);
    };
  });

export default moduleName;
