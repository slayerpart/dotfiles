(function() {
  var linkPaths, regex, template;

  regex = /(\/?(?:[-\w.]+\/)*[-\w.]+):(\d+):(\d+)/g;

  template = '<a class="-linked-path" data-path="$1" data-line="$2" data-column="$3">$&</a>';

  module.exports = linkPaths = function(lines) {
    return lines.replace(regex, template);
  };

  linkPaths.listen = function(parentView) {
    return parentView.on('click', '.-linked-path', function(event) {
      var column, el, line, path, _ref;
      el = this;
      _ref = el.dataset, path = _ref.path, line = _ref.line, column = _ref.column;
      line = Number(line) - 1;
      column = Number(column) - 1;
      return atom.workspace.open(path, {
        initialLine: line,
        initialColumn: column
      });
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL01hcnZpbi8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL2xpbmstcGF0aHMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDBCQUFBOztBQUFBLEVBQUEsS0FBQSxHQUFRLHlDQUFSLENBQUE7O0FBQUEsRUFDQSxRQUFBLEdBQVcsK0VBRFgsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUEsR0FBWSxTQUFDLEtBQUQsR0FBQTtXQUMzQixLQUFLLENBQUMsT0FBTixDQUFjLEtBQWQsRUFBcUIsUUFBckIsRUFEMkI7RUFBQSxDQUg3QixDQUFBOztBQUFBLEVBTUEsU0FBUyxDQUFDLE1BQVYsR0FBbUIsU0FBQyxVQUFELEdBQUE7V0FDakIsVUFBVSxDQUFDLEVBQVgsQ0FBYyxPQUFkLEVBQXVCLGVBQXZCLEVBQXdDLFNBQUMsS0FBRCxHQUFBO0FBQ3RDLFVBQUEsNEJBQUE7QUFBQSxNQUFBLEVBQUEsR0FBSyxJQUFMLENBQUE7QUFBQSxNQUNBLE9BQXVCLEVBQUUsQ0FBQyxPQUExQixFQUFDLFlBQUEsSUFBRCxFQUFPLFlBQUEsSUFBUCxFQUFhLGNBQUEsTUFEYixDQUFBO0FBQUEsTUFFQSxJQUFBLEdBQU8sTUFBQSxDQUFPLElBQVAsQ0FBQSxHQUFlLENBRnRCLENBQUE7QUFBQSxNQUdBLE1BQUEsR0FBUyxNQUFBLENBQU8sTUFBUCxDQUFBLEdBQWlCLENBSDFCLENBQUE7YUFLQSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsSUFBcEIsRUFBMEI7QUFBQSxRQUN4QixXQUFBLEVBQWEsSUFEVztBQUFBLFFBRXhCLGFBQUEsRUFBZSxNQUZTO09BQTFCLEVBTnNDO0lBQUEsQ0FBeEMsRUFEaUI7RUFBQSxDQU5uQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/Marvin/.atom/packages/script/lib/link-paths.coffee
