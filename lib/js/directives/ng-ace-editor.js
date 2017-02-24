/*global require window*/
import angular from 'angular';
const moduleName = 'npm-ui.ng-ace-editor'
  , fs = require('fs')
  , ace = window.ace;

angular.module(moduleName, [])
.directive('ngAceEditor', /*@ngInject*/ function ngAceEditor($rootScope, $document) {
  return {
    'require': '?ngModel',
    'link': (scope, element, attrs, ngModel) => {

      const editorElement = element[0].querySelector('.ng-ace-editor')
      , aceEditor = ace.edit(editorElement)
      , aceSession = aceEditor.getSession()
      , theme = attrs.ngAceEditorTheme
      , readonly = scope.$eval(attrs.ngAceEditorReadonly)
      , setAceMode = () => {
        if (attrs.ngAceFileName.endsWith('.json')) {

          aceSession.setMode('ace/mode/json');
        } else if (attrs.ngAceFileName.startsWith('.')) {
          aceSession.setMode('ace/mode/text');
        }
      }
      , fileEmptyContent = attrs.ngAceFileName.endsWith('.json') ? '{}' : ''
      , unregisterSavedFile = $rootScope.$on('ace-editor:saved-file', () => {
          scope.$evalAsync(() => {
            scope.savingFile = false;
            scope.savedFile = true;
          });
        })
        , unregisterSavingFile = $rootScope.$on('ace-editor:saving-file', () => {
          scope.$evalAsync(() => {
            scope.savingFile = true;
            scope.savedFile = false;
          });
        })
        , unregisterLoadedFile = $rootScope.$on('ace-editor:loaded-file', () => {
          scope.$evalAsync(() => {
            scope.loadingFile = false;
          });
        })
        , unregisterLoadingFile = $rootScope.$on('ace-editor:loading-file', () => {
          scope.$evalAsync(() => {
            scope.loadingFile = true;
            scope.savedFile = false;
            scope.savingFile = false;
            setAceMode();
          });
        });

      attrs.$observe('ngAceFile', filePath => {
        if (filePath) {
          $rootScope.$emit('ace-editor:loading-file', {
            'path': filePath
          });
          try {
            if (fs.existsSync(filePath)) {
              scope.aceFileModel = fs.readFileSync(filePath).toString();
            } else {
              scope.aceFileModel = fileEmptyContent;
            }
          } catch (e) {
            scope.aceFileModel = fileEmptyContent;
          }

          $rootScope.$emit('ace-editor:loaded-file', {
            'path': filePath,
            'content': scope.aceFileModel
          });
        }
      });

      attrs.$observe('ngAceSource', source => {
        if (source) {
          scope.aceFileModel = source;
        } else {
          scope.aceFileModel = fileEmptyContent;
        }
      });

      scope.saveFile = () => {
        $rootScope.$emit('ace-editor:saving-file', {
          'path': attrs.ngAceFile,
          'content': scope.aceFileModel
        });
        fs.writeFileSync(attrs.ngAceFile, scope.aceFileModel, {'flag': 'w'}, 'utf8');
        $rootScope.$emit('ace-editor:saved-file', {
          'path': attrs.ngAceFile,
          'content': scope.aceFileModel
        });
      };

      scope.$watch(() => {
        return [editorElement.offsetWidth, editorElement.offsetHeight];
      }, () => {
        aceEditor.resize();
        aceEditor.setOptions({
          'showInvisibles': true,
          'cursorStyle': 'smooth',
          'highlightSelectedWord': true,
          'theme': `ace/theme/${theme}`,
          'readOnly': readonly
        });
        aceEditor.renderer.updateFull();
      }, true);

      aceSession.on('change', () => {
        if (aceSession.getValue()) {
          ngModel.$setViewValue(aceSession.getValue());
        }
      });

      ngModel.$render = () => {
        if (ngModel.$viewValue) {
          aceSession.setValue(ngModel.$viewValue);
        }
      };

      $document.on('mousedown mouseup mouseover', () => {
        aceEditor.resize();
      });

      element.on('$destroy', () => {
        aceSession.$stopWorker();
        aceEditor.destroy();
        unregisterSavingFile();
        unregisterSavedFile();
        unregisterLoadingFile();
        unregisterLoadedFile();
      });
    }
  };
});

export default moduleName;
