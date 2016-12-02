(function() {
  var $, $$, Breakpoint, BreakpointStore, CompositeDisposable, Disposable, Point, PythonDebuggerView, TextEditorView, View, fs, path, spawn, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require("atom"), Point = _ref.Point, Disposable = _ref.Disposable, CompositeDisposable = _ref.CompositeDisposable;

  _ref1 = require("atom-space-pen-views"), $ = _ref1.$, $$ = _ref1.$$, View = _ref1.View, TextEditorView = _ref1.TextEditorView;

  Breakpoint = require("./breakpoint");

  BreakpointStore = require("./breakpoint-store");

  spawn = require("child_process").spawn;

  path = require("path");

  fs = require("fs");

  module.exports = PythonDebuggerView = (function(_super) {
    __extends(PythonDebuggerView, _super);

    function PythonDebuggerView() {
      return PythonDebuggerView.__super__.constructor.apply(this, arguments);
    }

    PythonDebuggerView.prototype.debuggedFileName = null;

    PythonDebuggerView.prototype.debuggedFileArgs = [];

    PythonDebuggerView.prototype.backendDebuggerPath = null;

    PythonDebuggerView.prototype.backendDebuggerName = "atom_pdb.py";

    PythonDebuggerView.prototype.getCurrentFilePath = function() {
      var editor, file;
      editor = atom.workspace.getActivePaneItem();
      file = editor != null ? editor.buffer.file : void 0;
      return file != null ? file.path : void 0;
    };

    PythonDebuggerView.prototype.getDebuggerPath = function() {
      var debuggerPath, pkgs;
      pkgs = atom.packages.getPackageDirPaths()[0];
      debuggerPath = path.join(pkgs, "python-debugger", "resources");
      return debuggerPath;
    };

    PythonDebuggerView.content = function() {
      return this.div({
        "class": "pythonDebuggerView"
      }, (function(_this) {
        return function() {
          _this.subview("argsEntryView", new TextEditorView({
            mini: true,
            placeholderText: "> Enter input arguments here"
          }));
          _this.subview("commandEntryView", new TextEditorView({
            mini: true,
            placeholderText: "> Enter debugger commands here"
          }));
          _this.button({
            outlet: "runBtn",
            click: "runApp",
            "class": "btn"
          }, function() {
            return _this.span("run");
          });
          _this.button({
            outlet: "stopBtn",
            click: "stopApp",
            "class": "btn"
          }, function() {
            return _this.span("stop");
          });
          _this.button({
            outlet: "clearBtn",
            click: "clearOutput",
            "class": "btn"
          }, function() {
            return _this.span("clear");
          });
          _this.button({
            outlet: "stepOverBtn",
            click: "stepOverBtnPressed",
            "class": "btn"
          }, function() {
            return _this.span("next");
          });
          _this.button({
            outlet: "stepInBtn",
            click: "stepInBtnPressed",
            "class": "btn"
          }, function() {
            return _this.span("step");
          });
          _this.button({
            outlet: "continueBtn",
            click: "continueBtnPressed",
            "class": "btn"
          }, function() {
            return _this.span("continue");
          });
          _this.button({
            outlet: "returnBtn",
            click: "returnBtnPressed",
            "class": "btn"
          }, function() {
            return _this.span("return");
          });
          return _this.div({
            "class": "panel-body",
            outlet: "outputContainer"
          }, function() {
            return _this.pre({
              "class": "command-output",
              outlet: "output"
            });
          });
        };
      })(this));
    };

    PythonDebuggerView.prototype.stepOverBtnPressed = function() {
      var _ref2;
      return (_ref2 = this.backendDebugger) != null ? _ref2.stdin.write("n\n") : void 0;
    };

    PythonDebuggerView.prototype.stepInBtnPressed = function() {
      var _ref2;
      return (_ref2 = this.backendDebugger) != null ? _ref2.stdin.write("s\n") : void 0;
    };

    PythonDebuggerView.prototype.continueBtnPressed = function() {
      var _ref2;
      return (_ref2 = this.backendDebugger) != null ? _ref2.stdin.write("c\n") : void 0;
    };

    PythonDebuggerView.prototype.returnBtnPressed = function() {
      var _ref2;
      return (_ref2 = this.backendDebugger) != null ? _ref2.stdin.write("r\n") : void 0;
    };

    PythonDebuggerView.prototype.workspacePath = function() {
      var activePath, editor, pathToWorkspace, relative;
      editor = atom.workspace.getActiveTextEditor();
      activePath = editor.getPath();
      relative = atom.project.relativizePath(activePath);
      pathToWorkspace = relative[0] || path.dirname(activePath);
      return pathToWorkspace;
    };

    PythonDebuggerView.prototype.runApp = function() {
      if (this.backendDebugger) {
        this.stopApp();
      }
      this.debuggedFileArgs = this.getInputArguments();
      console.log(this.debuggedFileArgs);
      if (this.pathsNotSet()) {
        this.askForPaths();
        return;
      }
      return this.runBackendDebugger();
    };

    PythonDebuggerView.prototype.processDebuggerOutput = function(data) {
      var data_str, fileName, lineNumber, options, tail, _ref2, _ref3, _ref4, _ref5;
      data_str = data.toString().trim();
      lineNumber = null;
      fileName = null;
      _ref2 = data_str.split("line:: "), data_str = _ref2[0], tail = _ref2[1];
      if (tail) {
        _ref3 = tail.split("\n"), lineNumber = _ref3[0], tail = _ref3[1];
        if (tail) {
          data_str = data_str + tail;
        }
      }
      _ref4 = data_str.split("file:: "), data_str = _ref4[0], tail = _ref4[1];
      if (tail) {
        _ref5 = tail.split("\n"), fileName = _ref5[0], tail = _ref5[1];
        if (tail) {
          data_str = data_str + tail;
        }
        if (fileName) {
          fileName = fileName.trim();
        }
        if (fileName === "<string>") {
          fileName = null;
        }
      }
      if (lineNumber && fileName) {
        lineNumber = parseInt(lineNumber);
        options = {
          initialLine: lineNumber - 1,
          initialColumn: 0
        };
        if (fs.existsSync(fileName)) {
          atom.workspace.open(fileName, options);
        }
      }
      return this.addOutput(data_str.trim());
    };

    PythonDebuggerView.prototype.runBackendDebugger = function() {
      var arg, args, breakpoint, python, _i, _j, _len, _len1, _ref2, _ref3;
      args = [path.join(this.backendDebuggerPath, this.backendDebuggerName)];
      args.push(this.debuggedFileName);
      _ref2 = this.debuggedFileArgs;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        arg = _ref2[_i];
        args.push(arg);
      }
      python = atom.config.get("python-debugger.pythonExecutable");
      console.log("python-debugger: using", python);
      this.backendDebugger = spawn(python, args);
      _ref3 = this.breakpointStore.breakpoints;
      for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
        breakpoint = _ref3[_j];
        this.backendDebugger.stdin.write(breakpoint.toCommand() + "\n");
      }
      if (this.breakpointStore.breakpoints.length > 0) {
        this.backendDebugger.stdin.write("c\n");
      }
      this.backendDebugger.stdout.on("data", (function(_this) {
        return function(data) {
          return _this.processDebuggerOutput(data);
        };
      })(this));
      this.backendDebugger.stderr.on("data", (function(_this) {
        return function(data) {
          return _this.processDebuggerOutput(data);
        };
      })(this));
      return this.backendDebugger.on("exit", (function(_this) {
        return function(code) {
          return _this.addOutput("debugger exits with code: " + code.toString().trim());
        };
      })(this));
    };

    PythonDebuggerView.prototype.stopApp = function() {
      var _ref2;
      if ((_ref2 = this.backendDebugger) != null) {
        _ref2.stdin.write("\nexit()\n");
      }
      this.backendDebugger = null;
      return console.log("debugger stopped");
    };

    PythonDebuggerView.prototype.clearOutput = function() {
      return this.output.empty();
    };

    PythonDebuggerView.prototype.createOutputNode = function(text) {
      var node, parent;
      node = $("<span />").text(text);
      return parent = $("<span />").append(node);
    };

    PythonDebuggerView.prototype.addOutput = function(data) {
      var atBottom, node;
      atBottom = this.atBottomOfOutput();
      node = this.createOutputNode(data);
      this.output.append(node);
      this.output.append("\n");
      if (atBottom) {
        return this.scrollToBottomOfOutput();
      }
    };

    PythonDebuggerView.prototype.pathsNotSet = function() {
      return !this.debuggedFileName;
    };

    PythonDebuggerView.prototype.askForPaths = function() {
      return this.addOutput("To use a different entry point, set file to debug using e=fileName");
    };

    PythonDebuggerView.prototype.initialize = function(breakpointStore) {
      this.breakpointStore = breakpointStore;
      this.debuggedFileName = this.getCurrentFilePath();
      this.backendDebuggerPath = this.getDebuggerPath();
      this.addOutput("Welcome to Python Debugger for Atom!");
      this.addOutput("The file being debugged is: " + this.debuggedFileName);
      this.askForPaths();
      return this.subscriptions = atom.commands.add(this.element, {
        "core:confirm": (function(_this) {
          return function(event) {
            if (_this.parseAndSetPaths()) {
              _this.clearInputText();
            } else {
              _this.confirmBackendDebuggerCommand();
            }
            return event.stopPropagation();
          };
        })(this),
        "core:cancel": (function(_this) {
          return function(event) {
            _this.cancelBackendDebuggerCommand();
            return event.stopPropagation();
          };
        })(this)
      });
    };

    PythonDebuggerView.prototype.parseAndSetPaths = function() {
      var command, match;
      command = this.getCommand();
      if (!command) {
        return false;
      }
      if (/e=(.*)/.test(command)) {
        match = /e=(.*)/.exec(command);
        this.debuggedFileName = match[1];
        this.addOutput("The file being debugged is: " + this.debuggedFileName);
        return true;
      }
      return false;
    };

    PythonDebuggerView.prototype.stringIsBlank = function(str) {
      return !str || /^\s*$/.test(str);
    };

    PythonDebuggerView.prototype.escapeString = function(str) {
      return !str || str.replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
    };

    PythonDebuggerView.prototype.getInputArguments = function() {
      var args;
      args = this.argsEntryView.getModel().getText();
      if (!this.stringIsBlank(args)) {
        return args.split(" ");
      } else {
        return [];
      }
    };

    PythonDebuggerView.prototype.getCommand = function() {
      var command;
      command = this.commandEntryView.getModel().getText();
      if (!this.stringIsBlank(command)) {
        return command;
      }
    };

    PythonDebuggerView.prototype.cancelBackendDebuggerCommand = function() {
      return this.commandEntryView.getModel().setText("");
    };

    PythonDebuggerView.prototype.confirmBackendDebuggerCommand = function() {
      var command;
      if (!this.backendDebugger) {
        this.addOutput("Program not running");
        return;
      }
      command = this.getCommand();
      if (command) {
        this.backendDebugger.stdin.write(command + "\n");
        return this.clearInputText();
      }
    };

    PythonDebuggerView.prototype.clearInputText = function() {
      return this.commandEntryView.getModel().setText("");
    };

    PythonDebuggerView.prototype.serialize = function() {
      var _ref2;
      return {
        attached: (_ref2 = this.panel) != null ? _ref2.isVisible() : void 0
      };
    };

    PythonDebuggerView.prototype.destroy = function() {
      return this.detach();
    };

    PythonDebuggerView.prototype.toggle = function() {
      var _ref2;
      if ((_ref2 = this.panel) != null ? _ref2.isVisible() : void 0) {
        return this.detach();
      } else {
        return this.attach();
      }
    };

    PythonDebuggerView.prototype.atBottomOfOutput = function() {
      return this.output[0].scrollHeight <= this.output.scrollTop() + this.output.outerHeight();
    };

    PythonDebuggerView.prototype.scrollToBottomOfOutput = function() {
      return this.output.scrollToBottom();
    };

    PythonDebuggerView.prototype.attach = function() {
      console.log("attached");
      this.panel = atom.workspace.addBottomPanel({
        item: this
      });
      this.panel.show();
      return this.scrollToBottomOfOutput();
    };

    PythonDebuggerView.prototype.detach = function() {
      console.log("detached");
      this.panel.destroy();
      return this.panel = null;
    };

    return PythonDebuggerView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL01hcnZpbi8uYXRvbS9wYWNrYWdlcy9weXRob24tZGVidWdnZXIvbGliL3B5dGhvbi1kZWJ1Z2dlci12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxrSkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsT0FBMkMsT0FBQSxDQUFRLE1BQVIsQ0FBM0MsRUFBQyxhQUFBLEtBQUQsRUFBUSxrQkFBQSxVQUFSLEVBQW9CLDJCQUFBLG1CQUFwQixDQUFBOztBQUFBLEVBQ0EsUUFBZ0MsT0FBQSxDQUFRLHNCQUFSLENBQWhDLEVBQUMsVUFBQSxDQUFELEVBQUksV0FBQSxFQUFKLEVBQVEsYUFBQSxJQUFSLEVBQWMsdUJBQUEsY0FEZCxDQUFBOztBQUFBLEVBRUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSLENBRmIsQ0FBQTs7QUFBQSxFQUdBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLG9CQUFSLENBSGxCLENBQUE7O0FBQUEsRUFLQSxLQUFBLEdBQVEsT0FBQSxDQUFRLGVBQVIsQ0FBd0IsQ0FBQyxLQUxqQyxDQUFBOztBQUFBLEVBTUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBTlAsQ0FBQTs7QUFBQSxFQU9BLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQVBMLENBQUE7O0FBQUEsRUFTQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0oseUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLGlDQUFBLGdCQUFBLEdBQWtCLElBQWxCLENBQUE7O0FBQUEsaUNBQ0EsZ0JBQUEsR0FBa0IsRUFEbEIsQ0FBQTs7QUFBQSxpQ0FFQSxtQkFBQSxHQUFxQixJQUZyQixDQUFBOztBQUFBLGlDQUdBLG1CQUFBLEdBQXFCLGFBSHJCLENBQUE7O0FBQUEsaUNBS0Esa0JBQUEsR0FBb0IsU0FBQSxHQUFBO0FBQ2xCLFVBQUEs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

//# sourceURL=/Users/Marvin/.atom/packages/python-debugger/lib/python-debugger-view.coffee
