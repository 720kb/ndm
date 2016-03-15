import angular from 'angular';

angular.module('npm-ui.session', [
    'LocalStorageModule'
  ])
  .provider('session', /*@ngInject*/ function Session(localStorageServiceProvider) {
    let whatToRegister = [];

    localStorageServiceProvider.setPrefix('ndm');
    /**
    *  what =>  [{
    *            name, //session property name
    *            default, //session property default value
    *            reset //true if on startup need to set undefined
    *           }]
    */
    this.registerInSession = (...what) => {

      if (what) {

        whatToRegister = whatToRegister.concat(what);
      }
    };

    this.$get = /*@ngInject*/ (localStorageService, $rootScope) => {
      const unregisterFunctions = [];

      whatToRegister.forEach(element => {

        unregisterFunctions.push(localStorageService.bind($rootScope, element.name));
        if (element.reset) {

          $rootScope[element.name] = undefined;
        } else {

          $rootScope[element.name] = localStorageService.get(element.name) || element.default;
        }
      });

      $rootScope.$on('$destroy', () => {

        unregisterFunctions.forEach(element => element());
      });

      return 'Session ready!';
    };
  });

export default 'npm-ui.session';
