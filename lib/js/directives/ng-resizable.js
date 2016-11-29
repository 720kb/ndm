/*global*/
import angular from 'angular';
const moduleName = 'npm-ui.ng-resizable';

angular.module(moduleName, [])
.directive('ngResizable', /*@ngInject*/ function ngResizable($window, $document) {
  return (scope, element) => {

    let getMaxHeight = () => {
        return Number($window.innerHeight - 120);
      }
      , maxHeight = getMaxHeight()
      , minHeight = 250;

    const onMouseMove = event => {

      element.css({
        'height': `${event.pageY - Number(element[0].offsetTop)}px`
      });

      if (element[0].offsetHeight <= minHeight) {
        element.css('height', `${minHeight}px`);
      }

      if (element[0].offsetHeight >= maxHeight) {
        element.css('height', `${maxHeight}px`);
      }
    }
    , onMouseUp = () => {
      $document.unbind('mousemove', onMouseMove);
      $document.unbind('mouseup', onMouseUp);
    };

    element.on('mousedown', event => {
      event.preventDefault();
      $document.on('mousemove', onMouseMove);
      $document.on('mouseup', onMouseUp);
    });

    angular.element($window).on('resize', () => {
      maxHeight = getMaxHeight();
    });
  };
});

export default moduleName;
