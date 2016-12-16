/*global*/
import angular from 'angular';
const moduleName = 'npm-ui.ng-tag-input';

angular.module(moduleName, [])
.directive('ngTagInput', /*@ngInject*/ function ngTagInput($log) {
  return {
  'require': '?ngModel',
  'link': (scope, element, attrs, ngModel) => {

      element.on('keyup', () => {
        try {
          let digits = element[0].innerText.split(' ')
            , tags = [];
          if (digits.length > 0) {
            digits.forEach(tag => {
              tags.push(`<span>${tag}</span>`);
            });
            element[0].innerHTML = tags.join(' ');
          }
        } catch (excp) {

          $log.warn('Ng-tag-input warning', excp);
        }
      });

      element.on('keypress', () => {
        ngModel.$setViewValue(element.text);
      });
    }
  };
});

export default moduleName;
