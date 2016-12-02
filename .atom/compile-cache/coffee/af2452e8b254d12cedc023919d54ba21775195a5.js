(function() {
  var Breakpoint, BreakpointStore, CompositeDisposable, PythonDebugger;

  CompositeDisposable = require("atom").CompositeDisposable;

  Breakpoint = require("./breakpoint");

  BreakpointStore = require("./breakpoint-store");

  module.exports = PythonDebugger = {
    pythonDebuggerView: null,
    subscriptions: null,
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL01hcnZpbi8uYXRvbS9wYWNrYWdlcy9weXRob24tZGVidWdnZXIvbGliL3B5dGhvbi1kZWJ1Z2dlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsZ0VBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUNBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUixDQURiLENBQUE7O0FBQUEsRUFFQSxlQUFBLEdBQWtCLE9BQUEsQ0FBUSxvQkFBUixDQUZsQixDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsY0FBQSxHQUNmO0FBQUEsSUFBQSxrQkFBQSxFQUFvQixJQUFwQjtBQUFBLElBQ0EsYUFBQSxFQUFlLElBRGY7QUFBQSxJQUdBLGtCQUFBLEVBQW9CLFNBQUMsZUFBRCxHQUFBO0FBQ2xCLFVBQUEsa0JBQUE7QUFBQSxNQUFBLElBQU8sK0JBQVA7QUFDRSxRQUFBLGtCQUFBLEdBQXFCLE9BQUEsQ0FBUSx3QkFBUixDQUFyQixDQUFBO0FBQUEsUUFDQSxJQUFDLENBQUEsa0JBQUQsR0FBMEIsSUFBQSxrQkFBQSxDQUFtQixJQUFDLENBQUEsZUFBcEIsQ0FEMUIsQ0FERjtPQUFBO2FBR0EsSUFBQyxDQUFBLG1CQUppQjtJQUFBLENBSHBCO0FBQUEsSUFTQSxRQUFBLEVBQVUsU0FBQyxJQUFELEdBQUE7QUFFUixVQUFBLFFBQUE7QUFBQSxNQUZVLDJCQUFELE9BQVcsSUFBVixRQUVWLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxhQUFELEdBQWlCLEdBQUEsQ0FBQSxtQkFBakIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLGVBQUQsR0FBdUIsSUFBQSxlQUFBLENBQUEsQ0FEdkIsQ0FBQTtBQUVBLE1BQUEsSUFBa0MsUUFBbEM7QUFBQSxRQUFBLElBQUMsQ0FBQSxrQkFBRCxDQUFBLENBQXFCLENBQUMsTUFBdEIsQ0FBQSxDQUFBLENBQUE7T0FGQTthQUlBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQ2pCO0FBQUEsUUFBQSx3QkFBQSxFQUEwQixDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFBRyxLQUFDLENBQUEsa0JBQUQsQ0FBQSxDQUFxQixDQUFDLE1BQXRCLENBQUEsRUFBSDtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTFCO0FBQUEsUUFDQSw0QkFBQSxFQUE4QixDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFBRyxLQUFDLENBQUEsZ0JBQUQsQ0FBQSxFQUFIO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEOUI7T0FEaUIsQ0FBbkIsRUFOUTtJQUFBLENBVFY7QUFBQSxJQW1CQSxnQkFBQSxFQUFrQixTQUFBLEdBQUE7QUFDaEIsVUFBQSx3Q0FBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFULENBQUE7QUFBQSxNQUNBLFFBQUEsR0FBVyxNQUFNLENBQUMsUUFBUCxDQUFBLENBRFgsQ0FBQTtBQUFBLE1BRUEsVUFBQSxHQUFhLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQWdDLENBQUMsR0FBakMsR0FBdUMsQ0FGcEQsQ0FBQTtBQUFBLE1BR0EsVUFBQSxHQUFpQixJQUFBLFVBQUEsQ0FBVyxRQUFYLEVBQXFCLFVBQXJCLENBSGpCLENBQUE7YUFJQSxJQUFDLENBQUEsZUFBZSxDQUFDLE1BQWpCLENBQXdCLFVBQXhCLEVBTGdCO0lBQUEsQ0FuQmxCO0FBQUEsSUEwQkEsVUFBQSxFQUFZLFNBQUEsR0FBQTtBQUNWLE1BQUEsSUFBQyxDQUFBLHdCQUF3QixDQUFDLE9BQTFCLENBQUEsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLE9BQWYsQ0FBQSxDQURBLENBQUE7YUFFQSxJQUFDLENBQUEsa0JBQWtCLENBQUMsT0FBcEIsQ0FBQSxFQUhVO0lBQUEsQ0ExQlo7QUFBQSxJQStCQSxTQUFBLEVBQVcsU0FBQSxHQUFBO0FBQ1QsVUFBQSwrQkFBQTtBQUFBLE1BQUEsQ0FBQTtBQUFBLFFBQUEsdUJBQUEsRUFBeUIsSUFBQyxDQUFBLGtCQUFrQixDQUFDLFNBQXBCLENBQUEsQ0FBekI7T0FBQSxDQUFBLENBQUE7QUFBQSxNQUVBLFVBQUEsc0RBQWEsTUFBTSxDQUFFLE9BQVIsQ0FBQSxVQUZiLENBQUE7QUFBQSxNQUdBLFFBQUEsR0FBVyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWIsQ0FBNEIsVUFBNUIsQ0FIWCxDQUFBO2FBSUEsU0FBQSxHQUFZLFFBQVMsQ0FBQSxDQUFBLENBQVQsSUFBZSxJQUFJLENBQUMsT0FBTCxDQUFhLFVBQWIsRUFMbEI7SUFBQSxDQS9CWDtHQUxGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/Marvin/.atom/packages/python-debugger/lib/python-debugger.coffee
