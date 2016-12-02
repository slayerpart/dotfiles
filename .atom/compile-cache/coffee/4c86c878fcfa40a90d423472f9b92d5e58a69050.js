(function() {
  var CompositeDisposable, ViewRuntimeObserver;

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = ViewRuntimeObserver = (function() {
    function ViewRuntimeObserver(view, subscriptions) {
      this.view = view;
      this.subscriptions = subscriptions != null ? subscriptions : new CompositeDisposable;
    }

    ViewRuntimeObserver.prototype.observe = function(runtime) {
      this.subscriptions.add(runtime.onDidExecuteStart((function(_this) {
        return function() {
          return _this.view.resetView();
        };
      })(this)));
      this.subscriptions.add(runtime.onDidWriteToStderr((function(_this) {
        return function(ev) {
          return _this.view.display('stderr', ev.message);
        };
      })(this)));
      this.subscriptions.add(runtime.onDidWriteToStdout((function(_this) {
        return function(ev) {
          return _this.view.display('stdout', ev.message);
        };
      })(this)));
      this.subscriptions.add(runtime.onDidExit((function(_this) {
        return function(ev) {
          return _this.view.setHeaderAndShowExecutionTime(ev.returnCode, ev.executionTime);
        };
      })(this)));
      this.subscriptions.add(runtime.onDidNotRun((function(_this) {
        return function(ev) {
          return _this.view.showUnableToRunError(ev.command);
        };
      })(this)));
      this.subscriptions.add(runtime.onDidContextCreate((function(_this) {
        return function(ev) {
          var title;
          title = "" + ev.lang + " - " + (ev.filename + (ev.lineNumber != null ? ":" + ev.lineNumber : void 0));
          return _this.view.setHeaderTitle(title);
        };
      })(this)));
      this.subscriptions.add(runtime.onDidNotSpecifyLanguage((function(_this) {
        return function() {
          return _this.view.showNoLanguageSpecified();
        };
      })(this)));
      this.subscriptions.add(runtime.onDidNotSupportLanguage((function(_this) {
        return function(ev) {
          return _this.view.showLanguageNotSupported(ev.lang);
        };
      })(this)));
      this.subscriptions.add(runtime.onDidNotSupportMode((function(_this) {
        return function(ev) {
          return _this.view.createGitHubIssueLink(ev.argType, ev.lang);
        };
      })(this)));
      return this.subscriptions.add(runtime.onDidNotBuildArgs((function(_this) {
        return function(ev) {
          return _this.view.handleError(ev.error);
        };
      })(this)));
    };

    ViewRuntimeObserver.prototype.destroy = function() {
      var _ref;
      return (_ref = this.subscriptions) != null ? _ref.dispose() : void 0;
    };

    return ViewRuntimeObserver;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL01hcnZpbi8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL3ZpZXctcnVudGltZS1vYnNlcnZlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsd0NBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDUyxJQUFBLDZCQUFFLElBQUYsRUFBUyxhQUFULEdBQUE7QUFBbUQsTUFBbEQsSUFBQyxDQUFBLE9BQUEsSUFBaUQsQ0FBQTtBQUFBLE1BQTNDLElBQUMsQ0FBQSx3Q0FBQSxnQkFBZ0IsR0FBQSxDQUFBLG1CQUEwQixDQUFuRDtJQUFBLENBQWI7O0FBQUEsa0NBRUEsT0FBQSxHQUFTLFNBQUMsT0FBRCxHQUFBO0FBQ1AsTUFBQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsT0FBTyxDQUFDLGlCQUFSLENBQTBCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQzNDLEtBQUMsQ0FBQSxJQUFJLENBQUMsU0FBTixDQUFBLEVBRDJDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBMUIsQ0FBbkIsQ0FBQSxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsT0FBTyxDQUFDLGtCQUFSLENBQTJCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLEVBQUQsR0FBQTtpQkFDNUMsS0FBQyxDQUFBLElBQUksQ0FBQyxPQUFOLENBQWMsUUFBZCxFQUF3QixFQUFFLENBQUMsT0FBM0IsRUFENEM7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUEzQixDQUFuQixDQUZBLENBQUE7QUFBQSxNQUlBLElBQUMs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

//# sourceURL=/Users/Marvin/.atom/packages/script/lib/view-runtime-observer.coffee
