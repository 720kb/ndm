const isGlobalSym = Symbol('isGlobal')
, npmSym = Symbol('npm');

class NpmOperations {

  constructor(configuredNpm, isGlobal) {

    this[npmSym] = configuredNpm;
    this[isGlobalSym] = isGlobal;
  }

  install(dependency, version) {
    let dependencyToSubmit = dependency.name;

    if (version) {

      dependencyToSubmit += `@${version}`;
    }

    return new Promise((resolveInstall, rejectInstall) => {
      const toInstall = [dependencyToSubmit];

      if (!this[isGlobalSym] &&
        dependency.kind === 'dev') {

        this[npmSym].config.set('save-dev', true);
      } else if (!this[isGlobalSym]) {

        this[npmSym].config.set('save', true);
      }

      this[npmSym].commands.install(toInstall, err => {

        if (err) {

          return rejectInstall(err);
        }

        if (!this[isGlobalSym]) {

          this[npmSym].config.set('save-dev', false);
          this[npmSym].config.set('save', false);
        }
        return resolveInstall();
      });
    });
  }

  installLatest(dependency) {

    return this.install(dependency, dependency.latest);
  }

  update(dependency) {

    return new Promise((resolveUpdate, rejectUpdate) => {
      const toUpdate = [dependency.name];

      if (!this[isGlobalSym] &&
        dependency.kind === 'dev') {

        this[npmSym].config.set('save-dev', true);
      } else if (!this[isGlobalSym]) {

        this[npmSym].config.set('save', true);
      }

      this[npmSym].commands.update(toUpdate, err => {

        if (err) {

          return rejectUpdate(err);
        }

        if (!this[isGlobalSym]) {

          this[npmSym].config.set('save-dev', false);
          this[npmSym].config.set('save', false);
        }
        return resolveUpdate();
      });
    });
  }

  rm(dependency) {

    return new Promise((resolveRm, rejectRm) => {
      const toRemove = [dependency.name];

      if (!this[isGlobalSym] &&
        dependency.kind === 'dev') {

        this[npmSym].config.set('save-dev', true);
      } else if (!this[isGlobalSym]) {

        this[npmSym].config.set('save', true);
      }

      this[npmSym].commands.rm(toRemove, err => {

        if (err) {

          return rejectRm(err);
        }

        if (!this[isGlobalSym]) {

          this[npmSym].config.set('save-dev', false);
          this[npmSym].config.set('save', false);
        }
        return resolveRm();
      });
    });
  }

  listOutdated() {
    return new Promise((listOutdatedResolve, listOutdatedReject) => {

      Promise.all([this.list(), this.outdated()])
        .then(resolved => {

          if (resolved &&
            Array.isArray(resolved) &&
            resolved.length === 2) {
            const outdatedList = resolved[1]
              , listList = resolved[0];
            let toResolve = [];

            listList.forEach(element => {

              if (element &&
                element.name) {
                const outdatedData = outdatedList.filter(filterElement => {
                  return filterElement && filterElement.name === element.name;
                }).map(mapElement => ({
                  'name': element.name,
                  'kind': element.kind,
                  'current': mapElement.current,
                  'wanted': mapElement.wanted,
                  'latest': mapElement.latest
                }));

                if (outdatedData.length > 0) {

                  toResolve = toResolve.concat(outdatedData);
                } else {

                  toResolve.push(element);
                }
              }
            });

            return listOutdatedResolve(toResolve);
          }

          return listOutdatedReject('Output from list and oudated commands wrong!');
        })
        .catch(err => listOutdatedReject(err));
    });
  }

  outdated() {
    return new Promise((resolveOutdated, rejectOutdated) => {

      this[npmSym].commands.outdated([], true, (outdatedError, packageInformations) => {

        if (outdatedError) {

          return rejectOutdated(outdatedError);
        }

        if (packageInformations &&
          Array.isArray(packageInformations)) {
          const toResolve = [];

          for (const aPackageInformation of packageInformations) {

            toResolve.push({
              'name': aPackageInformation[1],
              'current': aPackageInformation[2],
              'wanted': aPackageInformation[3],
              'latest': aPackageInformation[4]
            });
          }
          return resolveOutdated(toResolve);
        }

        return rejectOutdated('Package informations from outdated are wrong!');
      });
    });
  }

  list() {
    return new Promise((resolveList, rejectList) => {

      this[npmSym].commands.list([], true, (listError, packageInformations) => {

        if (listError) {

          return rejectList(listError);
        }

        if (packageInformations &&
          packageInformations.dependencies &&
          packageInformations.devDependencies) {
          const toResolve = []
            , dependenciesKeys = Object.keys(packageInformations.dependencies)
            , dependenciesKeysLength = dependenciesKeys.length
            , devDependenciesKeys = Object.keys(packageInformations.devDependencies)
            , devDependenciesKeysLength = devDependenciesKeys.length;

          for (let dependenciesKeysIndex = 0; dependenciesKeysIndex < dependenciesKeysLength; dependenciesKeysIndex += 1) {
            const aDependencyKey = dependenciesKeys[dependenciesKeysIndex];

            if (aDependencyKey) {
              const aDependency = packageInformations.dependencies[aDependencyKey];

              toResolve.push({
                'name': aDependencyKey,
                'current': aDependency.version,
                'kind': ''
              });
            }
          }

          for (let devDependencyKeysIndex = 0; devDependencyKeysIndex < devDependenciesKeysLength; devDependencyKeysIndex += 1) {
            const aDevDependencyKey = devDependenciesKeys[devDependencyKeysIndex];

            if (aDevDependencyKey) {
              const aDevDependency = packageInformations.devDependencies[aDevDependencyKey];

              toResolve.push({
                'name': aDevDependencyKey,
                'current': aDevDependency,
                'kind': 'dev'
              });
            }
          }

          return resolveList(toResolve);
        }

        return rejectList('Package informations from list command are wrong!');
      });
    });
  }

  root() {
    return new Promise((resolveRoot, rejectRoot) => {

      this[npmSym].commands.root([], (rootError, rootInfo) => {

        if (rootError) {

          return rejectRoot(rootError);
        }

        return resolveRoot(rootInfo);
      });
    });
  }
}

export default NpmOperations;
