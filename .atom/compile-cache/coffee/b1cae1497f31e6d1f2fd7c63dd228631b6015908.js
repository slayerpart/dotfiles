(function() {
  var CodeContextBuilder, CompositeDisposable, GrammarUtils, Runner, Runtime, ScriptOptions, ScriptOptionsView, ScriptView, ViewRuntimeObserver;

  CodeContextBuilder = require('./code-context-builder');

  GrammarUtils = require('./grammar-utils');

  Runner = require('./runner');

  Runtime = require('./runtime');

  ScriptOptions = require('./script-options');

  ScriptOptionsView = require('./script-options-view');

  ScriptView = require('./script-view');

  ViewRuntimeObserver = require('./view-runtime-observer');

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = {
    config: {
      enableExecTime: {
        title: 'Output the time it took to execute the script',
        type: 'boolean',
        "default": true
      },
      escapeConsoleOutput: {
        title: 'HTML escape console output',
        type: 'boolean',
        "default": true
      },
      scrollWithOutput: {
        title: 'Scroll with output',
        type: 'boolean',
        "default": true
      }
    },
    scriptView: null,
    scriptOptionsView: null,
    scriptOptions: null,
    activate: function(state) {
      var codeContextBuilder, observer, runner;
      this.scriptView = new ScriptView(state.scriptViewState);
      this.scriptOptions = new ScriptOptions();
      this.scriptOptionsView = new ScriptOptionsView(this.scriptOptions);
      codeContextBuilder = new CodeContextBuilder;
      runner = new Runner(this.scriptOptions);
      observer = new ViewRuntimeObserver(this.scriptView);
      this.runtime = new Runtime(runner, codeContextBuilder, [observer]);
      this.subscriptions = new CompositeDisposable;
      return this.subscriptions.add(atom.commands.add('atom-workspace', {
        'core:cancel': (function(_this) {
          return function() {
            return _this.closeScriptViewAndStopRunner();
          };
        })(this),
        'core:close': (function(_this) {
          return function() {
            return _this.closeScriptViewAndStopRunner();
          };
        })(this),
        'script:close-view': (function(_this) {
          return function() {
            return _this.closeScriptViewAndStopRunner();
          };
        })(this),
        'script:copy-run-results': (function(_this) {
          return function() {
            return _this.scriptView.copyResults();
          };
        })(this),
        'script:kill-process': (function(_this) {
          return function() {
            return _this.runtime.stop();
          };
        })(this),
        'script:run-by-line-number': (function(_this) {
          return function() {
            return _this.runtime.execute('Line Number Based');
          };
        })(this),
        'script:run': (function(_this) {
          return function() {
            return _this.runtime.execute('Selection Based');
          };
        })(this)
      }));
    },
    deactivate: function() {
      this.runtime.destroy();
      this.scriptView.close();
      this.scriptOptionsView.close();
      this.subscriptions.dispose();
      return GrammarUtils.deleteTempFiles();
    },
    closeScriptViewAndStopRunner: function() {
      this.runtime.stop();
      return this.scriptView.close();
    },
    provideDefaultRuntime: function() {
      return this.runtime;
    },
    provideBlankRuntime: function() {
      var codeContextBuilder, runner;
      runner = new Runner(new ScriptOptions);
      codeContextBuilder = new CodeContextBuilder;
      return new Runtime(runner, codeContextBuilder, []);
    },
    serialize: function() {
      return {
        scriptViewState: this.scriptView.serialize(),
        scriptOptionsViewState: this.scriptOptionsView.serialize()
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL01hcnZpbi8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL3NjcmlwdC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEseUlBQUE7O0FBQUEsRUFBQSxrQkFBQSxHQUFxQixPQUFBLENBQVEsd0JBQVIsQ0FBckIsQ0FBQTs7QUFBQSxFQUNBLFlBQUEsR0FBZSxPQUFBLENBQVEsaUJBQVIsQ0FEZixDQUFBOztBQUFBLEVBRUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSLENBRlQsQ0FBQTs7QUFBQSxFQUdBLE9BQUEsR0FBVSxPQUFBLENBQVEsV0FBUixDQUhWLENBQUE7O0FBQUEsRUFJQSxhQUFBLEdBQWdCLE9BQUEsQ0FBUSxrQkFBUixDQUpoQixDQUFBOztBQUFBLEVBS0EsaUJBQUEsR0FBb0IsT0FBQSxDQUFRLHVCQUFSLENBTHBCLENBQUE7O0FBQUEsRUFNQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGVBQVIsQ0FOYixDQUFBOztBQUFBLEVBT0EsbUJBQUEsR0FBc0IsT0FBQSxDQUFRLHlCQUFSLENBUHRCLENBQUE7O0FBQUEsRUFTQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBVEQsQ0FBQTs7QUFBQSxFQVdBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLE1BQUEsRUFDRTtBQUFBLE1BQUEsY0FBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sK0NBQVA7QUFBQSxRQUNBLElBQUEsRUFBTSxTQUROO0FBQUEsUUFFQSxTQUFBLEVBQVMsSUFGVDtPQURGO0FBQUEsTUFJQSxtQkFBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sNEJBQVA7QUFBQSxRQUNBLElBQUEsRUFBTSxTQUROO0FBQUEsUUFFQSxTQUFBLEVBQVMsSUFGVDtPQUxGO0FBQUEsTUFRQSxnQkFBQSxFQUNFO0FBQUEsUUFB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

//# sourceURL=/Users/Marvin/.atom/packages/script/lib/script.coffee
