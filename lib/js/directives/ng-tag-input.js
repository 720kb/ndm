/*global document window*/
import angular from 'angular';
const moduleName = 'npm-ui.ng-tag-input';

angular.module(moduleName, [])
.directive('ngTagInput', /*@ngInject*/ function ngTagInput($window, $log) {
  return {
  'require': '?ngModel',
  'link': (scope, element, attrs, ngModel) => {

      element.on('keyup', () => {
        try {
          if (element[0].innerText.trim().length > 0) {
          let digits = element[0].innerText.split(' ')
            , documentRange
            , windowSelection
            , tags = []
            , focusTheEnd = () => {
              element[0].focus();
              documentRange = document.createRange();
              documentRange.selectNodeContents(element[0].lastChild);
              documentRange.collapse(false);
              windowSelection = window.getSelection();
              windowSelection.removeAllRanges();
              windowSelection.addRange(documentRange);
            };
          if (digits &&
            digits.length > 0) {
            digits.forEach(tag => {
              if (tag.trim().length > 0) {
                tags.push(`<span>${tag}</span>`);
              } else {
                tags.push(tag);
              }
            });
            if (tags &&
              tags.length > 0) {
              element.html(`${tags.join(' ')} <b></b>`);
              focusTheEnd();
            }
          }
        }
        } catch (excp) {
          $log.warn('ng-tag-input warning', excp);
        }
      });

      element.on('keypress', () => {
        ngModel.$setViewValue(element[0].innerText);
      });
    }
  };
});

export default moduleName;
