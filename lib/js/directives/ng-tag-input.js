/*global document window*/
import angular from 'angular';
const moduleName = 'npm-ui.ng-tag-input';

angular.module(moduleName, [])
.directive('ngTagInput', /*@ngInject*/ function ngTagInput($log) {
  return {
    'require': '?ngModel',
    'link': (scope, element, attrs, ngModel) => {
      let documentRange
        , windowSelection
        , focusTheEnd = () => {
          try {
            element[0].focus();
            documentRange = document.createRange();
            documentRange.selectNodeContents(element[0].lastChild);
            documentRange.collapse(false);
            windowSelection = window.getSelection();
            windowSelection.removeAllRanges();
            windowSelection.addRange(documentRange);
          } catch (excp) {
            $log.warn('ng-tag-input warning when setting focus', excp);
          }
        }
        , createTags = () => {
          try {
            let digits = element[0].innerText.split(' ')
              , tags = [];

            if (digits &&
              digits.length > 0) {
              digits.forEach(tag => {
                if (tag.trim().length > 0) {
                  tags.push(`<span>${tag.trim()}</span>`);
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
        , updateModel = () => {

          let packages = element[0].innerText.trim().split(' ')
            , modelValue = []
            , pkgName
            , pkgVersion;

          packages.forEach(item => {
            if (item.trim() &&
              item.trim().length > 0) {

              if (item.includes('@')) {
                pkgName = item.split('@')[0].replace('@', '').trim();
                pkgVersion = item.split('@')[1].replace('@', '').trim();
              } else {
                pkgName = item.trim();
                pkgVersion = false;
              }
              modelValue.push({
                'name': pkgName,
                'version': pkgVersion
              });
            }
          });
          ngModel.$setViewValue(modelValue);
        }
        , onBlur = () => {
          updateModel();
        }
        , onKeyUp = event => {
          updateModel();
          if (element[0].innerText.trim().length > 0 &&
            ((event.keyCode && event.keyCode === 32) ||
            (event.which && event.which === 32))
          ) {
            createTags();
            updateModel();
          }
        }
        , onKeyDown = event => {
          updateModel();
          if (event &&
            event.keyCode &&
            event.keyCode.toString() === '13' &&
            element[0].innerText.trim().length > 0) { //enter key to submit form
            try {
              createTags();
              updateModel();
              //find button to submit form
              angular.element(document.querySelector('#install-new-packages-button'))[0].click();
            } catch (excp) {
              $log.warn('Cannot find form to submit', excp);
            }
          }
        }
        , onKeyPress = () => {
          updateModel();
        }
        , onPaste = () => {
          scope.$evalAsync(() => {
            createTags();
            updateModel();
          });
        }
        , onTrigger = () => {
          focusTheEnd();
        }
        , onKeypressDisabled = event => {
          return event.preventDefault();
        };

      element.on('mousedown', onTrigger);
      element.on('click', onTrigger);
      element.on('paste', onPaste);
      element.on('blur', onBlur);
      element.on('keyup', onKeyUp);
      element.on('keydown', onKeyDown);
      element.on('keypress', onKeyPress);
      //disable input on submit
      attrs.$observe('disabled', value => {
        if (value === 'disabled') {
          element.on('keypress', onKeypressDisabled);
        } else {
          element.unbind('keypress', onKeypressDisabled);
        }
      });
      scope.$on('$destroy', () => {
        element.unbind('keyup', onKeyUp);
        element.unbind('keydown', onKeyDown);
        element.unbind('paste', onPaste);
        element.unbind('mousedown', onTrigger);
        element.unbind('click', onTrigger);
        element.unbind('keypress', onKeyPress);
        element.unbind('blur', onBlur);
        element.unbind('keypress', onKeypressDisabled);
      });
    }
  };
});

export default moduleName;
