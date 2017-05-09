import angular from 'angular';
const moduleName = 'npm-ui.loading';

angular.module(moduleName, [])
  .service('loadingFactory', /*@ngInject*/ function loadingFactory($document) {

    const bodyElement = $document.find('body')
      , appReady = () => {
        bodyElement.addClass('ready');
      }
      , loading = () => {
      //  bodyElement.addClass('loading');
      }
      , finished = () => {
        bodyElement.removeClass('loading');
      }
      , freeze = () => {
        bodyElement.addClass('freezed');
      }
      , unfreeze = () => {
        bodyElement.removeClass('freezed');
      };

    return {
      loading,
      finished,
      freeze,
      unfreeze,
      appReady
    };
  })
  .directive('npmLoading', /*@ngInject*/ $rootScope => {

    return {
      'scope': true,
      'restrict': 'A',
      'templateUrl': 'npm-update-log.html',
      'controller': /*@ngInject*/ function NpmLoadingController($scope) {

        const unregisterOnNpmLogsEnd = $rootScope.$on('npm:log:end', (eventInfo, npmLogEnd) => {
            if (npmLogEnd.type === 'installLatest') {
              $scope.$evalAsync(() => {
                this.logsFinished = true;
              });
            }
          })
          , unregisterOnNpmLogs = $rootScope.$on('npm:log:log', (eventInfo, npmLog) => {
            $rootScope.$apply(() => {
              if (npmLog.type === 'installLatest' &&
                npmLog.data) {
                $scope.log.logs.push(npmLog.data);
              }
            });
          });

        this.logs = [];

        $scope.$on('$destroy', () => {
          unregisterOnNpmLogs();
          unregisterOnNpmLogsEnd();
        });
      },
      'controllerAs': 'log'
    };
  });

export default moduleName;
