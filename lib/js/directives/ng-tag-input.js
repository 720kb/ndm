/*global document window*/
import angular from 'angular';
const moduleName = 'npm-ui.ng-tag-input';

angular.module(moduleName, [])
.directive('ngTagInput', /*@ngInject*/ function ngTagInput($window, $log) {
  return {
  'require': '?ngModel',
  'link': (scope, element, attrs, ngModel) => {

      element.on('keyup', event => {

          try {
            let digits = element[0].innerText.split(' ')
            , tags = []
            , focusTheEnd = () => {
              element[0].focus();
              let range = document.createRange();
              range.selectNodeContents(element[0].lastChild);
              range.collapse(false);
              let sel = window.getSelection();
              sel.removeAllRanges();
              sel.addRange(range);
            };

            if (digits &&
              digits.length > 0) {

              digits.forEach(tag => {
                if (tag.trim().length > 0) {
                  tags.push(`<span>${tag}</span>`);
                }
              });
              element.html(`${tags.join('')}<b></b>`);
              focusTheEnd();
            }
          } catch (excp) {
            $log.warn('Ng-tag-input warning', excp);
          }
      });

      element.on('keypress', () => {
        ngModel.$setViewValue(element[0].innerText);
      });
    }
  };
});

export default moduleName;
