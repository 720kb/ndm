/*global document window*/
import angular from 'angular';
const moduleName = 'npm-ui.ng-tag-input';

angular.module(moduleName, [])
.directive('ngTagInput', /*@ngInject*/ function ngTagInput($window, $log) {
  return {
    'require': '?ngModel',
    'link': (scope, element, attrs, ngModel) => {
      let documentRange
        , windowSelection
        , focusTheEnd = () => {
        element[0].focus();
        documentRange = document.createRange();
        documentRange.selectNodeContents(element[0].lastChild);
        documentRange.collapse(false);
        windowSelection = window.getSelection();
        windowSelection.removeAllRanges();
        windowSelection.addRange(documentRange);
      }
      , createTags = () => {
        try {
          let digits = element[0].innerText.split(' ')
            , tags = [];

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
              element.html(`${tags.join(' ')} <b>&nbsp;</b>`);
              focusTheEnd();
            }
          }
        } catch (excp) {
          $log.warn('ng-tag-input warning', excp);
        }
      }
      , onKeyUp = () => {
        if (element[0].innerText.trim().length > 0 &&
          ((event.keyCode && event.keyCode === 32) ||
          (event.which && event.which === 32))
        ) {
          createTags();
        }
      }
      , onKeyPress = () => {
        ngModel.$setViewValue(element[0].innerText);
      }
      , onPaste = () => {
        scope.$evalAsync(() => {
          createTags();
        });
      }
      , onTrigger = () => {
        focusTheEnd();
      };

      element.on('focus focusin mousedown click', onTrigger);
      element.on('paste', onPaste);
      element.on('keyup', onKeyUp);
      element.on('keypress', onKeyPress);

      scope.$on('$destroy', () => {
        element.unbind('keyup', onKeyUp);
        element.unbind('keypress', onKeyPress);
        element.unbind('focus focusin mousedown click', onTrigger);
        element.unbind('paste', onPaste);
      });
    }
  };
});

export default moduleName;
