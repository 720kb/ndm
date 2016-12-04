/*global*/
import angular from 'angular';
const moduleName = 'npm-ui.ng-autoscroll';

angular.module(moduleName, [])
.directive('ngAutoscroll', /*@ngInject*/ function ngAutoscroll() {
  return (scope, element) => {
    scope.$watch(() => {
      element[0].scrollTop = element[0].scrollHeight;
    });
  };
});

export default moduleName;
