(function() {
  var Breakpoint, BreakpointStore, CompositeDisposable, PythonDebugger;

  CompositeDisposable = require("atom").CompositeDisposable;

  Breakpoint = require("./breakpoint");

  BreakpointStore = require("./breakpoint-store");

  module.exports = PythonDebugger = {
    pythonDebuggerView: null,
    subscriptions: null,
    config: {
      pythonExecutable: {
        title: "Path to Python executable to use during debugging",
        type: "string",
        "default": "python"
      }
    },
    createDebuggerView: function(backendDebugger) {
      var PythonDebuggerView;
      if (this.pythonDebuggerView == null) {
        PythonDebuggerView = require("./python-debugger-view");
        this.pythonDebuggerView = new PythonDebuggerView(this.breakpointStore);
      }
      return this.pythonDebuggerView;
    },
    activate: function(_arg) {
      var attached;
      attached = (_arg != null ? _arg : {}).attached;
      this.subscriptions = new CompositeDisposable;
      this.breakpointStore = new BreakpointStore();
      if (attached) {
        this.createDebuggerView().toggle();
      }
      return this.subscriptions.add(atom.commands.add("atom-workspace", {
        "python-debugger:toggle": (function(_this) {
          return function() {
            return _this.createDebuggerView().toggle();
          };
        })(this),
        "python-debugger:breakpoint": (function(_this) {
          return function() {
            return _this.toggleBreakpoint();
          };
        })(this)
      }));
    },
    toggleBreakpoint: function() {
      var breakpoint, editor, filename, lineNumber;
      editor = atom.workspace.getActiveTextEditor();
      filename = editor.getTitle();
      lineNumber = editor.getCursorBufferPosition().row + 1;
      breakpoint = new Breakpoint(filename, lineNumber);
      return this.breakpointStore.toggle(breakpoint);
    },
    deactivate: function() {
      this.backendDebuggerInputView.destroy();
      this.subscriptions.dispose();
      return this.pythonDebuggerView.destroy();
    },
    serialize: function() {
      var activePath, relative, themPaths;
      ({
        pythonDebuggerViewState: this.pythonDebuggerView.serialize()
      });
      activePath = typeof editor !== "undefined" && editor !== null ? editor.getPath() : void 0;
      relative = atom.project.relativizePath(activePath);
      return themPaths = relative[0] || path.dirname(activePath);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL01hcnZpbi8uYXRvbS9wYWNrYWdlcy9weXRob24tZGVidWdnZXIvbGliL3B5dGhvbi1kZWJ1Z2dlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsZ0VBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUNBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUixDQURiLENBQUE7O0FBQUEsRUFFQSxlQUFBLEdBQWtCLE9BQUEsQ0FBUSxvQkFBUixDQUZsQixDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsY0FBQSxHQUNmO0FBQUEsSUFBQSxrQkFBQSxFQUFvQixJQUFwQjtBQUFBLElBQ0EsYUFBQSxFQUFlLElBRGY7QUFBQSxJQUdBLE1BQUEsRUFDRTtBQUFBLE1BQUEsZ0JBQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLG1EQUFQO0FBQUEsUUFDQSxJQUFBLEVBQU0sUUFETjtBQUFBLFFBRUEsU0FBQSxFQUFTLFFBRlQ7T0FERjtLQUpGO0FBQUEsSUFTQSxrQkFBQSxFQUFvQixTQUFDLGVBQUQsR0FBQTtBQUNsQixVQUFBLGtCQUFBO0FBQUEsTUFBQSxJQUFPLCtCQUFQO0FBQ0UsUUFBQSxrQkFBQSxHQUFxQixPQUFBLENBQVEsd0JBQVIsQ0FBckIsQ0FBQTtBQUFBLFFBQ0EsSUFBQyxDQUFBLGtCQUFELEdBQTBCLElBQUEsa0JBQUEsQ0FBbUIsSUFBQyxDQUFBLGVBQXBCLENBRDFCLENBREY7T0FBQTthQUdBLElBQUMsQ0FBQSxtQkFKaUI7SUFBQSxDQVRwQjtBQUFBLElBZUEsUUFBQSxFQUFVLFNBQUMsSUFBRCxHQUFBO0FBRVIsVUFBQSxRQUFBO0FBQUEsTUFGVSwyQkFBRCxPQUFXLElBQVYsUUFFVixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsYUFBRCxHQUFpQixHQUFBLENBQUEsbUJBQWpCLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxlQUFELEdBQXVCLElBQUEsZUFBQSxDQUFBLENBRHZCLENBQUE7QUFFQSxNQUFBLElBQWtDLFFBQWxDO0FBQUEsUUFBQSxJQUFDLENBQUEsa0JBQUQsQ0FBQSxDQUFxQixDQUFDLE1BQXRCLENBQUEsQ0FBQSxDQUFBO09BRkE7YUFJQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUNqQjtBQUFBLFFBQUEsd0JBQUEsRUFBMEIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQUcsS0FBQyxDQUFBLGtCQUFELENBQUEsQ0FBcUIsQ0FBQyxNQUF0QixDQUFBLEVBQUg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUExQjtBQUFBLFFBQ0EsNEJBQUEsRUFBOEIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQUcsS0FBQyxDQUFBLGdCQUFELENBQUEsRUFBSDtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRDlCO09BRGlCLENBQW5CLEVBTlE7SUFBQSxDQWZWO0FBQUEsSUF5QkEsZ0JBQUEsRUFBa0IsU0FBQSxHQUFBO0FBQ2hCLFVBQUEsd0NBQUE7QUFBQSxNQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBVCxDQUFBO0FBQUEsTUFDQSxRQUFBLEdBQVcsTUFBTSxDQUFDLFFBQVAsQ0FBQSxDQURYLENBQUE7QUFBQSxNQUVBLFVBQUEsR0FBYSxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFnQyxDQUFDLEdBQWpDLEdBQXVDLENBRnBELENBQUE7QUFBQSxNQUdBLFVBQUEsR0FBaUIsSUFBQSxVQUFBLENBQVcsUUFBWCxFQUFxQixVQUFyQixDQUhqQixDQUFBO2FBSUEsSUFBQyxDQUFBLGVBQWUsQ0FBQyxNQUFqQixDQUF3QixVQUF4QixFQUxnQjtJQUFBLENBekJsQjtBQUFBLElBZ0NBLFVBQUEsRUFBWSxTQUFBLEdBQUE7QUFDVixNQUFBLElBQUMsQ0FBQSx3QkFBd0IsQ0FBQyxPQUExQixDQUFBLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxPQUFmLENBQUEsQ0FEQSxDQUFBO2FBRUEsSUFBQyxDQUFBLGtCQUFrQixDQUFDLE9BQXBCLENBQUEsRUFIVTtJQUFBLENBaENaO0FBQUEsSUFxQ0EsU0FBQSxFQUFXLFNBQUEsR0FBQTtBQUNULFVBQUEsK0JBQUE7QUFBQSxNQUFBLENBQUE7QUFBQSxRQUFBLHVCQUFBLEVBQXlCLElBQUMsQ0FBQSxrQkFBa0IsQ0FBQyxTQUFwQixDQUFBLENBQXpCO09BQUEsQ0FBQSxDQUFBO0FBQUEsTUFFQSxVQUFBLHNEQUFhLE1BQU0sQ0FBRSxPQUFSLENBQUEsVUFGYixDQUFBO0FBQUEsTUFHQSxRQUFBLEdBQVcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFiLENBQTRCLFVBQTVCLENBSFgsQ0FBQTthQUlBLFNBQUEsR0FBWSxRQUFTLENBQUEsQ0FBQSxDQUFULElBQWUsSUFBSSxDQUFDLE9BQUwsQ0FBYSxVQUFiLEVBTGxCO0lBQUEsQ0FyQ1g7R0FMRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/Marvin/.atom/packages/python-debugger/lib/python-debugger.coffee
