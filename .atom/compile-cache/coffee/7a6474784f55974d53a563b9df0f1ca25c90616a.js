(function() {
  var BreakpointStore, CompositeDisposable;

  CompositeDisposable = require("atom").CompositeDisposable;

  module.exports = BreakpointStore = (function() {
    function BreakpointStore(gutter) {
      this.breakpoints = [];
    }

    BreakpointStore.prototype.toggle = function(breakpoint) {
      var addDecoration, breakpointSearched, d, ds, editor, marker, _i, _len, _results;
      breakpointSearched = this.containsBreakpoint(breakpoint);
      addDecoration = true;
      if (breakpointSearched) {
        this.breakpoints.splice(breakpointSearched, 1);
        addDecoration = false;
      } else {
        this.breakpoints.push(breakpoint);
      }
      editor = atom.workspace.getActiveTextEditor();
      if (addDecoration) {
        marker = editor.markBufferPosition([breakpoint.lineNumber - 1, 0]);
        d = editor.decorateMarker(marker, {
          type: "line-number",
          "class": "line-number-red"
        });
        d.setProperties({
          type: "line-number",
          "class": "line-number-red"
        });
        return breakpoint.decoration = d;
      } else {
        editor = atom.workspace.getActiveTextEditor();
        ds = editor.getLineNumberDecorations({
          type: "line-number",
          "class": "line-number-red"
        });
        _results = [];
        for (_i = 0, _len = ds.length; _i < _len; _i++) {
          d = ds[_i];
          marker = d.getMarker();
          if (marker.getBufferRange().start.row === breakpoint.lineNumber - 1) {
            _results.push(marker.destroy());
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    };

    BreakpointStore.prototype.containsBreakpoint = function(bp) {
      var breakpoint, _i, _len, _ref;
      _ref = this.breakpoints;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        breakpoint = _ref[_i];
        if (breakpoint.filename === bp.filename && breakpoint.lineNumber === bp.lineNumber) {
          return breakpoint;
        }
      }
      return null;
    };

    BreakpointStore.prototype.currentBreakpoints = function() {
      var breakpoint, _i, _len, _ref, _results;
      _ref = this.breakpoints;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        breakpoint = _ref[_i];
        _results.push(console.log(breakpoint));
      }
      return _results;
    };

    BreakpointStore.prototype.clear = function() {
      var breakpoint, _i, _len, _ref, _results;
      _ref = this.breakpoints;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        breakpoint = _ref[_i];
        _results.push(this.toggle(breakpoint));
      }
      return _results;
    };

    return BreakpointStore;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL01hcnZpbi8uYXRvbS9wYWNrYWdlcy9weXRob24tZGVidWdnZXIvbGliL2JyZWFrcG9pbnQtc3RvcmUuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG9DQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFDQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ1MsSUFBQSx5QkFBQyxNQUFELEdBQUE7QUFDWCxNQUFBLElBQUMsQ0FBQSxXQUFELEdBQWUsRUFBZixDQURXO0lBQUEsQ0FBYjs7QUFBQSw4QkFHQSxNQUFBLEdBQVEsU0FBQyxVQUFELEdBQUE7QUFDTixVQUFBLDRFQUFBO0FBQUEsTUFBQSxrQkFBQSxHQUFxQixJQUFDLENBQUEsa0JBQUQsQ0FBb0IsVUFBcEIsQ0FBckIsQ0FBQTtBQUFBLE1BRUEsYUFBQSxHQUFnQixJQUZoQixDQUFBO0FBR0EsTUFBQSxJQUFHLGtCQUFIO0FBQ0UsUUFBQSxJQUFDLENBQUEsV0FBVyxDQUFDLE1BQWIsQ0FBb0Isa0JBQXBCLEVBQXdDLENBQXhDLENBQUEsQ0FBQTtBQUFBLFFBQ0EsYUFBQSxHQUFnQixLQURoQixDQURGO09BQUEsTUFBQTtBQUlFLFFBQUEsSUFBQyxDQUFBLFdBQVcsQ0FBQyxJQUFiLENBQWtCLFVBQWxCLENBQUEsQ0FKRjtPQUhBO0FBQUEsTUFTQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBVFQsQ0FBQTtBQVdBLE1BQUEsSUFBRyxhQUFIO0FBQ0UsUUFBQSxNQUFBLEdBQVMsTUFBTSxDQUFDLGtCQUFQLENBQTBCLENBQUMsVUFBVSxDQUFDLFVBQVgsR0FBc0IsQ0FBdkIsRUFBMEIsQ0FBMUIsQ0FBMUIsQ0FBVCxDQUFBO0FBQUEsUUFDQSxDQUFBLEdBQUksTUFBTSxDQUFDLGNBQVAsQ0FBc0IsTUFBdEIsRUFBOEI7QUFBQSxVQUFBLElBQUEsRUFBTSxhQUFOO0FBQUEsVUFBcUIsT0FBQSxFQUFPLGlCQUE1QjtTQUE5QixDQURKLENBQUE7QUFBQSxRQUVBLENBQUMsQ0FBQyxhQUFGLENBQWdCO0FBQUEsVUFBQSxJQUFBLEVBQU0sYUFBTjtBQUFBLFVBQXFCLE9BQUEsRUFBTyxpQkFBNUI7U0FBaEIsQ0FGQSxDQUFBO2VBR0EsVUFBVSxDQUFDLFVBQVgsR0FBd0IsRUFKMUI7T0FBQSxNQUFBO0FBTUUsUUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQVQsQ0FBQTtBQUFBLFFBQ0EsRUFBQSxHQUFLLE1BQU0sQ0FBQyx3QkFBUCxDQUFnQztBQUFBLFVBQUEsSUFBQSxFQUFNLGFBQU47QUFBQSxVQUFxQixPQUFBLEVBQU8saUJBQTVCO1NBQWhDLENBREwsQ0FBQTtBQUVBO2FBQUEseUNBQUE7cUJBQUE7QUFDRSxVQUFBLE1BQUEsR0FBUyxDQUFDLENBQUMsU0FBRixDQUFBLENBQVQsQ0FBQTtBQUNBLFVBQUEsSUFBb0IsTUFBTSxDQUFDLGNBQVAsQ0FBQSxDQUF1QixDQUFDLEtBQUssQ0FBQyxHQUE5QixLQUFxQyxVQUFVLENBQUMsVUFBWCxHQUFzQixDQUEvRTswQkFBQSxNQUFNLENBQUMsT0FBUCxDQUFBLEdBQUE7V0FBQSxNQUFBO2tDQUFBO1dBRkY7QUFBQTt3QkFSRjtPQVpNO0lBQUEsQ0FIUixDQUFBOztBQUFBLDhCQTJCQSxrQkFBQSxHQUFvQixTQUFDLEVBQUQsR0FBQTtBQUNsQixVQUFBLDBCQUFBO0FBQUE7QUFBQSxXQUFBLDJDQUFBOzhCQUFBO0FBQ0UsUUFBQSxJQUFHLFVBQVUsQ0FBQyxRQUFYLEtBQXVCLEVBQUUsQ0FBQyxRQUExQixJQUFzQyxVQUFVLENBQUMsVUFBWCxLQUF5QixFQUFFLENBQUMsVUFBckU7QUFDRSxpQkFBTyxVQUFQLENBREY7U0FERjtBQUFBLE9BQUE7QUFHQSxhQUFPLElBQVAsQ0FKa0I7SUFBQSxDQTNCcEIsQ0FBQTs7QUFBQSw4QkFpQ0Esa0JBQUEsR0FBb0IsU0FBQSxHQUFBO0FBQ2xCLFVBQUEsb0NBQUE7QUFBQTtBQUFBO1dBQUEsMkNBQUE7OEJBQUE7QUFBQSxzQkFBQSxPQUFPLENBQUMsR0FBUixDQUFZLFVBQVosRUFBQSxDQUFBO0FBQUE7c0JBRGtCO0lBQUEsQ0FqQ3BCLENBQUE7O0FBQUEsOEJBb0NBLEtBQUEsR0FBTyxTQUFBLEdBQUE7QUFDTCxVQUFBLG9DQUFBO0FBQUE7QUFBQTtXQUFBLDJDQUFBOzhCQUFBO0FBQUEsc0JBQUEsSUFBQyxDQUFBLE1BQUQsQ0FBUSxVQUFSLEVBQUEsQ0FBQTtBQUFBO3NCQURLO0lBQUEsQ0FwQ1AsQ0FBQTs7MkJBQUE7O01BSEYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/Marvin/.atom/packages/python-debugger/lib/breakpoint-store.coffee
