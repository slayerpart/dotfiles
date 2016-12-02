(function() {
  var Runner, ScriptOptions;

  Runner = require('../lib/runner');

  ScriptOptions = require('../lib/script-options');

  describe('Runner', function() {
    beforeEach(function() {
      this.command = 'node';
      this.runOptions = new ScriptOptions;
      this.runOptions.cmd = this.command;
      return this.runner = new Runner(this.runOptions);
    });
    afterEach(function() {
      return this.runner.destroy();
    });
    return describe('run', function() {
      it('with no input', function() {
        runs((function(_this) {
          return function() {
            _this.output = null;
            _this.runner.onDidWriteToStdout(function(output) {
              return _this.output = output;
            });
            return _this.runner.run(_this.command, ['./outputTest.js'], {});
          };
        })(this));
        waitsFor((function(_this) {
          return function() {
            return _this.output !== null;
          };
        })(this), "File should execute", 500);
        return runs((function(_this) {
          return function() {
            return expect(_this.output).toEqual({
              message: 'hello\n'
            });
          };
        })(this));
      });
      it('with an input string', function() {
        runs((function(_this) {
          return function() {
            _this.output = null;
            _this.runner.onDidWriteToStdout(function(output) {
              return _this.output = output;
            });
            return _this.runner.run(_this.command, ['./ioTest.js'], {}, 'hello');
          };
        })(this));
        waitsFor((function(_this) {
          return function() {
            return _this.output !== null;
          };
        })(this), "File should execute", 500);
        return runs((function(_this) {
          return function() {
            return expect(_this.output).toEqual({
              message: 'TEST: hello\n'
            });
          };
        })(this));
      });
      it('exits', function() {
        runs((function(_this) {
          return function() {
            _this.exited = false;
            _this.runner.onDidExit(function() {
              return _this.exited = true;
            });
            return _this.runner.run(_this.command, ['./outputTest.js'], {});
          };
        })(this));
        return waitsFor((function(_this) {
          return function() {
            return _this.exited;
          };
        })(this), "Should receive exit callback", 500);
      });
      return it('notifies about writing to stderr', function() {
        runs((function(_this) {
          return function() {
            _this.failedEvent = null;
            _this.runner.onDidWriteToStderr(function(event) {
              return _this.failedEvent = event;
            });
            return _this.runner.run(_this.command, ['./throw.js'], {});
          };
        })(this));
        waitsFor((function(_this) {
          return function() {
            return _this.failedEvent;
          };
        })(this), "Should receive failure callback", 500);
        return runs((function(_this) {
          return function() {
            return expect(_this.failedEvent.message).toMatch(/kaboom/);
          };
        })(this));
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL01hcnZpbi8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvc3BlYy9ydW5uZXItc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEscUJBQUE7O0FBQUEsRUFBQSxNQUFBLEdBQVMsT0FBQSxDQUFRLGVBQVIsQ0FBVCxDQUFBOztBQUFBLEVBQ0EsYUFBQSxHQUFnQixPQUFBLENBQVEsdUJBQVIsQ0FEaEIsQ0FBQTs7QUFBQSxFQUdBLFFBQUEsQ0FBUyxRQUFULEVBQW1CLFNBQUEsR0FBQTtBQUNqQixJQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxNQUFBLElBQUMsQ0FBQSxPQUFELEdBQVcsTUFBWCxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsVUFBRCxHQUFjLEdBQUEsQ0FBQSxhQURkLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxVQUFVLENBQUMsR0FBWixHQUFrQixJQUFDLENBQUEsT0FGbkIsQ0FBQTthQUdBLElBQUMsQ0FBQSxNQUFELEdBQWMsSUFBQSxNQUFBLENBQU8sSUFBQyxDQUFBLFVBQVIsRUFKTDtJQUFBLENBQVgsQ0FBQSxDQUFBO0FBQUEsSUFNQSxTQUFBLENBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxPQUFSLENBQUEsRUFEUTtJQUFBLENBQVYsQ0FOQSxDQUFBO1dBU0EsUUFBQSxDQUFTLEtBQVQsRUFBZ0IsU0FBQSxHQUFBO0FBQ2QsTUFBQSxFQUFBLENBQUcsZUFBSCxFQUFvQixTQUFBLEdBQUE7QUFDbEIsUUFBQSxJQUFBLENBQUssQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7QUFDSCxZQUFBLEtBQUMsQ0FBQSxNQUFELEdBQVUsSUFBVixDQUFBO0FBQUEsWUFDQSxLQUFDLENBQUEsTUFBTSxDQUFDLGtCQUFSLENBQTJCLFNBQUMs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

//# sourceURL=/Users/Marvin/.atom/packages/script/spec/runner-spec.coffee
