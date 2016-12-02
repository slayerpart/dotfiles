(function() {
  var CompositeDisposable, Task, Transpiler, fs, languagebabelSchema, path, pathIsInside, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  _ref = require('atom'), Task = _ref.Task, CompositeDisposable = _ref.CompositeDisposable;

  fs = require('fs-plus');

  path = require('path');

  pathIsInside = require('../node_modules/path-is-inside');

  languagebabelSchema = {
    type: 'object',
    properties: {
      babelMapsPath: {
        type: 'string'
      },
      babelMapsAddUrl: {
        type: 'boolean'
      },
      babelSourcePath: {
        type: 'string'
      },
      babelTranspilePath: {
        type: 'string'
      },
      createMap: {
        type: 'boolean'
      },
      createTargetDirectories: {
        type: 'boolean'
      },
      createTranspiledCode: {
        type: 'boolean'
      },
      disableWhenNoBabelrcFileInPath: {
        type: 'boolean'
      },
      projectRoot: {
        type: 'boolean'
      },
      suppressSourcePathMessages: {
        type: 'boolean'
      },
      suppressTranspileOnSaveMessages: {
        type: 'boolean'
      },
      transpileOnSave: {
        type: 'boolean'
      }
    },
    additionalProperties: false
  };

  Transpiler = (function() {
    Transpiler.prototype.fromGrammarName = 'Babel ES6 JavaScript';

    Transpiler.prototype.fromScopeName = 'source.js.jsx';

    Transpiler.prototype.toScopeName = 'source.js.jsx';

    function Transpiler() {
      this.commandTranspileDirectories = __bind(this.commandTranspileDirectories, this);
      this.commandTranspileDirectory = __bind(this.commandTranspileDirectory, this);
      this.reqId = 0;
      this.babelTranspilerTasks = {};
      this.babelTransformerPath = require.resolve('./transpiler-task');
      this.transpileErrorNotifications = {};
      this.deprecateConfig();
      this.disposables = new CompositeDisposable();
      if (this.getConfig().transpileOnSave || this.getConfig().allowLocalOverride) {
        this.disposables.add(atom.contextMenu.add({
          '.tree-view .directory > .header > .name': [
            {
              label: 'Language-Babel',
              submenu: [
                {
                  label: 'Transpile Directory ',
                  command: 'language-babel:transpile-directory'
                }, {
                  label: 'Transpile Directories',
                  command: 'language-babel:transpile-directories'
                }
              ]
            }, {
              'type': 'separator'
            }
          ]
        }));
        this.disposables.add(atom.commands.add('.tree-view .directory > .header > .name', 'language-babel:transpile-directory', this.commandTranspileDirectory));
        this.disposables.add(atom.commands.add('.tree-view .directory > .header > .name', 'language-babel:transpile-directories', this.commandTranspileDirectories));
      }
    }

    Transpiler.prototype.transform = function(code, _arg) {
      var babelOptions, config, filePath, msgObject, pathTo, reqId, sourceMap;
      filePath = _arg.filePath, sourceMap = _arg.sourceMap;
      config = this.getConfig();
      pathTo = this.getPaths(filePath, config);
      this.createTask(pathTo.projectPath);
      babelOptions = {
        filename: filePath,
        ast: false
      };
      if (sourceMap) {
        babelOptions.sourceMaps = sourceMap;
      }
      if (this.babelTranspilerTasks[pathTo.projectPath]) {
        reqId = this.reqId++;
        msgObject = {
          reqId: reqId,
          command: 'transpileCode',
          pathTo: pathTo,
          code: code,
          babelOptions: babelOptions
        };
      }
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var err;
          try {
            _this.babelTranspilerTasks[pathTo.projectPath].send(msgObject);
          } catch (_error) {
            err = _error;
            delete _this.babelTranspilerTasks[pathTo.projectPath];
            reject("Error " + err + " sending to transpile task with PID " + _this.babelTranspilerTasks[pathTo.projectPath].childProcess.pid);
          }
          return _this.babelTranspilerTasks[pathTo.projectPath].once("transpile:" + reqId, function(msgRet) {
            if (msgRet.err != null) {
              return reject("Babel v" + msgRet.babelVersion + "\n" + msgRet.err.message + "\n" + msgRet.babelCoreUsed);
            } else {
              msgRet.sourceMap = msgRet.map;
              return resolve(msgRet);
            }
          });
        };
      })(this));
    };

    Transpiler.prototype.commandTranspileDirectory = function(_arg) {
      var target;
      target = _arg.target;
      return this.transpileDirectory({
        directory: target.dataset.path
      });
    };

    Transpiler.prototype.commandTranspileDirectories = function(_arg) {
      var target;
      target = _arg.target;
      return this.transpileDirectory({
        directory: target.dataset.path,
        recursive: true
      });
    };

    Transpiler.prototype.transpileDirectory = function(options) {
      var directory, recursive;
      directory = options.directory;
      recursive = options.recursive || false;
      return fs.readdir(directory, (function(_this) {
        return function(err, files) {
          if (err == null) {
            return files.map(function(file) {
              var fqFileName;
              fqFileName = path.join(directory, file);
              return fs.stat(fqFileName, function(err, stats) {
                if (err == null) {
                  if (stats.isFile()) {
                    if (/\.min\.[a-z]+$/.test(fqFileName)) {
                      return;
                    }
                    if (/\.(js|jsx|es|es6|babel)$/.test(fqFileName)) {
                      return _this.transpile(file, null, _this.getConfigAndPathTo(fqFileName));
                    }
                  } else if (recursive && stats.isDirectory()) {
                    return _this.transpileDirectory({
                      directory: fqFileName,
                      recursive: true
                    });
                  }
                }
              });
            });
          }
        };
      })(this));
    };

    Transpiler.prototype.transpile = function(sourceFile, textEditor, configAndPathTo) {
      var babelOptions, config, err, msgObject, pathTo, reqId, _ref1;
      if (configAndPathTo != null) {
        config = configAndPathTo.config, pathTo = configAndPathTo.pathTo;
      } else {
        _ref1 = this.getConfigAndPathTo(sourceFile), config = _ref1.config, pathTo = _ref1.pathTo;
      }
      if (config.transpileOnSave !== true) {
        return;
      }
      if (config.disableWhenNoBabelrcFileInPath) {
        if (!this.isBabelrcInPath(pathTo.sourceFileDir)) {
          return;
        }
      }
      if (!pathIsInside(pathTo.sourceFile, pathTo.sourceRoot)) {
        if (!config.suppressSourcePathMessages) {
          atom.notifications.addWarning('LB: Babel file is not inside the "Babel Source Path" directory.', {
            dismissable: false,
            detail: "No transpiled code output for file \n" + pathTo.sourceFile + " \n\nTo suppress these 'invalid source path' messages use language-babel package settings"
          });
        }
        return;
      }
      babelOptions = this.getBabelOptions(config);
      this.cleanNotifications(pathTo);
      this.createTask(pathTo.projectPath);
      if (this.babelTranspilerTasks[pathTo.projectPath]) {
        reqId = this.reqId++;
        msgObject = {
          reqId: reqId,
          command: 'transpile',
          pathTo: pathTo,
          babelOptions: babelOptions
        };
        try {
          this.babelTranspilerTasks[pathTo.projectPath].send(msgObject);
        } catch (_error) {
          err = _error;
          console.log("Error " + err + " sending to transpile task with PID " + this.babelTranspilerTasks[pathTo.projectPath].childProcess.pid);
          delete this.babelTranspilerTasks[pathTo.projectPath];
          this.createTask(pathTo.projectPath);
          console.log("Restarted transpile task with PID " + this.babelTranspilerTasks[pathTo.projectPath].childProcess.pid);
          this.babelTranspilerTasks[pathTo.projectPath].send(msgObject);
        }
        return this.babelTranspilerTasks[pathTo.projectPath].once("transpile:" + reqId, (function(_this) {
          return function(msgRet) {
            var mapJson, xssiProtection, _ref2, _ref3, _ref4;
            if ((_ref2 = msgRet.result) != null ? _ref2.ignored : void 0) {
              return;
            }
            if (msgRet.err) {
              if (msgRet.err.stack) {
                return _this.transpileErrorNotifications[pathTo.sourceFile] = atom.notifications.addError("LB: Babel Transpiler Error", {
                  dismissable: true,
                  detail: "" + msgRet.err.message + "\n \n" + msgRet.babelCoreUsed + "\n \n" + msgRet.err.stack
                });
              } else {
                _this.transpileErrorNotifications[pathTo.sourceFile] = atom.notifications.addError("LB: Babel v" + msgRet.babelVersion + " Transpiler Error", {
                  dismissable: true,
                  detail: "" + msgRet.err.message + "\n \n" + msgRet.babelCoreUsed + "\n \n" + msgRet.err.codeFrame
                });
                if ((((_ref3 = msgRet.err.loc) != null ? _ref3.line : void 0) != null) && (textEditor != null ? textEditor.alive : void 0)) {
                  return textEditor.setCursorBufferPosition([msgRet.err.loc.line - 1, msgRet.err.loc.column]);
                }
              }
            } else {
              if (!config.suppressTranspileOnSaveMessages) {
                atom.notifications.addInfo("LB: Babel v" + msgRet.babelVersion + " Transpiler Success", {
                  detail: "" + pathTo.sourceFile + "\n \n" + msgRet.babelCoreUsed
                });
              }
              if (!config.createTranspiledCode) {
                if (!config.suppressTranspileOnSaveMessages) {
                  atom.notifications.addInfo('LB: No transpiled output configured');
                }
                return;
              }
              if (pathTo.sourceFile === pathTo.transpiledFile) {
                atom.notifications.addWarning('LB: Transpiled file would overwrite source file. Aborted!', {
                  dismissable: true,
                  detail: pathTo.sourceFile
                });
                return;
              }
              if (config.createTargetDirectories) {
                fs.makeTreeSync(path.parse(pathTo.transpiledFile).dir);
              }
              if (config.babelMapsAddUrl) {
                msgRet.result.code = msgRet.result.code + '\n' + '//# sourceMappingURL=' + pathTo.mapFile;
              }
              fs.writeFileSync(pathTo.transpiledFile, msgRet.result.code);
              if (config.createMap && ((_ref4 = msgRet.result.map) != null ? _ref4.version : void 0)) {
                if (config.createTargetDirectories) {
                  fs.makeTreeSync(path.parse(pathTo.mapFile).dir);
                }
                mapJson = {
                  version: msgRet.result.map.version,
                  sources: pathTo.sourceFile,
                  file: pathTo.transpiledFile,
                  sourceRoot: '',
                  names: msgRet.result.map.names,
                  mappings: msgRet.result.map.mappings
                };
                xssiProtection = ')]}\n';
                return fs.writeFileSync(pathTo.mapFile, xssiProtection + JSON.stringify(mapJson, null, ' '));
              }
            }
          };
        })(this));
      }
    };

    Transpiler.prototype.cleanNotifications = function(pathTo) {
      var i, n, sf, _ref1, _results;
      if (this.transpileErrorNotifications[pathTo.sourceFile] != null) {
        this.transpileErrorNotifications[pathTo.sourceFile].dismiss();
        delete this.transpileErrorNotifications[pathTo.sourceFile];
      }
      _ref1 = this.transpileErrorNotifications;
      for (sf in _ref1) {
        n = _ref1[sf];
        if (n.dismissed) {
          delete this.transpileErrorNotifications[sf];
        }
      }
      i = atom.notifications.notifications.length - 1;
      _results = [];
      while (i >= 0) {
        if (atom.notifications.notifications[i].dismissed && atom.notifications.notifications[i].message.substring(0, 3) === "LB:") {
          atom.notifications.notifications.splice(i, 1);
        }
        _results.push(i--);
      }
      return _results;
    };

    Transpiler.prototype.createTask = function(projectPath) {
      var _base;
      return (_base = this.babelTranspilerTasks)[projectPath] != null ? _base[projectPath] : _base[projectPath] = Task.once(this.babelTransformerPath, projectPath, (function(_this) {
        return function() {
          return delete _this.babelTranspilerTasks[projectPath];
        };
      })(this));
    };

    Transpiler.prototype.deprecateConfig = function() {
      if (atom.config.get('language-babel.supressTranspileOnSaveMessages') != null) {
        atom.config.set('language-babel.suppressTranspileOnSaveMessages', atom.config.get('language-babel.supressTranspileOnSaveMessages'));
      }
      if (atom.config.get('language-babel.supressSourcePathMessages') != null) {
        atom.config.set('language-babel.suppressSourcePathMessages', atom.config.get('language-babel.supressSourcePathMessages'));
      }
      atom.config.unset('language-babel.supressTranspileOnSaveMessages');
      atom.config.unset('language-babel.supressSourcePathMessages');
      atom.config.unset('language-babel.useInternalScanner');
      atom.config.unset('language-babel.stopAtProjectDirectory');
      atom.config.unset('language-babel.babelStage');
      atom.config.unset('language-babel.externalHelpers');
      atom.config.unset('language-babel.moduleLoader');
      atom.config.unset('language-babel.blacklistTransformers');
      atom.config.unset('language-babel.whitelistTransformers');
      atom.config.unset('language-babel.looseTransformers');
      atom.config.unset('language-babel.optionalTransformers');
      atom.config.unset('language-babel.plugins');
      atom.config.unset('language-babel.presets');
      return atom.config.unset('language-babel.formatJSX');
    };

    Transpiler.prototype.getBabelOptions = function(config) {
      var babelOptions;
      babelOptions = {
        code: true
      };
      if (config.createMap) {
        babelOptions.sourceMaps = config.createMap;
      }
      return babelOptions;
    };

    Transpiler.prototype.getConfigAndPathTo = function(sourceFile) {
      var config, localConfig, pathTo;
      config = this.getConfig();
      pathTo = this.getPaths(sourceFile, config);
      if (config.allowLocalOverride) {
        if (this.jsonSchema == null) {
          this.jsonSchema = (require('../node_modules/jjv'))();
          this.jsonSchema.addSchema('localConfig', languagebabelSchema);
        }
        localConfig = this.getLocalConfig(pathTo.sourceFileDir, pathTo.projectPath, {});
        this.merge(config, localConfig);
        pathTo = this.getPaths(sourceFile, config);
      }
      return {
        config: config,
        pathTo: pathTo
      };
    };

    Transpiler.prototype.getConfig = function() {
      return atom.config.get('language-babel');
    };

    Transpiler.prototype.getLocalConfig = function(fromDir, toDir, localConfig) {
      var err, fileContent, isProjectRoot, jsonContent, languageBabelCfgFile, localConfigFile, schemaErrors;
      localConfigFile = '.languagebabel';
      languageBabelCfgFile = path.join(fromDir, localConfigFile);
      if (fs.existsSync(languageBabelCfgFile)) {
        fileContent = fs.readFileSync(languageBabelCfgFile, 'utf8');
        try {
          jsonContent = JSON.parse(fileContent);
        } catch (_error) {
          err = _error;
          atom.notifications.addError("LB: " + localConfigFile + " " + err.message, {
            dismissable: true,
            detail: "File = " + languageBabelCfgFile + "\n\n" + fileContent
          });
          return;
        }
        schemaErrors = this.jsonSchema.validate('localConfig', jsonContent);
        if (schemaErrors) {
          atom.notifications.addError("LB: " + localConfigFile + " configuration error", {
            dismissable: true,
            detail: "File = " + languageBabelCfgFile + "\n\n" + fileContent
          });
        } else {
          isProjectRoot = jsonContent.projectRoot;
          this.merge(jsonContent, localConfig);
          if (isProjectRoot) {
            jsonContent.projectRootDir = fromDir;
          }
          localConfig = jsonContent;
        }
      }
      if (fromDir !== toDir) {
        if (fromDir === path.dirname(fromDir)) {
          return localConfig;
        }
        if (isProjectRoot) {
          return localConfig;
        }
        return this.getLocalConfig(path.dirname(fromDir), toDir, localConfig);
      } else {
        return localConfig;
      }
    };

    Transpiler.prototype.getPaths = function(sourceFile, config) {
      var absMapFile, absMapsRoot, absProjectPath, absSourceRoot, absTranspileRoot, absTranspiledFile, parsedSourceFile, projectContainingSource, relMapsPath, relSourcePath, relSourceRootToSourceFile, relTranspilePath, sourceFileInProject;
      projectContainingSource = atom.project.relativizePath(sourceFile);
      if (projectContainingSource[0] === null) {
        sourceFileInProject = false;
      } else {
        sourceFileInProject = true;
      }
      if (config.projectRootDir != null) {
        absProjectPath = path.normalize(config.projectRootDir);
      } else if (projectContainingSource[0] === null) {
        absProjectPath = path.parse(sourceFile).root;
      } else {
        absProjectPath = path.normalize(path.join(projectContainingSource[0], '.'));
      }
      relSourcePath = path.normalize(config.babelSourcePath);
      relTranspilePath = path.normalize(config.babelTranspilePath);
      relMapsPath = path.normalize(config.babelMapsPath);
      absSourceRoot = path.join(absProjectPath, relSourcePath);
      absTranspileRoot = path.join(absProjectPath, relTranspilePath);
      absMapsRoot = path.join(absProjectPath, relMapsPath);
      parsedSourceFile = path.parse(sourceFile);
      relSourceRootToSourceFile = path.relative(absSourceRoot, parsedSourceFile.dir);
      absTranspiledFile = path.join(absTranspileRoot, relSourceRootToSourceFile, parsedSourceFile.name + '.js');
      absMapFile = path.join(absMapsRoot, relSourceRootToSourceFile, parsedSourceFile.name + '.js.map');
      return {
        sourceFileInProject: sourceFileInProject,
        sourceFile: sourceFile,
        sourceFileDir: parsedSourceFile.dir,
        mapFile: absMapFile,
        transpiledFile: absTranspiledFile,
        sourceRoot: absSourceRoot,
        projectPath: absProjectPath
      };
    };

    Transpiler.prototype.isBabelrcInPath = function(fromDir) {
      var babelrc, babelrcFile;
      babelrc = '.babelrc';
      babelrcFile = path.join(fromDir, babelrc);
      if (fs.existsSync(babelrcFile)) {
        return true;
      }
      if (fromDir !== path.dirname(fromDir)) {
        return this.isBabelrcInPath(path.dirname(fromDir));
      } else {
        return false;
      }
    };

    Transpiler.prototype.merge = function(targetObj, sourceObj) {
      var prop, val, _results;
      _results = [];
      for (prop in sourceObj) {
        val = sourceObj[prop];
        _results.push(targetObj[prop] = val);
      }
      return _results;
    };

    Transpiler.prototype.stopTranspilerTask = function(projectPath) {
      var msgObject;
      msgObject = {
        command: 'stop'
      };
      return this.babelTranspilerTasks[projectPath].send(msgObject);
    };

    Transpiler.prototype.stopAllTranspilerTask = function() {
      var projectPath, v, _ref1, _results;
      _ref1 = this.babelTranspilerTasks;
      _results = [];
      for (projectPath in _ref1) {
        v = _ref1[projectPath];
        _results.push(this.stopTranspilerTask(projectPath));
      }
      return _results;
    };

    Transpiler.prototype.stopUnusedTasks = function() {
      var atomProjectPath, atomProjectPaths, isTaskInCurrentProject, projectTaskPath, v, _i, _len, _ref1, _results;
      atomProjectPaths = atom.project.getPaths();
      _ref1 = this.babelTranspilerTasks;
      _results = [];
      for (projectTaskPath in _ref1) {
        v = _ref1[projectTaskPath];
        isTaskInCurrentProject = false;
        for (_i = 0, _len = atomProjectPaths.length; _i < _len; _i++) {
          atomProjectPath = atomProjectPaths[_i];
          if (pathIsInside(projectTaskPath, atomProjectPath)) {
            isTaskInCurrentProject = true;
            break;
          }
        }
        if (!isTaskInCurrentProject) {
          _results.push(this.stopTranspilerTask(projectTaskPath));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    return Transpiler;

  })();

  module.exports = Transpiler;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL01hcnZpbi8uYXRvbS9wYWNrYWdlcy9sYW5ndWFnZS1iYWJlbC9saWIvdHJhbnNwaWxlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsd0ZBQUE7SUFBQSxrRkFBQTs7QUFBQSxFQUFBLE9BQStCLE9BQUEsQ0FBUSxNQUFSLENBQS9CLEVBQUMsWUFBQSxJQUFELEVBQU8sMkJBQUEsbUJBQVAsQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQURMLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FGUCxDQUFBOztBQUFBLEVBR0EsWUFBQSxHQUFlLE9BQUEsQ0FBUSxnQ0FBUixDQUhmLENBQUE7O0FBQUEsRUFNQSxtQkFBQSxHQUFzQjtBQUFBLElBQ3BCLElBQUEsRUFBTSxRQURjO0FBQUEsSUFFcEIsVUFBQSxFQUFZO0FBQUEsTUFDVixhQUFBLEVBQWtDO0FBQUEsUUFBRSxJQUFBLEVBQU0sUUFBUjtPQUR4QjtBQUFBLE1BRVYsZUFBQSxFQUFrQztBQUFBLFFBQUUsSUFBQSxFQUFNLFNBQVI7T0FGeEI7QUFBQSxNQUdWLGVBQUEsRUFBa0M7QUFBQSxRQUFFLElBQUEsRUFBTSxRQUFSO09BSHhCO0FBQUEsTUFJVixrQkFBQSxFQUFrQztBQUFBLFFBQUUsSUFBQSxFQUFNLFFBQVI7T0FKeEI7QUFBQSxNQUtWLFNBQUEsRUFBa0M7QUFBQSxRQUFFLElBQUEsRUFBTSxTQUFSO09BTHhCO0FBQUEsTUFNVix1QkFBQSxFQUFrQztBQUFBLFFBQUUsSUFBQSxFQUFNLFNBQVI7T0FOeEI7QUFBQSxNQU9WLG9CQUFBLEVBQWtDO0FBQUEsUUFBRSxJQUFBLEVBQU0sU0FBUjtPQVB4QjtBQUFBLE1BUVYsOEJBQUEsRUFBa0M7QUFBQSxRQUFFLElBQUEsRUFBTSxT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

//# sourceURL=/Users/Marvin/.atom/packages/language-babel/lib/transpiler.coffee
