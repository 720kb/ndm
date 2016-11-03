/*global*/
import angular from 'angular';
const moduleName = 'npm-ui.ng-right-click';

angular.module(moduleName, [])
  .directive('ngRightClick', /*@ngInject*/ function ngRightClick($parse) {
    return (scope, element, attrs) => {

      element.on('contextmenu', event => {
        scope.$apply(() => {
          event.preventDefault();
          let fn = $parse(attrs.ngRightClick);
          fn(scope, {
            '$event': event
          });
        });
      });
    };
  });

export default moduleName;
