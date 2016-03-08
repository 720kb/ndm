var Node = {
  child: require('child_process'),
  crypto: require('crypto'),
  fs: require('fs'),
  os: require('os'),
  path: require('path'),
  process: process,
  util: require('util')
};

function attempt(attempts, command, options, end) {
  if (typeof attempts !== 'number' || Math.floor(attempts) !== attempts || attempts < 0) {
    return end(new Error('Attempts argument should be a positive integer.'));
  }

  var processOptions = {}
  var env = []
  var on = function() {};

  if (options.process) {
      if (options.process.on && typeof options.process.on == 'function') {
        on = options.process.on;
      }
      var processOptions = options.process.options || {};
      // Prepare subprocess environment variables (OSx, Linux) if required
      if (processOptions) {
        if (processOptions.env && typeof processOptions.env == 'object') {
          for (var key in processOptions.env) {
            env.push(key.concat('=', processOptions.env[key]));
          }
        }
      }
  }

  // Prepare sudo command for current platform
  switch (Node.process.platform) {
    // For Windows use VBS script for elevating rights, if user already has needed privileges
    // UAC password prompt not displayed
    case 'win32':
      var sudoCmd = [
          encloseDoubleQuotes(Node.path.join(
            Node.path.dirname(module.filename), Node.process.platform, 'sudo.cmd'
          )),
          encloseDoubleQuotes(command)
        ].join(' ');
      break
    // For OSx and Linux the -n (non-interactive) option prevents sudo from prompting the user for
    // a password. If a password is required for the command to run, sudo will
    // display an error message and exit.
    case 'darwin':
    case 'linux':
      var sudoCmd = ['/usr/bin/sudo -n', env.join(' '), '-s', command].join(' ');
      break
  }

  on(Node.child.exec(sudoCmd, processOptions, function(error, stdout, stderr) {
      if (/sudo: a password is required/i.test(stderr)) {
        if (attempts > 0) return end(new Error('User did not grant permission.'));
        if (Node.process.platform === 'linux') {
          // Linux will probably use TTY tickets for sudo timestamps.
          // If so, we cannot easily extend the sudo timestamp for the user.
          // We prefer this since a single prompt can be used for multiple calls.
          // Instead, we have to use a separate prompt for each call.
          return linux(command, options, end);
        }
        prompt(options,
          function(error) {
            if (error) return end(error);
            attempt(++attempts, command, options, end); // Cannot use ++ suffix here.
          }
        );
      } else if (!error && /^sudo:/i.test(stderr)) {
        end(new Error('Unexpected stderr from sudo command without corresponding error: ' + stderr));
      } else {
        end(error, stdout, stderr);
      }
    }
  ));
}

function copy(source, target, end) {
  source = escapeDoubleQuotes(Node.path.normalize(source));
  target = escapeDoubleQuotes(Node.path.normalize(target));
  var command = '/bin/cp -R -p "' + source + '" "' + target + '"';
  Node.child.exec(command, end);
}

