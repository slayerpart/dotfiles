(function() {
  var Config, KernelManager, KernelPicker, WSKernel, ZMQKernel, child_process, fs, launchSpec, path, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  _ = require('lodash');

  child_process = require('child_process');

  launchSpec = require('spawnteract').launchSpec;

  fs = require('fs');

  path = require('path');

  Config = require('./config');

  WSKernel = require('./ws-kernel');

  ZMQKernel = require('./zmq-kernel');

  KernelPicker = require('./kernel-picker');

  module.exports = KernelManager = (function() {
    function KernelManager() {
      this.getKernelSpecsFromJupyter = __bind(this.getKernelSpecsFromJupyter, this);
      this.getAllKernelSpecs = __bind(this.getAllKernelSpecs, this);
      this._runningKernels = {};
      this._kernelSpecs = this.getKernelSpecsFromSettings();
    }

    KernelManager.prototype.destroy = function() {
      _.forEach(this._runningKernels, function(kernel) {
        return kernel.destroy();
      });
      return this._runningKernels = {};
    };

    KernelManager.prototype.setRunningKernelFor = function(grammar, kernel) {
      var language;
      language = this.getLanguageFor(grammar);
      kernel.kernelSpec.language = language;
      return this._runningKernels[language] = kernel;
    };

    KernelManager.prototype.destroyRunningKernelFor = function(grammar) {
      var kernel, language;
      language = this.getLanguageFor(grammar);
      kernel = this._runningKernels[language];
      delete this._runningKernels[language];
      return kernel != null ? kernel.destroy() : void 0;
    };

    KernelManager.prototype.restartRunningKernelFor = function(grammar, onRestarted) {
      var kernel, kernelSpec, language;
      language = this.getLanguageFor(grammar);
      kernel = this._runningKernels[language];
      if (kernel instanceof WSKernel) {
        kernel.restart().then(function() {
          return typeof onRestarted === "function" ? onRestarted(kernel) : void 0;
        });
        return;
      }
      if (kernel instanceof ZMQKernel && kernel.kernelProcess) {
        kernelSpec = kernel.kernelSpec;
        this.destroyRunningKernelFor(grammar);
        this.startKernel(kernelSpec, grammar, function(kernel) {
          return typeof onRestarted === "function" ? onRestarted(kernel) : void 0;
        });
        return;
      }
      console.log('KernelManager: restartRunningKernelFor: ignored', kernel);
      atom.notifications.addWarning('Cannot restart this kernel');
      return typeof onRestarted === "function" ? onRestarted(kernel) : void 0;
    };

    KernelManager.prototype.startKernelFor = function(grammar, onStarted) {
      var connection, connectionFile, connectionString, e, language, rootDirectory, _ref;
      try {
        rootDirectory = ((_ref = atom.project.rootDirectories[0]) != null ? _ref.path : void 0) || path.dirname(atom.workspace.getActiveTextEditor().getPath());
        connectionFile = path.join(rootDirectory, 'hydrogen', 'connection.json');
        connectionString = fs.readFileSync(connectionFile, 'utf8');
        connection = JSON.parse(connectionString);
        this.startExistingKernel(grammar, connection, connectionFile, onStarted);
        return;
      } catch (_error) {
        e = _error;
        if (e.code !== 'ENOENT') {
          console.error('KernelManager: Cannot start existing kernel:\n', e);
        }
      }
      language = this.getLanguageFor(grammar);
      return this.getKernelSpecFor(language, (function(_this) {
        return function(kernelSpec) {
          var description, message;
          if (kernelSpec == null) {
            message = "No kernel for language `" + language + "` found";
            description = 'Check that the language for this file is set in Atom and that you have a Jupyter kernel installed for it.';
            atom.notifications.addError(message, {
              description: description
            });
            return;
          }
          return _this.startKernel(kernelSpec, grammar, onStarted);
        };
      })(this));
    };

    KernelManager.prototype.startExistingKernel = function(grammar, connection, connectionFile, onStarted) {
      var kernel, kernelSpec, language;
      language = this.getLanguageFor(grammar);
      console.log('KernelManager: startExistingKernel: Assuming', language);
      kernelSpec = {
        display_name: 'Existing Kernel',
        language: language,
        argv: [],
        env: {}
      };
      kernel = new ZMQKernel(kernelSpec, grammar, connection, connectionFile);
      this.setRunningKernelFor(grammar, kernel);
      this._executeStartupCode(kernel);
      return typeof onStarted === "function" ? onStarted(kernel) : void 0;
    };

    KernelManager.prototype.startKernel = function(kernelSpec, grammar, onStarted) {
      var language, projectPath, spawnOptions;
      language = this.getLanguageFor(grammar);
      console.log('KernelManager: startKernelFor:', language);
      projectPath = path.dirname(atom.workspace.getActiveTextEditor().getPath());
      spawnOptions = {
        cwd: projectPath
      };
      return launchSpec(kernelSpec, spawnOptions).then((function(_this) {
        return function(_arg) {
          var config, connectionFile, kernel, spawn;
          config = _arg.config, connectionFile = _arg.connectionFile, spawn = _arg.spawn;
          kernel = new ZMQKernel(kernelSpec, grammar, config, connectionFile, spawn);
          _this.setRunningKernelFor(grammar, kernel);
          _this._executeStartupCode(kernel);
          return typeof onStarted === "function" ? onStarted(kernel) : void 0;
        };
      })(this));
    };

    KernelManager.prototype._executeStartupCode = function(kernel) {
      var displayName, startupCode;
      displayName = kernel.kernelSpec.display_name;
      startupCode = Config.getJson('startupCode')[displayName];
      if (startupCode != null) {
        console.log('KernelManager: Executing startup code:', startupCode);
        startupCode = startupCode + ' \n';
        return kernel.execute(startupCode);
      }
    };

    KernelManager.prototype.getAllRunningKernels = function() {
      return _.clone(this._runningKernels);
    };

    KernelManager.prototype.getRunningKernelFor = function(language) {
      return this._runningKernels[language];
    };

    KernelManager.prototype.getLanguageFor = function(grammar) {
      return grammar != null ? grammar.name.toLowerCase() : void 0;
    };

    KernelManager.prototype.getAllKernelSpecs = function(callback) {
      if (_.isEmpty(this._kernelSpecs)) {
        return this.updateKernelSpecs((function(_this) {
          return function() {
            return callback(_.map(_this._kernelSpecs, 'spec'));
          };
        })(this));
      } else {
        return callback(_.map(this._kernelSpecs, 'spec'));
      }
    };

    KernelManager.prototype.getAllKernelSpecsFor = function(language, callback) {
      if (language != null) {
        return this.getAllKernelSpecs((function(_this) {
          return function(kernelSpecs) {
            var specs;
            specs = kernelSpecs.filter(function(spec) {
              return _this.kernelSpecProvidesLanguage(spec, language);
            });
            return callback(specs);
          };
        })(this));
      } else {
        return callback([]);
      }
    };

    KernelManager.prototype.getKernelSpecFor = function(language, callback) {
      if (language == null) {
        return null;
      }
      return this.getAllKernelSpecsFor(language, (function(_this) {
        return function(kernelSpecs) {
          if (kernelSpecs.length <= 1) {
            return callback(kernelSpecs[0]);
          } else {
            if (_this.kernelPicker == null) {
              _this.kernelPicker = new KernelPicker(function(onUpdated) {
                return onUpdated(kernelSpecs);
              });
              _this.kernelPicker.onConfirmed = function(_arg) {
                var kernelSpec;
                kernelSpec = _arg.kernelSpec;
                return callback(kernelSpec);
              };
            }
            return _this.kernelPicker.toggle();
          }
        };
      })(this));
    };

    KernelManager.prototype.kernelSpecProvidesLanguage = function(kernelSpec, language) {
      var kernelLanguage, mappedLanguage;
      kernelLanguage = kernelSpec.language;
      mappedLanguage = Config.getJson('languageMappings')[kernelLanguage];
      if (mappedLanguage) {
        return mappedLanguage === language;
      }
      return kernelLanguage.toLowerCase() === language;
    };

    KernelManager.prototype.getKernelSpecsFromSettings = function() {
      var settings;
      settings = Config.getJson('kernelspec');
      if (!settings.kernelspecs) {
        return {};
      }
      return _.pickBy(settings.kernelspecs, function(_arg) {
        var spec;
        spec = _arg.spec;
        return (spec != null ? spec.language : void 0) && spec.display_name && spec.argv;
      });
    };

    KernelManager.prototype.mergeKernelSpecs = function(kernelSpecs) {
      return _.assign(this._kernelSpecs, kernelSpecs);
    };

    KernelManager.prototype.updateKernelSpecs = function(callback) {
      this._kernelSpecs = this.getKernelSpecsFromSettings;
      return this.getKernelSpecsFromJupyter((function(_this) {
        return function(err, kernelSpecsFromJupyter) {
          var message, options;
          if (!err) {
            _this.mergeKernelSpecs(kernelSpecsFromJupyter);
          }
          if (_.isEmpty(_this._kernelSpecs)) {
            message = 'No kernel specs found';
            options = {
              description: 'Use kernelSpec option in Hydrogen or update IPython/Jupyter to a version that supports: `jupyter kernelspec list --json` or `ipython kernelspec list --json`',
              dismissable: true
            };
            atom.notifications.addError(message, options);
          } else {
            err = null;
            message = 'Hydrogen Kernels updated:';
            options = {
              detail: (_.map(_this._kernelSpecs, 'spec.display_name')).join('\n')
            };
            atom.notifications.addInfo(message, options);
          }
          return typeof callback === "function" ? callback(err, _this._kernelSpecs) : void 0;
        };
      })(this));
    };

    KernelManager.prototype.getKernelSpecsFromJupyter = function(callback) {
      var ipython, jupyter;
      jupyter = 'jupyter kernelspec list --json --log-level=CRITICAL';
      ipython = 'ipython kernelspec list --json --log-level=CRITICAL';
      return this.getKernelSpecsFrom(jupyter, (function(_this) {
        return function(jupyterError, kernelSpecs) {
          if (!jupyterError) {
            if (typeof callback === "function") {
              callback(jupyterError, kernelSpecs);
            }
            return;
          }
          return _this.getKernelSpecsFrom(ipython, function(ipythonError, kernelSpecs) {
            if (!ipythonError) {
              return typeof callback === "function" ? callback(ipythonError, kernelSpecs) : void 0;
            } else {
              return typeof callback === "function" ? callback(jupyterError, kernelSpecs) : void 0;
            }
          });
        };
      })(this));
    };

    KernelManager.prototype.getKernelSpecsFrom = function(command, callback) {
      var options;
      options = {
        killSignal: 'SIGINT'
      };
      return child_process.exec(command, options, function(err, stdout, stderr) {
        var error, kernelSpecs;
        if (!err) {
          try {
            kernelSpecs = JSON.parse(stdout).kernelspecs;
          } catch (_error) {
            error = _error;
            err = error;
            console.log('Could not parse kernelspecs:', err);
          }
        }
        return typeof callback === "function" ? callback(err, kernelSpecs) : void 0;
      });
    };

    return KernelManager;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL01hcnZpbi8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIva2VybmVsLW1hbmFnZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdHQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVIsQ0FBSixDQUFBOztBQUFBLEVBQ0EsYUFBQSxHQUFnQixPQUFBLENBQVEsZUFBUixDQURoQixDQUFBOztBQUFBLEVBRUMsYUFBYyxPQUFBLENBQVEsYUFBUixFQUFkLFVBRkQsQ0FBQTs7QUFBQSxFQUdBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUhMLENBQUE7O0FBQUEsRUFJQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FKUCxDQUFBOztBQUFBLEVBTUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSLENBTlQsQ0FBQTs7QUFBQSxFQU9BLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUixDQVBYLENBQUE7O0FBQUEsRUFRQSxTQUFBLEdBQVksT0FBQSxDQUFRLGNBQVIsQ0FSWixDQUFBOztBQUFBLEVBU0EsWUFBQSxHQUFlLE9BQUEsQ0FBUSxpQkFBUixDQVRmLENBQUE7O0FBQUEsRUFXQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ1csSUFBQSx1QkFBQSxHQUFBO0FBQ1QsbUZBQUEsQ0FBQTtBQUFBLG1FQUFBLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxlQUFELEdBQW1CLEVBQW5CLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxZQUFELEdBQWdCLElBQUMsQ0FBQSwwQkFBRCxDQUFBLENBRGhCLENBRFM7SUFBQSxDQUFiOztBQUFBLDRCQUtBLE9BQUEsR0FBUyxTQUFBLEdBQUE7QUFDTCxNQUFBLENBQUMsQ0FBQyxPQUFGLENBQVUsSUFBQyxDQUFBLGVBQVgsRUFB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

//# sourceURL=/Users/Marvin/.atom/packages/Hydrogen/lib/kernel-manager.coffee
