(function() {
  var CommandContext, Emitter, Runtime, _;

  CommandContext = require('./command-context');

  _ = require('underscore');

  Emitter = require('atom').Emitter;

  module.exports = Runtime = (function() {
    Runtime.prototype.observers = [];

    function Runtime(runner, codeContextBuilder, observers, emitter) {
      this.runner = runner;
      this.codeContextBuilder = codeContextBuilder;
      this.observers = observers != null ? observers : [];
      this.emitter = emitter != null ? emitter : new Emitter;
      this.scriptOptions = this.runner.scriptOptions;
      _.each(this.observers, (function(_this) {
        return function(observer) {
          return observer.observe(_this);
        };
      })(this));
    }

    Runtime.prototype.addObserver = function(observer) {
      this.observers.push(observer);
      return observer.observe(this);
    };

    Runtime.prototype.destroy = function() {
      this.stop();
      this.runner.destroy();
      _.each(this.observers, (function(_this) {
        return function(observer) {
          return observer.destroy();
        };
      })(this));
      this.emitter.dispose();
      return this.codeContextBuilder.destroy();
    };

    Runtime.prototype.execute = function(argType, input) {
      var codeContext, commandContext;
      if (argType == null) {
        argType = "Selection Based";
      }
      if (input == null) {
        input = null;
      }
      this.emitter.emit('did-execute-start');
      codeContext = this.codeContextBuilder.buildCodeContext(atom.workspace.getActiveTextEditor(), argType);
      if (codeContext.lang == null) {
        return;
      }
      commandContext = CommandContext.build(this, this.scriptOptions, codeContext);
      if (!commandContext) {
        return;
      }
      this.emitter.emit('did-context-create', {
        lang: codeContext.lang,
        filename: codeContext.filename,
        lineNumber: codeContext.lineNumber
      });
      return this.runner.run(commandContext.command, commandContext.args, codeContext, input);
    };

    Runtime.prototype.stop = function() {
      return this.runner.stop();
    };

    Runtime.prototype.onDidExecuteStart = function(callback) {
      return this.emitter.on('did-execute-start', callback);
    };

    Runtime.prototype.onDidNotSpecifyLanguage = function(callback) {
      return this.codeContextBuilder.onDidNotSpecifyLanguage(callback);
    };

    Runtime.prototype.onDidNotSupportLanguage = function(callback) {
      return this.codeContextBuilder.onDidNotSupportLanguage(callback);
    };

    Runtime.prototype.onDidNotSupportMode = function(callback) {
      return this.emitter.on('did-not-support-mode', callback);
    };

    Runtime.prototype.onDidNotBuildArgs = function(callback) {
      return this.emitter.on('did-not-build-args', callback);
    };

    Runtime.prototype.onDidContextCreate = function(callback) {
      return this.emitter.on('did-context-create', callback);
    };

    Runtime.prototype.onDidWriteToStdout = function(callback) {
      return this.runner.onDidWriteToStdout(callback);
    };

    Runtime.prototype.onDidWriteToStderr = function(callback) {
      return this.runner.onDidWriteToStderr(callback);
    };

    Runtime.prototype.onDidExit = function(callback) {
      return this.runner.onDidExit(callback);
    };

    Runtime.prototype.onDidNotRun = function(callback) {
      return this.runner.onDidNotRun(callback);
    };

    Runtime.prototype.modeNotSupported = function(argType, lang) {
      return this.emitter.emit('did-not-support-mode', {
        argType: argType,
        lang: lang
      });
    };

    Runtime.prototype.didNotBuildArgs = function(error) {
      return this.emitter.emit('did-not-build-args', {
        error: error
      });
    };

    return Runtime;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL01hcnZpbi8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL3J1bnRpbWUuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1DQUFBOztBQUFBLEVBQUEsY0FBQSxHQUFpQixPQUFBLENBQVEsbUJBQVIsQ0FBakIsQ0FBQTs7QUFBQSxFQUVBLENBQUEsR0FBSSxPQUFBLENBQVEsWUFBUixDQUZKLENBQUE7O0FBQUEsRUFJQyxVQUFXLE9BQUEsQ0FBUSxNQUFSLEVBQVgsT0FKRCxDQUFBOztBQUFBLEVBTUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLHNCQUFBLFNBQUEsR0FBVyxFQUFYLENBQUE7O0FBS2EsSUFBQSxpQkFBRSxNQUFGLEVBQVcsa0JBQVgsRUFBZ0MsU0FBaEMsRUFBaUQsT0FBakQsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLFNBQUEsTUFDYixDQUFBO0FBQUEsTUFEcUIsSUFBQyxDQUFBLHFCQUFBLGtCQUN0QixDQUFBO0FBQUEsTUFEMEMsSUFBQyxDQUFBLGdDQUFBLFlBQVksRUFDdkQsQ0FBQTtBQUFBLE1BRDJELElBQUMsQ0FBQSw0QkFBQSxVQUFVLEdBQUEsQ0FBQSxPQUN0RSxDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsYUFBRCxHQUFpQixJQUFDLENBQUEsTUFBTSxDQUFDLGFBQXpCLENBQUE7QUFBQSxNQUNBLENBQUMsQ0FBQyxJQUFGLENBQU8sSUFBQyxDQUFBLFNBQVIsRUFBbUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsUUFBRCxHQUFBO2lCQUFjLFFBQVEsQ0FBQyxPQUFULENBQWlCLEtBQWpCLEVBQWQ7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFuQixDQURBLENBRFc7SUFBQSxDQUxiOztBQUFBLHNCQWVBLFdBQUEsR0FBYSxTQUFDLFFB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

//# sourceURL=/Users/Marvin/.atom/packages/script/lib/runtime.coffee
