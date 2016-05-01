import angular from 'angular';
const moduleName = 'npm-ui.loading';

angular.module(moduleName, [])
  .directive('npmLoading', /*@ngInject*/ ($rootScope, $document) => {

    return {
      'scope': true,
      'restrict': 'A',
      'templateUrl': 'logs-prompt.html',
      'controller': /*@ngInject*/ function NpmLoadingController($scope) {
        let unregisterOnNpmLogs;
        const bodyElement = $document.find('body')
          , manageNpmLogs = (eventInfos, payload) => {

            if (payload) {

              $rootScope.$apply(() => {

                $scope.log.logs.push(payload);
              });
            }
          }
          , loading = () => {

            this.logs = [];
            unregisterOnNpmLogs = $rootScope.$on('npm:log', manageNpmLogs);
            bodyElement.addClass('loading');
          }
          , finished = () => {

            unregisterOnNpmLogs();
            bodyElement.removeClass('loading');
          }
          , unregisterOnStart = $rootScope.$on('npm:log:start', loading)
          , unregisterOnStop = $rootScope.$on('npm:log:stop', finished);

        this.logs = [];

        $scope.$on('$destroy', () => {

          unregisterOnStart();
          unregisterOnStop();
        });
      },
      'controllerAs': 'log'
    };
  });

export default moduleName;
