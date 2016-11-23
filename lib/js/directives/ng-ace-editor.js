/*global require window*/
import angular from 'angular';
const moduleName = 'npm-ui.ng-ace-editor'
  , fs = require('fs')
  , jsonlint = require('json-lint')
  , ace = window.ace;

angular.module(moduleName, [])
.directive('ngAceEditor', /*@ngInject*/ function ngAceEditor($rootScope) {
  return {
    'require': '?ngModel',
    'link': (scope, element, attrs, ngModel) => {

      const unregisterSavedFile = $rootScope.$on('ace-editor:saved-file', () => {
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
          });
        })
        , editorElement = element[0].querySelector('.ng-ace-editor')
        , aceEditor = ace.edit(editorElement)
        , aceSession = aceEditor.getSession()
        , mode = scope.$eval(attrs.ngAceEditorMode);

      if (mode) {
        aceSession.setMode(`ace/mode/${mode}`);
      }

      attrs.$observe('ngAceFile', filePath => {
        $rootScope.$emit('ace-editor:loading-file', {
          'path': filePath
        });
        try {
          if (fs.existsSync(filePath)) {
            scope.aceFileModel = fs.readFileSync(filePath).toString();
          } else {
            scope.aceFileModel = '{}';
          }
        } catch (e) {
          scope.aceFileModel = '{}';
        }
        $rootScope.$emit('ace-editor:loaded-file', {
          'path': filePath,
          'content': scope.aceFileModel
        });
      });

      scope.lintJSON = () => {
        let theJSON = scope.aceFileModel
        scope.lintedJSON = jsonlint(theJSON);
        console.log('linted json', scope.lintedJSON);
      };

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
        aceEditor.renderer.updateFull();
      }, true);

      aceSession.on('change', () => {
        ngModel.$setViewValue(aceSession.getValue());
      });

      ngModel.$render = () => {
        aceSession.setValue(ngModel.$viewValue);
      };

      element.on('$destroy', () => {
        aceEditor.aceSession.$stopWorker();
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
