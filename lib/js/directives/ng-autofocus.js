/*global*/
import angular from 'angular';
const moduleName = 'npm-ui.autofocus';

angular.module(moduleName, [])
  .directive('ngAutofocus', /*@ngInject*/ function ngAutofocus() {
    return (scope, element) => {
      scope.$evalAsync(() => {
        element[0].focus();
      });
    };
  });

export default moduleName;
