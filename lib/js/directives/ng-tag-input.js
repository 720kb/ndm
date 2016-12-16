/*global*/
import angular from 'angular';
const moduleName = 'npm-ui.ng-tag-input';

angular.module(moduleName, [])
.directive('ngTagInput', /*@ngInject*/ function ngTagInput($window, $log) {
  return {
  'require': '?ngModel',
  'link': (scope, element, attrs, ngModel) => {

      element.on('keyup', event => {

        if (event.keyCode === 32) {
          event.preventDefault();
          try {

            let digits = element[0].innerText.split(' ')
            , tags = [];

            if (digits.length > 0) {
              digits.forEach(tag => {
                tags.push(`<span>${tag}</span>`);
              });
              element.html(tags.join('') + '<b></b>');
            }
          } catch (excp) {
            $log.warn('Ng-tag-input warning', excp);
          }
        }
      });

      element.on('keypress', () => {
        ngModel.$setViewValue(element[0].innerText);
      });
    }
  };
});

export default moduleName;
