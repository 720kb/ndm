import angular from 'angular';
const moduleName = 'npm-ui.filters';

angular.module(moduleName, [])
.filter('removeHTML', () => {
  return string => {
    return string.replace(/<\/?[^>]+(>|$)/g, '');
  };
});

export default moduleName;
