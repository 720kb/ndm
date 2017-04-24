/*global require,process,Buffer*/
import NpmOperations from './npm-operations.js';

const npm = require('npm')
  , stream = require('stream')
  , writable = new stream.Writable({
    'write': (chunk, encoding, next) => {
      const thisLogBuffer = new Buffer(chunk)
        , thisLog = thisLogBuffer
          .toString()
          .trim();

      if (thisLog) {

        process.stdout.write(JSON.stringify({
          'type': 'log',
          'payload': thisLog
        }));
      }

      next();
    }
  })
  , npmDefaultConfiguration = {
    'loglevel': 'info',
    'progress': false,
    'logstream': writable
  }
  , exec = (folder, isGlobal, command, param1, param2) => {

    if (!npm.config.loaded) {

      return npm.load(Object.assign({}, npmDefaultConfiguration), (err, configuredNpm) => {
        if (err) {

          process.stderr.write(err);
        }

        const npmOperations = new NpmOperations(folder, configuredNpm, isGlobal);

        npmOperations[command](param1, param2).then(resolved => process.stdout.write(JSON.stringify({
          'type': 'command',
          command,
          'payload': resolved
        })));
      });
    }
    const npmOperations = new NpmOperations(folder, npm, isGlobal);

    npmOperations[command]().then(resolved => process.stdout.write({
      'type': 'command',
      command,
      'payload': resolved
    }));
  };

exec(process.argv[2],
  (process.argv[3] /*eslint-disable eqeqeq*/==/*eslint-enable eqeqeq*/ 'true'),
  process.argv[4],
  process.argv[5],
  process.argv[6]);
