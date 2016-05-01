import angular from 'angular';
const moduleName = 'npm-ui.loading';

angular.module(moduleName, [])
  .service('loadingFactory', /*@ngInject*/ $document => {

    const bodyElement = $document.find('body')
      , loading = () => {
        bodyElement.addClass('loading');
      }
      , finished = () => {
        bodyElement.removeClass('loading');
      };

    return {
      'loading': loading,
      'finished': finished
    };
  })
  .directive('npmLoading', /*@ngInject*/ ($rootScope, loadingFactory) => {

    return {
      'scope': true,
      'restrict': 'A',
      'templateUrl': 'logs-prompt.html',
      'controller': /*@ngInject*/ function NpmLoadingController($scope) {
        let unregisterOnNpmLogs;

        const manageNpmLogs = (eventInfos, payload) => {
          if (payload) {

            $rootScope.$apply(() => {

              $scope.log.logs.push(payload);
            });
          }
        }
        , loading = () => {

          this.nowDatetime = new Date();
          this.logs = [];
          this.logsFinished = undefined;
          unregisterOnNpmLogs = $rootScope.$on('npm:log', manageNpmLogs);
          loadingFactory.loading();
        }
        , finished = () => {

          unregisterOnNpmLogs();
          this.logsFinished = true;
          loadingFactory.removeClass('loading');
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
