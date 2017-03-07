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
  .directive('npmLoading', /*@ngInject*/ ($rootScope, loadingFactory) => {

    return {
      'scope': true,
      'restrict': 'A',
      'templateUrl': 'npm-update-log.html',
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
