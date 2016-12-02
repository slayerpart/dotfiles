(function() {
  var DefinitionsView, path,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  path = require('path');

  DefinitionsView = require('./definitions-view');

  module.exports = {
    selector: '.source.python',
    disableForSelector: '.source.python .comment, .source.python .string',
    inclusionPriority: 1,
    suggestionPriority: 2,
    excludeLowerPriority: true,
    _issueReportLink: ['If issue persists please report it at https://github.com', '/sadovnychyi/autocomplete-python/issues/new'].join(''),
    constructor: function() {
      var env, p, path_env, paths, pythonEx, pythonExecutable, pythonPath, _i, _len;
      this.requests = {};
      this.definitionsView = null;
      env = process.env;
      pythonPath = atom.config.get('autocomplete-python.pythonPath');
      pythonExecutable = atom.config.get('autocomplete-python.pythonExecutable');
      if (/^win/.test(process.platform)) {
        paths = ['C:\\Python2.7', 'C:\\Python3.4', 'C:\\Python3.5', 'C:\\Program Files (x86)\\Python 2.7', 'C:\\Program Files (x86)\\Python 3.4', 'C:\\Program Files (x86)\\Python 3.5', 'C:\\Program Files (x64)\\Python 2.7', 'C:\\Program Files (x64)\\Python 3.4', 'C:\\Program Files (x64)\\Python 3.5', 'C:\\Program Files\\Python 2.7', 'C:\\Program Files\\Python 3.4', 'C:\\Program Files\\Python 3.5'];
      }
      ({
        "else": paths = ['/usr/local/bin', '/usr/bin', '/bin', '/usr/sbin', '/sbin']
      });
      path_env = (env.PATH || '').split(path.delimiter);
      if (pythonPath && __indexOf.call(path_env, pythonPath) < 0) {
        path_env.unshift(pythonPath);
      }
      for (_i = 0, _len = paths.length; _i < _len; _i++) {
        p = paths[_i];
        if (__indexOf.call(path_env, p) < 0) {
          path_env.push(p);
        }
      }
      env.PATH = path_env.join(path.delimiter);
      pythonEx = pythonExecutable ? pythonExecutable : 'python';
      this.provider = require('child_process').spawn(pythonEx, [__dirname + '/completion.py'], {
        env: env
      });
      this.provider.on('error', (function(_this) {
        return function(err) {
          if (err.code === 'ENOENT') {
            return atom.notifications.addWarning("autocomplete-python unable to find python executable: please set " + "the path to python directory manually in the package settings and " + ("restart your editor. " + _this._issueReportLink), {
              detail: err,
              dismissable: true
            });
          } else {
            return atom.notifications.addError("autocomplete-python error. " + _this._issueReportLink, {
              detail: err,
              dismissable: true
            });
          }
        };
      })(this));
      this.provider.on('exit', (function(_this) {
        return function(code, signal) {
          if (signal !== 'SIGTERM') {
            return atom.notifications.addError("autocomplete-python provider exit. " + _this._issueReportLink, {
              detail: "exit with code " + code + ", signal " + signal,
              dismissable: true
            });
          }
        };
      })(this));
      this.provider.stderr.on('data', function(err) {
        if (atom.config.get('autocomplete-python.outputProviderErrors')) {
          return atom.notifications.addError('autocomplete-python traceback output:', {
            detail: "" + err,
            dismissable: true
          });
        }
      });
      this.readline = require('readline').createInterface({
        input: this.provider.stdout
      });
      this.readline.on('line', (function(_this) {
        return function(response) {
          return _this._deserialize(response);
        };
      })(this));
      return atom.commands.add('atom-text-editor[data-grammar~=python]', 'autocomplete-python:go-to-definition', (function(_this) {
        return function() {
          var bufferPosition, editor;
          if (_this.definitionsView) {
            _this.definitionsView.destroy();
          }
          _this.definitionsView = new DefinitionsView();
          editor = atom.workspace.getActiveTextEditor();
          bufferPosition = editor.getCursorBufferPosition();
          return _this.getDefinitions({
            editor: editor,
            bufferPosition: bufferPosition
          }).then(function(results) {
            _this.definitionsView.setItems(results);
            if (results.length === 1) {
              return _this.definitionsView.confirmed(results[0]);
            }
          });
        };
      })(this));
    },
    _serialize: function(request) {
      return JSON.stringify(request);
    },
    _deserialize: function(response) {
      var reject, resolve, _ref;
      response = JSON.parse(response);
      _ref = this.requests[response['id']], resolve = _ref[0], reject = _ref[1];
      return resolve(response['results']);
    },
    _generateRequestId: function(editor, bufferPosition) {
      return require('crypto').createHash('md5').update([editor.getPath(), editor.getText(), bufferPosition.row, bufferPosition.column].join()).digest('hex');
    },
    _generateRequestConfig: function() {
      var args, extraPaths, modified, project, _i, _j, _len, _len1, _ref, _ref1;
      extraPaths = [];
      _ref = atom.config.get('autocomplete-python.extraPaths').split(';');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        path = _ref[_i];
        _ref1 = atom.project.getPaths();
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          project = _ref1[_j];
          modified = path.replace('$PROJECT', project);
          if (__indexOf.call(extraPaths, modified) < 0) {
            extraPaths.push(modified);
          }
        }
      }
      args = {
        'extraPaths': extraPaths,
        'useSnippets': atom.config.get('autocomplete-python.useSnippets'),
        'caseInsensitiveCompletion': atom.config.get('autocomplete-python.caseInsensitiveCompletion'),
        'addDotAfterModule': atom.config.get('autocomplete-python.addDotAfterModule'),
        'addBracketAfterFunction': atom.config.get('autocomplete-python.addBracketAfterFunction'),
        'showDescriptions': atom.config.get('autocomplete-python.showDescriptions')
      };
      return args;
    },
    getSuggestions: function(_arg) {
      var bufferPosition, editor, payload, prefix, scopeDescriptor;
      editor = _arg.editor, bufferPosition = _arg.bufferPosition, scopeDescriptor = _arg.scopeDescriptor, prefix = _arg.prefix;
      if ((prefix !== '.' && prefix !== ' ') && (prefix.length < 1 || /\W/.test(prefix))) {
        return [];
      }
      payload = {
        id: this._generateRequestId(editor, bufferPosition),
        lookup: 'completions',
        path: editor.getPath(),
        source: editor.getText(),
        line: bufferPosition.row,
        column: bufferPosition.column,
        config: this._generateRequestConfig()
      };
      this.provider.stdin.write(this._serialize(payload) + '\n');
      return new Promise((function(_this) {
        return function(resolve, reject) {
          return _this.requests[payload.id] = [resolve, reject];
        };
      })(this));
    },
    getDefinitions: function(_arg) {
      var bufferPosition, editor, payload;
      editor = _arg.editor, bufferPosition = _arg.bufferPosition;
      payload = {
        id: this._generateRequestId(editor, bufferPosition),
        lookup: 'definitions',
        path: editor.getPath(),
        source: editor.getText(),
        line: bufferPosition.row,
        column: bufferPosition.column,
        config: this._generateRequestConfig()
      };
      this.provider.stdin.write(this._serialize(payload) + '\n');
      return new Promise((function(_this) {
        return function(resolve, reject) {
          return _this.requests[payload.id] = [resolve, reject];
        };
      })(this));
    },
    dispose: function() {
      this.readline.close();
      return this.provider.kill();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL01hcnZpbi8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtcHl0aG9uL2xpYi9wcm92aWRlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEscUJBQUE7SUFBQSxxSkFBQTs7QUFBQSxFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFQLENBQUE7O0FBQUEsRUFDQSxlQUFBLEdBQWtCLE9BQUEsQ0FBUSxvQkFBUixDQURsQixDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsUUFBQSxFQUFVLGdCQUFWO0FBQUEsSUFDQSxrQkFBQSxFQUFvQixpREFEcEI7QUFBQSxJQUVBLGlCQUFBLEVBQW1CLENBRm5CO0FBQUEsSUFHQSxrQkFBQSxFQUFvQixDQUhwQjtBQUFBLElBSUEsb0JBQUEsRUFBc0IsSUFKdEI7QUFBQSxJQU1BLGdCQUFBLEVBQWtCLENBQUMsMERBQUQsRUFDQyw2Q0FERCxDQUMrQyxDQUFDLElBRGhELENBQ3FELEVBRHJELENBTmxCO0FBQUEsSUFTQSxXQUFBLEVBQWEsU0FBQSxHQUFBO0FBQ1gsVUFBQSx5RUFBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxFQUFaLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxlQUFELEdBQW1CLElBRG5CLENBQUE7QUFBQSxNQUdBLEdBQUEsR0FBTSxPQUFPLENBQUMsR0FIZCxDQUFBO0FBQUEsTUFJQSxVQUFBLEdBQWEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGdDQUFoQixDQUpiLENBQUE7QUFBQSxNQUtBLGdCQUFBLEdBQW1CLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixzQ0FBaEIsQ0FMbkIsQ0FBQTtBQU9BLE1BQUEsSUFBRyxNQUFNLENBQUMsSUFBUCxDQUFZLE9BQU8s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

//# sourceURL=/Users/Marvin/.atom/packages/autocomplete-python/lib/provider.coffee