function escapeDoubleQuotes(string) {
  return string.replace(/"/g, '\\"');
}

function encloseDoubleQuotes(string) {
  return string.replace(/(.+)/g, '"$1"');
}

function exec() {
  if (arguments.length < 1 || arguments.length > 3) {
    throw new Error('Wrong number of arguments.');
  }
  var command = arguments[0];
  var options = {};
  var end = function() {};
  if (typeof command !== 'string') {
    throw new Error('Command should be a string.');
  }
  if (arguments.length === 2) {
    if (Node.util.isObject(arguments[1])) {
      options = arguments[1];
    } else if (Node.util.isFunction(arguments[1])) {
      end = arguments[1];
    } else {
      throw new Error('Expected options or callback.');
    }
  } else if (arguments.length === 3) {
    if (Node.util.isObject(arguments[1])) {
      options = arguments[1];
    } else {
      throw new Error('Expected options to be an object.');
    }
    if (Node.util.isFunction(arguments[2])) {
      end = arguments[2];
    } else {
      throw new Error('Expected callback to be a function.');
    }
  }
  if (/^sudo/i.test(command)) {
    return end(new Error('Command should not contain "sudo".'));
  }
  if (typeof options.name === 'undefined') {
    if (typeof name === 'string') {
      // If name is a string, it has been set and verified by setName.
      options.name = name;
    } else {
      var title = Node.process.title;
      if (validName(title)) {
        options.name = title;
      } else {
        return end(new Error('options.name must be provided (process.title is not valid).'));
      }
    }
  } else if (!validName(options.name)) {
    return end(new Error('options.name must be alphanumeric only (spaces are allowed).'));
  }
  if (typeof options.icns !== 'undefined') {
    if (typeof options.icns !== 'string') {
      return end(new Error('options.icns must be a string if provided.'));
    } else if (options.icns.trim().length === 0) {
      return end(new Error('options.icns must be a non-empty string if provided.'));
    }
  }
  if (['win32', 'darwin', 'linux'].indexOf(Node.process.platform) == -1) {
    return end(new Error('Platform not yet supported.'));
  }
  attempt(0, command, options, end);
}

function linux(command, options, end) {
  linuxBinary(
    function(error, binary) {
      if (error) { binary = Node.path.join(Node.process.platform, 'gksudo')};
      linuxExecute(binary, command, options, end);
    }
  );
}

function linuxBinary(end) {
  var index = 0;
  // We prefer gksudo over pkexec since it gives a nicer prompt:
  var paths = ['/usr/bin/pkexec', '/usr/bin/kdesudo', '/usr/bin/gksudo'];
  function test() {
    if (index === paths.length) {
      return end(new Error('Unable to find gksudo, pkexec or kdesudo.'));
    }
    var path = paths[index++];
    Node.fs.stat(path,
      function(error) {
        if (error) {
          if (error.code === 'ENOTDIR' || error.code === 'ENOENT') {
            return test();
          } else {
            return end(error);
          }
        } else {
          end(undefined, path);
        }
      }
    );
  }
  test();
}

function linuxExecute(binary, command, options, end) {
  var string = '';
  string += '"' + escapeDoubleQuotes(binary) + '" ';
  if (/gksudo/i.test(binary)) {
    string += '--preserve-env ';
    string += '--sudo-mode ';
    string += '--description="' + escapeDoubleQuotes(options.name) + '" ';
  } else if (/pkexec/i.test(binary)) {
    string += '--disable-internal-agent ';
  }
  string += command;
  Node.child.exec(string,
    function(error, stdout, stderr) {
      if (error && /Request dismissed|Command failed/i.test(error)) {
        error = new Error('User did not grant permission.');
      }
      end(error, stdout, stderr);
    }
  );
}

function macIcon(target, options, end) {
  if (!options.icns) return end();
  copy(options.icns, Node.path.join(target, 'Contents', 'Resources', 'applet.icns'), end);
}

function macOpen(target, options, end) {
  target = escapeDoubleQuotes(Node.path.normalize(target));
  var command = 'open -n -W "' + target + '"';
  Node.child.exec(command, end);
}

function macPrompt(hash, options, callback) {
  var temp = Node.os.tmpdir();
  if (!temp) return callback(new Error('Requires os.tmpdir() to be defined.'));
  if (!Node.process.env.USER) return callback(new Error('Requires env[\'USER\'] to be defined.'));
  var source = Node.path.join(Node.path.dirname(module.filename), Node.process.platform, 'applet.app');
  var target = Node.path.join(temp, hash, options.name + '.app');
  function end(error) {
    remove(Node.path.dirname(target),
      function(errorRemove) {
        if (error) return callback(error);
        if (errorRemove) return callback(errorRemove);
        callback();
      }
    );
  }
  Node.fs.mkdir(Node.path.dirname(target),
    function(error) {
      if (error && error.code === 'EEXIST') error = undefined;
      if (error) return end(error);
      copy(source, target,
        function(error) {
          if (error) return end(error);
          macIcon(target, options,
            function(error) {
              if (error) return end(error);
              macPropertyList(target, options,
                function(error) {
                  if (error) return end(error);
                  macOpen(target, options, end);
                }
              );
            }
          );
        }
      );
    }
  );
}

function macPropertyList(target, options, end) {
  // Value must be in single quotes (not double quotes) according to man entry.
  // e.g. defaults write com.companyname.appname "Default Color" '(255, 0, 0)'
  // The defaults command will be changed in an upcoming major release to only
  // operate on preferences domains. General plist manipulation utilities will
  // be folded into a different command-line program.
  var path = escapeDoubleQuotes(Node.path.join(target, 'Contents', 'Info.plist'));
  var key = escapeDoubleQuotes('CFBundleName');
  var value = options.name + ' Password Prompt';
  if (/'/.test(value)) {
    return end(new Error('Value should not contain single quotes.'));
  }
  var command = 'defaults write "' + path + '" "' + key + '" \'' + value + '\'';
  Node.child.exec(command, end);
}

var name = null;

function prompt(options, end) {
  version(options,
    function(error, hash) {
      if (error) return end(error);
      if (!prompting.hasOwnProperty(hash)) prompting[hash] = [];
      prompting[hash].push(end);
      // Already waiting for user to enter password...
      // We expect that exec() may be called multiple times.
      // If a prompt is already pending, then we wait for the result of the prompt
      // and do not trigger another permission request dialog.
      if (prompting[hash].length > 1) return;
      function done(error) {
        // We must clear prompting queue before looping, otherwise sudo calls which
        // are synchronously issued by these callbacks may fail to be executed.
        var callbacks = prompting[hash];
        delete prompting[hash];
        for (var index = 0, length = callbacks.length; index < length; index++) {
          var callback = callbacks[index];
          callback(error);
        }
      }
      if (Node.process.platform === 'darwin') return macPrompt(hash, options, done);
      if (Node.process.platform === 'linux') return linuxPrompt(hash, options, done);
      end(new Error('Platform not supported (unexpected, should have been checked already).'));
    }
  );
}

var prompting = {};

function remove(target, end) {
  if (!target) return end(new Error('Target not defined.'));
  target = escapeDoubleQuotes(Node.path.normalize(target));
  var command = 'rm -rf "' + target + '"';
  Node.child.exec(command, end);
}

function validName(string) {
  // We use 70 characters as a limit to side-step any issues with Unicode
  // normalization form causing a 255 character string to exceed the fs limit.
  return /^[a-z0-9 ]+$/i.test(string) && string.trim().length > 0 && string.length < 70;
}

function version(options, end) {
  versionReadICNS(options,
    function(error, buffer) {
      if (error) return end(error);
      var hash = Node.crypto.createHash('SHA256');
      hash.update('sudo-prompt 2.0.0');
      hash.update(options.name);
      hash.update(buffer);
      end(undefined, hash.digest('hex').slice(-32));
    }
  );
}

function versionReadICNS(options, end) {
  if (!options.icns || Node.process.platform !== 'darwin') {
    return end(undefined, new Buffer(0));
  }
  // options.icns is supported only on Mac.
  Node.fs.readFile(options.icns, end);
}

module.exports.exec = exec;
