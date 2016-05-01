import angular from 'angular';
const moduleName = 'npm-ui.loading';

angular.module(moduleName, [])
  .directive('npmLoading', /*@ngInject*/ ($rootScope, $document, $timeout) => {

    return {
      'scope': {},
      'restrict': 'A',
      'controller': /*@ngInject*/ function NpmLoadingController() {

        this.logs = [];
        this.loading = () => {

        };

        this.finished = () => {

        };
      },
      'controllerAs': 'log',
      'link': scope => {

        const bodyElement = $document.find('body')
          , manageNpmLogs = (eventInfos, payload) => {

            if (payload) {

              bodyElement.addClass('loading');
              scope.log.logs.push(payload);
              $timeout(() => {

                bodyElement.removeClass('loading');
              });
            }
          }
          , unregisterOnNpmLogs = $rootScope.$on('npm:log', manageNpmLogs);

        scope.$on('$destroy', () => {

          unregisterOnNpmLogs();
        });
      }
    };
  });

export default moduleName;
