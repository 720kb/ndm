/*global*/
import angular from 'angular';
const moduleName = 'npm-ui.ng-table-keyboard';

angular.module(moduleName, [])
  .directive('ngTableKeyboard', /*@ngInject*/ function ngTableKeyboard($window, $document) {
    return (scope, element) => {

    const onArrowDown = () => {
        let tableRows = element[0].querySelectorAll('.table-row:not(.disabled)')
          , clickedElement;

        if (tableRows && tableRows.length > 0) {
          tableRows.forEach((row, index) => {
            if (angular.element(row).hasClass('selected')) {
              if (!clickedElement) {
                if (tableRows[index + 1]) {
                  clickedElement = true;
                  angular.element(tableRows[index + 1]).triggerHandler('click');
                }
              }
            }
          });
          if (!clickedElement) {
            angular.element(tableRows[0]).triggerHandler('click');
          }
        }
      }
      , onArrowUp = () => {
        let tableRows = element[0].querySelectorAll('.table-row:not(.disabled)')
          , clickedElement;

        if (tableRows && tableRows.length > 0) {
          tableRows.forEach((row, index) => {
            if (angular.element(row).hasClass('selected')) {
              if (!clickedElement) {
                if (tableRows[index - 1]) {
                  clickedElement = true;
                  angular.element(tableRows[index - 1]).triggerHandler('click');
                  return false;
                }
              }
            }
          });
          if (!clickedElement) {
            angular.element(tableRows[0]).triggerHandler('click');
          }
        }
      }
      , bindOnKey = event => {
        //if not loading
        if (!angular.element($document[0].body).hasClass('loading')) {
          if (event &&
            event.keyCode) {
            if (event.keyCode === 40) {
              onArrowDown();
            }
            if (event.keyCode === 38) {
              onArrowUp();
            }
          }
        }
      };

      angular.element($window).bind('keydown', bindOnKey);
      scope.$on('destroy', () => {
          angular.element($window).unbind('keydown', bindOnKey);
      });
    };
  });

export default moduleName;
