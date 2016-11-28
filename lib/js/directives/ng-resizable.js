/*global*/
import angular from 'angular';
const moduleName = 'npm-ui.ng-resizable';

angular.module(moduleName, [])
  .directive('ngResizable', /*@ngInject*/ function ngResizable($window) {
    return (scope, element) => {
      let elementCurrentHeight;

      const tollerance = 15
        , minHeight = 250
        , mouseMove = event => {

          element.css('height', `${event.y - tollerance}px`);

          let maxHeight = $window.innerHeight - 120
            , elementCurrentHeight = element[0].offsetHeight;

          if (elementCurrentHeight <= minHeight) {
            element.css('height', `${minHeight}px`);
          }
          if (elementCurrentHeight >= maxHeight) {
            element.css('height', `${maxHeight}px`);
          }
        };

      element.on('mousedown', () => {
        element.bind('mousemove', mouseMove);
      });

      element.on('mouseup click focusout', () => {
        element.off('mousemove', mouseMove);
      });
    };
  });

export default moduleName;
