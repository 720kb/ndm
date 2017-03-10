import angular from 'angular';
const moduleName = 'npm-ui.filters';

angular.module(moduleName, [])
.filter('removeHTML', () => {
  return string => {
    return string.replace(/<\/?[^>]+(>|$)/g, '');
  };
})
.filter('lastNameInPath', () => {
  return string => {
    let toReturn
      , split;

    if (string.includes('\\')) {
      //on windows
      split = string.split('\\');
      toReturn = split[split.length - 1];
    }

    if (string.includes('/')) {
      //on linux and mac
      split = string.split('/');
      toReturn = split[split.length - 1];
    }
    return toReturn ? toReturn : string;
  };
});

export default moduleName;
