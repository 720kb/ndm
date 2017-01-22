/*global*/
import angular from 'angular';
const moduleName = 'npm-ui.ng-table-keyboard';

angular.module(moduleName, [])
  .directive('ngTableKeyboard', /*@ngInject*/ function ngTableKeyboard($window, $parse) {
    return (scope, element, attrs) => {
    let tableItemIndex = $parse(attrs.ngTableKeyboardItem)
      , onKeyDown = () => {
        angular.element(`#${tableItemIndex}`)[0].click();
      }
      , onKeyUp = () => {
        angular.element(`#${tableItemIndex}`)[0].click();
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
