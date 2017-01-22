/*global*/
import angular from 'angular';
const moduleName = 'npm-ui.ng-table-keyboard';

angular.module(moduleName, [])
  .directive('ngTableKeyboard', /*@ngInject*/ function ngTableKeyboard($window, $parse) {
    return (scope, element, attrs) => {
    const tableItemIndex = $parse(attrs.ngTableKeyboardItem)
      , onKeyDown = () => {
        angular.element(element).triggerHandler('click');
        return tableItemIndex;
      }
      , onKeyUp = () => {
        angular.element(element).triggerHandler('click');
      };

      angular.element($window).on('keydown', event => {
        if (event &&
          event.keyCode) {
          if (event.keyCode === 40) {
            onKeyDown();
          }
          if (event.keyCode === 38) {
            onKeyUp();
          }
        }
      });
    };
  });

export default moduleName;
