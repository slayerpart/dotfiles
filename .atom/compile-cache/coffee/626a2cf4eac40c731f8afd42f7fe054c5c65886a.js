(function() {
  var AutoIndent, CompositeDisposable, INTERFILESAVETIME, LB, autoCompleteJSX, ttlGrammar;

  CompositeDisposable = require('atom').CompositeDisposable;

  autoCompleteJSX = require('./auto-complete-jsx');

  AutoIndent = require('./auto-indent');

  ttlGrammar = require('./create-ttl-grammar');

  INTERFILESAVETIME = 1000;

  LB = 'language-babel';

  module.exports = {
    config: require('./config'),
    activate: function(state) {
      if (this.transpiler == null) {
        this.transpiler = new (require('./transpiler'));
      }
      this.ttlGrammar = new ttlGrammar(true);
      this.disposable = new CompositeDisposable;
      this.textEditors = {};
      this.fileSaveTimes = {};
      this.disposable.add(atom.packages.onDidActivatePackage(this.isPackageCompatible));
      this.disposable.add(atom.project.onDidChangePaths((function(_this) {
        return function() {
          return _this.transpiler.stopUnusedTasks();
        };
      })(this)));
      return this.disposable.add(atom.workspace.observeTextEditors((function(_this) {
        return function(textEditor) {
          _this.textEditors[textEditor.id] = new CompositeDisposable;
          _this.textEditors[textEditor.id].add(textEditor.observeGrammar(function(grammar) {
            var _ref, _ref1, _ref2;
            if (textEditor.getGrammar().packageName === LB) {
              return _this.textEditors[textEditor.id].autoIndent = new AutoIndent(textEditor);
            } else {
              if ((_ref = _this.textEditors[textEditor.id]) != null) {
                if ((_ref1 = _ref.autoIndent) != null) {
                  _ref1.destroy();
                }
              }
              return delete (((_ref2 = _this.textEditors[textEditor.id]) != null ? _ref2.autoIndent : void 0) != null);
            }
          }));
          _this.textEditors[textEditor.id].add(textEditor.onDidSave(function(event) {
            var filePath, lastSaveTime, _ref;
            if (textEditor.getGrammar().packageName === LB) {
              filePath = textEditor.getPath();
              lastSaveTime = (_ref = _this.fileSaveTimes[filePath]) != null ? _ref : 0;
              _this.fileSaveTimes[filePath] = Date.now();
              if (lastSaveTime < (_this.fileSaveTimes[filePath] - INTERFILESAVETIME)) {
                return _this.transpiler.transpile(filePath, textEditor);
              }
            }
          }));
          return _this.textEditors[textEditor.id].add(textEditor.onDidDestroy(function() {
            var filePath, _ref, _ref1, _ref2;
            if ((_ref = _this.textEditors[textEditor.id]) != null) {
              if ((_ref1 = _ref.autoIndent) != null) {
                _ref1.destroy();
              }
            }
            delete (((_ref2 = _this.textEditors[textEditor.id]) != null ? _ref2.autoIndent : void 0) != null);
            filePath = textEditor.getPath();
            if (_this.fileSaveTimes[filePath] != null) {
              delete _this.fileSaveTimes[filePath];
            }
            _this.textEditors[textEditor.id].dispose();
            return delete _this.textEditors[textEditor.id];
          }));
        };
      })(this)));
    },
    deactivate: function() {
      var disposeable, id, _ref;
      this.disposable.dispose();
      _ref = this.textEditors;
      for (id in _ref) {
        disposeable = _ref[id];
        if (this.textEditors[id].autoIndent != null) {
          this.textEditors[id].autoIndent.destroy();
          delete this.textEditors[id].autoIndent;
        }
        disposeable.dispose();
      }
      this.transpiler.stopAllTranspilerTask();
      this.transpiler.disposables.dispose();
      return this.ttlGrammar.destroy();
    },
    isPackageCompatible: function(activatedPackage) {
      var incompatiblePackage, incompatiblePackages, reason, _results;
      incompatiblePackages = {
        'source-preview-babel': "Both vie to preview the same file.",
        'source-preview-react': "Both vie to preview the same file.",
        'react': "The Atom community package 'react' (not to be confused \nwith Facebook React) monkey patches the atom methods \nthat provide autoindent features for JSX. \nAs it detects JSX scopes without regard to the grammar being used, \nit tries to auto indent JSX that is highlighted by language-babel. \nAs language-babel also attempts to do auto indentation using \nstandard atom API's, this creates a potential conflict."
      };
      _results = [];
      for (incompatiblePackage in incompatiblePackages) {
        reason = incompatiblePackages[incompatiblePackage];
        if (activatedPackage.name === incompatiblePackage) {
          _results.push(atom.notifications.addInfo('Incompatible Package Detected', {
            dismissable: true,
            detail: "language-babel has detected the presence of an incompatible Atom package named '" + activatedPackage.name + "'. \n \nIt is recommended that you disable either '" + activatedPackage.name + "' or language-babel \n \nReason:\n \n" + reason
          }));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    },
    JSXCompleteProvider: function() {
      return autoCompleteJSX;
    },
    provide: function() {
      return this.transpiler;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL01hcnZpbi8uYXRvbS9wYWNrYWdlcy9sYW5ndWFnZS1iYWJlbC9saWIvbWFpbi5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsbUZBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUNBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLHFCQUFSLENBRGxCLENBQUE7O0FBQUEsRUFFQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGVBQVIsQ0FGYixDQUFBOztBQUFBLEVBR0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxzQkFBUixDQUhiLENBQUE7O0FBQUEsRUFLQSxpQkFBQSxHQUFvQixJQUxwQixDQUFBOztBQUFBLEVBTUEsRUFBQSxHQUFLLGdCQU5MLENBQUE7O0FBQUEsRUFRQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxNQUFBLEVBQVEsT0FBQSxDQUFRLFVBQVIsQ0FBUjtBQUFBLElBRUEsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBOztRQUNSLElBQUMsQ0FBQSxhQUFjLEdBQUEsQ0FBQSxDQUFLLE9BQUEsQ0FBUSxjQUFSLENBQUQ7T0FBbkI7QUFBQSxNQUNBLElBQUMsQ0FBQSxVQUFELEdBQWtCLElBQUEsVUFBQSxDQUFXLElBQVgsQ0FEbEIsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLFVBQUQsR0FBYyxHQUFBLENBQUEsbUJBSGQsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLFdBQUQsR0FBZSxFQUpmLENBQUE7QUFBQSxNQUtBLElBQUMsQ0FBQSxhQUFELEdBQWlCLEVBTGpCLENBQUE7QUFBQSxNQU9BLElBQUMsQ0FBQSxVQUFVLENBQUMsR0FBWixDQUFnQixJQUFJLENBQUMsUUFBUSxDQUFDLG9CQUFkLENBQW1DLElBQUMsQ0FBQSxtQkFBcEMs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

//# sourceURL=/Users/Marvin/.atom/packages/language-babel/lib/main.coffee
