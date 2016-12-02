(function() {
  var $$, AnsiFilter, BufferedProcess, CodeContext, CompositeDisposable, HeaderView, ScriptOptionsView, ScriptView, View, grammarMap, stripAnsi, _, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  grammarMap = require('./grammars');

  _ref = require('atom'), BufferedProcess = _ref.BufferedProcess, CompositeDisposable = _ref.CompositeDisposable;

  _ref1 = require('atom-space-pen-views'), View = _ref1.View, $$ = _ref1.$$;

  CodeContext = require('./code-context');

  HeaderView = require('./header-view');

  ScriptOptionsView = require('./script-options-view');

  AnsiFilter = require('ansi-to-html');

  stripAnsi = require('strip-ansi');

  _ = require('underscore');

  module.exports = ScriptView = (function(_super) {
    __extends(ScriptView, _super);

    function ScriptView() {
      return ScriptView.__super__.constructor.apply(this, arguments);
    }

    ScriptView.bufferedProcess = null;

    ScriptView.results = "";

    ScriptView.content = function() {
      return this.div((function(_this) {
        return function() {
          var css;
          _this.subview('headerView', new HeaderView());
          css = 'tool-panel panel panel-bottom padding script-view native-key-bindings';
          return _this.div({
            "class": css,
            outlet: 'script',
            tabindex: -1
          }, function() {
            return _this.div({
              "class": 'panel-body padded output',
              outlet: 'output'
            });
          });
        };
      })(this));
    };

    ScriptView.prototype.initialize = function(serializeState, runOptions) {
      this.runOptions = runOptions;
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'core:cancel': (function(_this) {
          return function() {
            return _this.close();
          };
        })(this),
        'core:close': (function(_this) {
          return function() {
            return _this.close();
          };
        })(this),
        'script:close-view': (function(_this) {
          return function() {
            return _this.close();
          };
        })(this),
        'script:copy-run-results': (function(_this) {
          return function() {
            return _this.copyResults();
          };
        })(this),
        'script:kill-process': (function(_this) {
          return function() {
            return _this.stop();
          };
        })(this),
        'script:run-by-line-number': (function(_this) {
          return function() {
            return _this.lineRun();
          };
        })(this),
        'script:run': (function(_this) {
          return function() {
            return _this.defaultRun();
          };
        })(this)
      }));
      return this.ansiFilter = new AnsiFilter;
    };

    ScriptView.prototype.serialize = function() {};

    ScriptView.prototype.updateOptions = function(event) {
      return this.runOptions = event.runOptions;
    };

    ScriptView.prototype.getShebang = function(editor) {
      var firstLine, lines, text;
      text = editor.getText();
      lines = text.split("\n");
      firstLine = lines[0];
      if (!firstLine.match(/^#!/)) {
        return;
      }
      return firstLine.replace(/^#!\s*/, '');
    };

    ScriptView.prototype.initCodeContext = function(editor) {
      var codeContext, filename, filepath, lang, selection, textSource;
      filename = editor.getTitle();
      filepath = editor.getPath();
      selection = editor.getLastSelection();
      if (selection.isEmpty()) {
        textSource = editor;
      } else {
        textSource = selection;
      }
      codeContext = new CodeContext(filename, filepath, textSource);
      codeContext.selection = selection;
      codeContext.shebang = this.getShebang(editor);
      lang = this.getLang(editor);
      if (this.validateLang(lang)) {
        codeContext.lang = lang;
      }
      return codeContext;
    };

    ScriptView.prototype.lineRun = function() {
      var codeContext;
      this.resetView();
      codeContext = this.buildCodeContext('Line Number Based');
      if (!(codeContext == null)) {
        return this.start(codeContext);
      }
    };

    ScriptView.prototype.defaultRun = function() {
      var codeContext;
      this.resetView();
      codeContext = this.buildCodeContext();
      if (!(codeContext == null)) {
        return this.start(codeContext);
      }
    };

    ScriptView.prototype.buildCodeContext = function(argType) {
      var codeContext, cursor, editor;
      if (argType == null) {
        argType = 'Selection Based';
      }
      editor = atom.workspace.getActiveTextEditor();
      if (editor == null) {
        return;
      }
      codeContext = this.initCodeContext(editor);
      codeContext.argType = argType;
      if (argType === 'Line Number Based') {
        editor.save();
      } else if (codeContext.selection.isEmpty() && (codeContext.filepath != null)) {
        codeContext.argType = 'File Based';
        editor.save();
      }
      if (argType !== 'File Based') {
        cursor = editor.getLastCursor();
        codeContext.lineNumber = cursor.getScreenRow() + 1;
      }
      return codeContext;
    };

    ScriptView.prototype.start = function(codeContext) {
      var commandContext;
      if (codeContext.lang == null) {
        return;
      }
      commandContext = this.setupRuntime(codeContext);
      if (commandContext) {
        return this.run(commandContext.command, commandContext.args, codeContext);
      }
    };

    ScriptView.prototype.resetView = function(title) {
      if (title == null) {
        title = 'Loading...';
      }
      if (!this.hasParent()) {
        atom.workspace.addBottomPanel({
          item: this
        });
      }
      this.stop();
      this.headerView.title.text(title);
      this.headerView.setStatus('start');
      this.output.empty();
      return this.results = "";
    };

    ScriptView.prototype.close = function() {
      var grandParent;
      this.stop();
      if (this.hasParent()) {
        grandParent = this.script.parent().parent();
        this.detach();
        return grandParent.remove();
      }
    };

    ScriptView.prototype.destroy = function() {
      var _ref2;
      return (_ref2 = this.subscriptions) != null ? _ref2.dispose() : void 0;
    };

    ScriptView.prototype.getLang = function(editor) {
      return editor.getGrammar().name;
    };

    ScriptView.prototype.validateLang = function(lang) {
      var err;
      err = null;
      if (lang === 'Null Grammar' || lang === 'Plain Text') {
        err = $$(function() {
          return this.p('You must select a language in the lower right, or save the file with an appropriate extension.');
        });
      } else if (!(lang in grammarMap)) {
        err = $$(function() {
          this.p({
            "class": 'block'
          }, "Command not configured for " + lang + "!");
          return this.p({
            "class": 'block'
          }, (function(_this) {
            return function() {
              _this.text('Add an ');
              _this.a({
                href: "https://github.com/rgbkrk/atom-script/issues/new?title=Add%20support%20for%20" + lang
              }, 'issue on GitHub');
              return _this.text(' or send your own Pull Request.');
            };
          })(this));
        });
      }
      if (err != null) {
        this.handleError(err);
        return false;
      }
      return true;
    };

    ScriptView.prototype.setupRuntime = function(codeContext) {
      var buildArgsArray, commandContext, err, error, errorSendByArgs;
      commandContext = {};
      try {
        if ((this.runOptions.cmd == null) || this.runOptions.cmd === '') {
          commandContext.command = codeContext.shebangCommand() || grammarMap[codeContext.lang][codeContext.argType].command;
        } else {
          commandContext.command = this.runOptions.cmd;
        }
        buildArgsArray = grammarMap[codeContext.lang][codeContext.argType].args;
      } catch (_error) {
        error = _error;
        err = this.createGitHubIssueLink(codeContext);
        this.handleError(err);
        return false;
      }
      if (codeContext.argType === 'Line Number Based') {
        this.headerView.title.text("" + codeContext.lang + " - " + (codeContext.fileColonLine(false)));
      } else {
        this.headerView.title.text("" + codeContext.lang + " - " + codeContext.filename);
      }
      try {
        commandContext.args = buildArgsArray(codeContext);
      } catch (_error) {
        errorSendByArgs = _error;
        this.handleError(errorSendByArgs);
        return false;
      }
      return commandContext;
    };

    ScriptView.prototype.createGitHubIssueLink = function(codeContext) {
      var body, encodedURI, title;
      title = "Add " + codeContext.argType + " support for " + codeContext.lang;
      body = "##### Platform: `" + process.platform + "`\n---";
      encodedURI = encodeURI("https://github.com/rgbkrk/atom-script/issues/new?title=" + title + "&body=" + body);
      encodedURI = encodedURI.replace(/#/g, '%23');
      return $$(function() {
        this.p({
          "class": 'block'
        }, "" + codeContext.argType + " runner not available for " + codeContext.lang + ".");
        return this.p({
          "class": 'block'
        }, (function(_this) {
          return function() {
            _this.text('If it should exist, add an ');
            _this.a({
              href: encodedURI
            }, 'issue on GitHub');
            return _this.text(', or send your own pull request.');
          };
        })(this));
      });
    };

    ScriptView.prototype.handleError = function(err) {
      this.headerView.title.text('Error');
      this.headerView.setStatus('err');
      this.output.append(err);
      return this.stop();
    };

    ScriptView.prototype.run = function(command, extraArgs, codeContext) {
      var args, exit, options, startTime, stderr, stdout;
      startTime = new Date();
      options = {
        cwd: this.getCwd(),
        env: this.runOptions.mergedEnv(process.env)
      };
      args = (this.runOptions.cmdArgs.concat(extraArgs)).concat(this.runOptions.scriptArgs);
      if ((this.runOptions.cmd == null) || this.runOptions.cmd === '') {
        args = codeContext.shebangCommandArgs().concat(args);
      }
      stdout = (function(_this) {
        return function(output) {
          return _this.display('stdout', output);
        };
      })(this);
      stderr = (function(_this) {
        return function(output) {
          return _this.display('stderr', output);
        };
      })(this);
      exit = (function(_this) {
        return function(returnCode) {
          var executionTime;
          _this.bufferedProcess = null;
          if ((atom.config.get('script.enableExecTime')) === true) {
            executionTime = (new Date().getTime() - startTime.getTime()) / 1000;
            _this.display('stdout', '[Finished in ' + executionTime.toString() + 's]');
          }
          if (returnCode === 0) {
            _this.headerView.setStatus('stop');
          } else {
            _this.headerView.setStatus('err');
          }
          return console.log("Exited with " + returnCode);
        };
      })(this);
      this.bufferedProcess = new BufferedProcess({
        command: command,
        args: args,
        options: options,
        stdout: stdout,
        stderr: stderr,
        exit: exit
      });
      return this.bufferedProcess.onWillThrowError((function(_this) {
        return function(nodeError) {
          _this.bufferedProcess = null;
          _this.output.append($$(function() {
            this.h1('Unable to run');
            this.pre(_.escape(command));
            this.h2('Is it in your PATH?');
            return this.pre("PATH: " + (_.escape(process.env.PATH)));
          }));
          return nodeError.handle();
        };
      })(this));
    };

    ScriptView.prototype.getCwd = function() {
      var cwd, paths, workingDirectoryProvided;
      cwd = this.runOptions.workingDirectory;
      workingDirectoryProvided = (cwd != null) && cwd !== '';
      paths = atom.project.getPaths();
      if (!workingDirectoryProvided && (paths != null ? paths.length : void 0) > 0) {
        cwd = paths[0];
      }
      return cwd;
    };

    ScriptView.prototype.stop = function() {
      if (this.bufferedProcess != null) {
        this.display('stdout', '^C');
        this.headerView.setStatus('kill');
        this.bufferedProcess.kill();
        return this.bufferedProcess = null;
      }
    };

    ScriptView.prototype.display = function(css, line) {
      var lessThanFull, padding, scrolledToEnd;
      this.results += line;
      if (atom.config.get('script.escapeConsoleOutput')) {
        line = _.escape(line);
      }
      line = this.ansiFilter.toHtml(line);
      padding = parseInt(this.output.css('padding-bottom'));
      scrolledToEnd = this.script.scrollBottom() === (padding + this.output.trueHeight());
      lessThanFull = this.output.trueHeight() <= this.script.trueHeight();
      this.output.append($$(function() {
        return this.pre({
          "class": "line " + css
        }, (function(_this) {
          return function() {
            return _this.raw(line);
          };
        })(this));
      }));
      if (atom.config.get('script.scrollWithOutput')) {
        if (lessThanFull || scrolledToEnd) {
          return this.checkScrollAgain(5)();
        }
      }
    };

    ScriptView.prototype.scrollTimeout = null;

    ScriptView.prototype.checkScrollAgain = function(times) {
      return (function(_this) {
        return function() {
          _this.script.scrollToBottom();
          clearTimeout(_this.scrollTimeout);
          if (times > 1) {
            return _this.scrollTimeout = setTimeout(_this.checkScrollAgain(times - 1), 50);
          }
        };
      })(this);
    };

    ScriptView.prototype.copyResults = function() {
      if (this.results) {
        return atom.clipboard.write(stripAnsi(this.results));
      }
    };

    return ScriptView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL01hcnZpbi8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL3NjcmlwdC12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx5SkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxZQUFSLENBQWIsQ0FBQTs7QUFBQSxFQUVBLE9BQXlDLE9BQUEsQ0FBUSxNQUFSLENBQXpDLEVBQUMsdUJBQUEsZUFBRCxFQUFrQiwyQkFBQSxtQkFGbEIsQ0FBQTs7QUFBQSxFQUdBLFFBQWEsT0FBQSxDQUFRLHNCQUFSLENBQWIsRUFBQyxhQUFBLElBQUQsRUFBTyxXQUFBLEVBSFAsQ0FBQTs7QUFBQSxFQUlBLFdBQUEsR0FBYyxPQUFBLENBQVEsZ0JBQVIsQ0FKZCxDQUFBOztBQUFBLEVBS0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxlQUFSLENBTGIsQ0FBQTs7QUFBQSxFQU1BLGlCQUFBLEdBQW9CLE9BQUEsQ0FBUSx1QkFBUixDQU5wQixDQUFBOztBQUFBLEVBT0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSLENBUGIsQ0FBQTs7QUFBQSxFQVFBLFNBQUEsR0FBWSxPQUFBLENBQVEsWUFBUixDQVJaLENBQUE7O0FBQUEsRUFTQSxDQUFBLEdBQUksT0FBQSxDQUFRLFlBQVIsQ0FUSixDQUFBOztBQUFBLEVBWUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLGlDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLFVBQUMsQ0FBQSxlQUFELEdBQWtCLElBQWxCLENBQUE7O0FBQUEsSUFDQSxVQUFDLENBQUEsT0FBRCxHQUFVLEVBRFYsQ0FBQTs7QUFBQSxJQUdBLFVBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSyxDQUFBLFNBQUEsS0FBQSxHQUFB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

//# sourceURL=/Users/Marvin/.atom/packages/script/lib/script-view.coffee
