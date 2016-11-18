/*global*/
import angular from 'angular';
const moduleName = 'npm-ui.ng-drag-drop';

angular.module(moduleName, [])
  .directive('ngDragDrop', /*@ngInject*/ function ngDragAndDrop($rootScope) {
    return (scope, element) => {
      element.on('drop', event => {
        event.preventDefault();
        element.removeClass('dragging');
        $rootScope.$emit('shell:file-drop', event);
      });
      element.on('dragover', event => {
        event.preventDefault();
        element.addClass('dragging');
      });
      element.on('dragend', event => {
        event.preventDefault();
        element.removeClass('dragging');
      });
    };
  });

export default moduleName;
