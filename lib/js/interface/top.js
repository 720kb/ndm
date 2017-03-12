/*global */
import angular from 'angular';
const moduleName = 'npm-ui.top-menu';

angular.module(moduleName, [])
.directive('topMenu', /*@ngInject*/ function TopMenuController($document, $rootScope, $log, $timeout, npm) {
  return (scope, element, attrs) => {

    let searchTimeout //debounce search
    , prevSearchKeyword;

    const topMenuIdentifierPath = attrs.topMenuProjectPathId;

    scope.destroyActiveClickedLink = () => {
      scope.activeLink = undefined;
    };

    scope.activeClickedLink = activeLink => {
      if ((activeLink === '1' || activeLink === '4') &&
        scope.activeLink === activeLink) {
        //toggle prompts show/hide
        scope.activeLink = false;
      } else {

        scope.activeLink = activeLink;
        $rootScope.$emit('top-bar:active-link', {
          'link': activeLink
        });
      }
    };

    scope.search = keyword => {
      $log.info('search', keyword);
      if (keyword &&
        keyword.trim() !== prevSearchKeyword) {
        /*eslint-disable*/
        if (searchTimeout) {
          $timeout.cancel(searchTimeout);
        }
        prevSearchKeyword = keyword;
        /*eslint-enable*/
        searchTimeout = $timeout(() => {
          scope.searchingNpm = true;
          scope.searchResults = [];
          npm.npmInFolder(topMenuIdentifierPath).then(npmInFolder => {
            npmInFolder.search(keyword).then(data => {
              scope.$apply(() => {
                scope.searchingNpm = false;
                scope.searchResults = data;
              });
            }).catch(err => {
              scope.$apply(() => {
                scope.searchingNpm = false;
                scope.searchResults = [];
              });
              $log.error('SEARCH ERROR', err);
            });
          });
        }, 500);
      } else {
        scope.searchingNpm = false;
        scope.searchResults = [];
      }
    };

    scope.searchChoosePackage = pkgName => {
      //update digits in input
      scope.$evalAsync(() => {
        scope.packageName[scope.packageName.length - 1].name = pkgName;
        scope.searchResults = [];
        $log.warn(pkgName, scope.packageName);
        //communicate to ng-tag-input to update itself and model
        $rootScope.$emit('top-menu:search-choosen-package', {'data': scope.packageName, 'tabPath': topMenuIdentifierPath});
      });
    };

    scope.hideInstallPrompt = () => {
      scope.showInstallPrompt = false;
    };

    scope.hideInstallVersionPrompt = () => {
      scope.showSpecificVersionPrompt = false;
    };
  };
});

export default moduleName;
