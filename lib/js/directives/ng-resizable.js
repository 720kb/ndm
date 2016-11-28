/*global*/
import angular from 'angular';
const moduleName = 'npm-ui.ng-resizable';

angular.module(moduleName, [])
  .directive('ngResizable', /*@ngInject*/ function ngResizable($window) {
    return (scope, element) => {

      let isMouseDown;

      const mouseMove = event => {
          if (isMouseDown) {

            let maxHeight = $window.innerHeight - 120
              , tollerance = 40
              , minHeight = 250
              , elementOffsetTop = element[0].style.top;

            element.css('height', `${event.pageY - elementOffsetTop - tollerance}px`);

            if (element[0].offsetHeight <= minHeight) {
              element.css('height', `${minHeight}px`);
            }
            if (element[0].offsetHeight >= maxHeight) {
              element.css('height', `${maxHeight}px`);
            }
          }
        };

      element.on('mousedown', () => {
        isMouseDown = true;
      });

      element.on('mousemove', mouseMove);

      element.on('mouseup', () => {
        isMouseDown = false;
      });
    };
  });

export default moduleName;
