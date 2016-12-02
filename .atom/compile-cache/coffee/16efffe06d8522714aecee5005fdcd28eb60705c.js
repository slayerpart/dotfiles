(function() {
  var GrammarUtils, ScriptOptions, ScriptOptionsView, ScriptView;

  ScriptView = require('./script-view');

  ScriptOptionsView = require('./script-options-view');

  ScriptOptions = require('./script-options');

  GrammarUtils = require('./grammar-utils');

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
      this.scriptOptions = new ScriptOptions();
      this.scriptView = new ScriptView(state.scriptViewState, this.scriptOptions);
      return this.scriptOptionsView = new ScriptOptionsView(this.scriptOptions);
    },
    deactivate: function() {
      GrammarUtils.deleteTempFiles();
      this.scriptView.close();
      return this.scriptOptionsView.close();
    },
    serialize: function() {
      return {
        scriptViewState: this.scriptView.serialize(),
        scriptOptionsViewState: this.scriptOptionsView.serialize()
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL01hcnZpbi8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL3NjcmlwdC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsMERBQUE7O0FBQUEsRUFBQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGVBQVIsQ0FBYixDQUFBOztBQUFBLEVBQ0EsaUJBQUEsR0FBb0IsT0FBQSxDQUFRLHVCQUFSLENBRHBCLENBQUE7O0FBQUEsRUFFQSxhQUFBLEdBQWdCLE9BQUEsQ0FBUSxrQkFBUixDQUZoQixDQUFBOztBQUFBLEVBR0EsWUFBQSxHQUFlLE9BQUEsQ0FBUSxpQkFBUixDQUhmLENBQUE7O0FBQUEsRUFLQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLGNBQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLCtDQUFQO0FBQUEsUUFDQSxJQUFBLEVBQU0sU0FETjtBQUFBLFFBRUEsU0FBQSxFQUFTLElBRlQ7T0FERjtBQUFBLE1BSUEsbUJBQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLDRCQUFQO0FBQUEsUUFDQSxJQUFBLEVBQU0sU0FETjtBQUFBLFFBRUEsU0FBQSxFQUFTLElBRlQ7T0FMRjtBQUFBLE1BUUEsZ0JBQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLG9CQUFQO0FBQUEsUUFDQSxJQUFBLEVBQU0sU0FETjtBQUFBLFFBRUEsU0FBQSxFQUFTLElBRlQ7T0FURjtLQURGO0FBQUEsSUFhQSxVQUFBLEVBQVksSUFiWjtBQUFBLElBY0EsaUJBQUEsRUFBbUIsSUFkbkI7QUFBQSxJQWVBLGFBQUEsRUFBZSxJQWZmO0FBQUEsSUFpQkEsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBO0FBQ1IsTUFBQSxJQUFDLENBQUEsYUFBRCxHQUFxQixJQUFBLGFBQUEsQ0FBQSxDQUFyQixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsVUFBRCxHQUFrQixJQUFBLFVBQUEsQ0FBVyxLQUFLLENBQUMsZUFBakIsRUFBa0MsSUFBQyxDQUFBLGFBQW5DLENBRGxCLENBQUE7YUFFQSxJQUFDLENBQUEsaUJBQUQsR0FBeUIsSUFBQSxpQkFBQSxDQUFrQixJQUFDLENBQUEsYUFBbkIsRUFIakI7SUFBQSxDQWpCVjtBQUFBLElBc0JBLFVBQUEsRUFBWSxTQUFBLEdBQUE7QUFDVixNQUFBLFlBQVksQ0FBQyxlQUFiLENBQUEsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsVUFBVSxDQUFDLEtBQVosQ0FBQSxDQURBLENBQUE7YUFFQSxJQUFDLENBQUEsaUJBQWlCLENBQUMsS0FBbkIsQ0FBQSxFQUhVO0lBQUEsQ0F0Qlo7QUFBQSxJQTJCQSxTQUFBLEVBQVcsU0FBQSxHQUFBO2FBR1Q7QUFBQSxRQUFBLGVBQUEsRUFBaUIsSUFBQyxDQUFBLFVBQVUsQ0FBQyxTQUFaLENBQUEsQ0FBakI7QUFBQSxRQUNBLHNCQUFBLEVBQXdCLElBQUMsQ0FBQSxpQkFBaUIsQ0FBQyxTQUFuQixDQUFBLENBRHhCO1FBSFM7SUFBQSxDQTNCWDtHQU5GLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/Marvin/.atom/packages/script/lib/script.coffee
