/*global angular*/
import angular from 'angular';

angular.module('npm-ui.loading', [])
  .service('LoadingService', /*@ngInject*/ ($window) => {

    const loadingService = ($window) => {

      this.loading = () => {
        //$window.document.body.classList.add('loading');
      };

      this.finished = () => {

      //  $window.document.body.classList.remove('loading');
      }
    };
  });

export default 'npm-ui.loading';
