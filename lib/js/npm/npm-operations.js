/* global process,fetch */
const isGlobalSym = Symbol('isGlobal')
, npmSym = Symbol('npm')
, whereSym = Symbol('where')
, swapFolderAndGlobal = function SwapFolderAndGlobal(prefix, isGlobal) {

  const oldPrefix = this[npmSym].config.prefix
    , oldGlobal = this[npmSym].config.global;

  this[npmSym].config.prefix = prefix;
  this[npmSym].config.global = isGlobal;

  return [oldPrefix, oldGlobal];
};


class NpmOperations {

  constructor(where, configuredNpm, isGlobal) {

    this[whereSym] = where;
    this[npmSym] = configuredNpm;
    this[isGlobalSym] = isGlobal;
  }

  launchInstall() {

    return new Promise((resolveInstall, rejectInstall) => {
      this[npmSym].commands.install(this[whereSym], [], err => {
        if (err) {

          return rejectInstall(err);
        }

        return resolveInstall();
      });
    });
  }

  search(keyword) {

    return fetch(`https://registry.npmjs.org/-/v1/search?text=${keyword}&size=25`)
      .then(res => res.json());
  }

  run(scriptName) {
    return new Promise((resolveRun, rejectRun) => {
      this[npmSym].commands.runScript([scriptName], (err, infos) => {
        if (err) {

          return rejectRun(err);
        }

        return resolveRun(infos);
      });
    });
  }

  view(packageName) {
    return new Promise((resolveView, rejectView) => {

      this[npmSym].commands.view([packageName], (err, infos) => {
        if (err) {

          return rejectView(err);
        }

        return resolveView(infos);
      });
    });
  }

  build(folder) {

    return new Promise((resolveBuild, rejectBuild) => {

      this[npmSym].commands.build([folder], (err, infos) => {
        if (err) {

          return rejectBuild(err);
        }

        return resolveBuild(infos);
      });
    });
  }

  rebuild() {

    return new Promise((resolveRebuild, rejectRebuild) => {

      this[npmSym].commands.rebuild([], (err, infos) => {
        if (err) {
          return rejectRebuild(err);
        }
        return resolveRebuild(infos);
      });
    });
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

      this[npmSym].commands.install(this[whereSym], toInstall, err => {

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
      const [oldPrefix, oldGlobal] = swapFolderAndGlobal.apply(this, [this[whereSym], this[isGlobalSym]]);

      this[npmSym].commands.outdated([], true, (outdatedError, packageInformations) => {

        if (outdatedError) {

          this[npmSym].config.prefix = oldPrefix;
          this[npmSym].config.global = oldGlobal;
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

          this[npmSym].config.prefix = oldPrefix;
          this[npmSym].config.global = oldGlobal;
          return resolveOutdated(toResolve);
        }

        return rejectOutdated('Package informations from outdated are wrong!');
      });
    });
  }

  prune() {
    return new Promise((resolvePrune, rejectPrune) => {
      const oldCWD = process.cwd();

      process.chdir(this[whereSym]);
      this[npmSym].commands.prune([], (pruneError, packageInformations) => {

        process.chdir(oldCWD);
        if (pruneError) {

          return rejectPrune(pruneError);
        }

        return resolvePrune(packageInformations);
      });
    });
  }

  dedupe() {
    return new Promise((resolveDedupe, rejectDedupe) => {

      this[npmSym].commands.dedupe([], (DedupeError, packageInformations) => {

        if (DedupeError) {

          return rejectDedupe(DedupeError);
        }

        return resolveDedupe(packageInformations);
      });
    });
  }

  list() {
    return new Promise((resolveList, rejectList) => {
      const [oldPrefix, oldGlobal] = swapFolderAndGlobal.apply(this, [this[whereSym], this[isGlobalSym]]);

      this[npmSym].commands.list([], true, (listError, packageInformations) => {

        if (listError) {

          this[npmSym].config.prefix = oldPrefix;
          this[npmSym].config.global = oldGlobal;
          return rejectList(listError);
        }

        if (packageInformations &&
          packageInformations.dependencies &&
          packageInformations.devDependencies) {
          const toResolve = []
            , dependenciesKeys = Object.keys(packageInformations.dependencies)
            , dependenciesKeysLength = dependenciesKeys.length
            , devDependenciesKeys = Object.keys(packageInformations.devDependencies)
            , filteringFunction = function FilteringFunction(element) {

              return element && element.name !== packageInformations.dependencies[this];
            }
            , filterIsADevDependency = function filterIsADevDependency(aDependency, element) {

              return element && element === aDependency;
            };

          for (let dependenciesKeysIndex = 0; dependenciesKeysIndex < dependenciesKeysLength; dependenciesKeysIndex += 1) {
            const aDependencyKey = dependenciesKeys[dependenciesKeysIndex];

            if (aDependencyKey &&
              toResolve.every(filteringFunction, aDependencyKey)) {
              const aDependency = packageInformations.dependencies[aDependencyKey]
                , isADevDependency = devDependenciesKeys.filter(filterIsADevDependency.bind(devDependenciesKeys, aDependencyKey));

              toResolve.push({
                'name': aDependencyKey,
                'current': aDependency.version,
                'kind': isADevDependency[0] ? 'dev' : ''
              });
            }
          }

          this[npmSym].config.prefix = oldPrefix;
          this[npmSym].config.global = oldGlobal;
          return resolveList(toResolve);
        }

        return rejectList('Package informations from list command are wrong!');
      });
    });
  }

  shrinkwrap() {
    return new Promise((resolveShrink, rejectShrink) => {

      this[npmSym].commands.shrinkwrap([], (shrinkError, infos) => {

        if (shrinkError) {

          return rejectShrink(shrinkError);
        }

        return resolveShrink(infos);
      });
    });
  }

  doctor() {
    return new Promise((resolveDoctor, rejectDoctor) => {

      this[npmSym].commands.doctor((doctorErr, doctorInfo) => {

        if (doctorErr) {

          return rejectDoctor(doctorErr);
        }

        return resolveDoctor(doctorInfo);
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
