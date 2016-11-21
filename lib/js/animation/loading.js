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
      }
      , freeze = () => {
        bodyElement.addClass('freezed');
      };

    return {
      loading,
      finished,
      freeze
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

          $scope.$apply(() => {
            this.nowDatetime = new Date();
            this.logs = [];
            this.logsFinished = undefined;
          });

          loadingFactory.loading();
          unregisterOnNpmLogs = $rootScope.$on('npm:log', manageNpmLogs);
        }
        , finished = () => {

          $scope.$apply(() => {

            this.logsFinished = true;
          });

          loadingFactory.finished();
          unregisterOnNpmLogs();
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
