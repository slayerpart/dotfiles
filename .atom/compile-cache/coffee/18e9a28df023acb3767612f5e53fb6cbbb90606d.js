(function() {
  var linkPaths;

  linkPaths = require('../lib/link-paths');

  describe('linkPaths', function() {
    it('detects file paths with line numbers', function() {
      var result;
      result = linkPaths('foo() b/c.js:44:55');
      expect(result).toContain('foo() <a');
      expect(result).toContain('class="-linked-path"');
      expect(result).toContain('data-path="b/c.js"');
      expect(result).toContain('data-line="44"');
      expect(result).toContain('data-column="55"');
      return expect(result).toContain('b/c.js:44:55');
    });
    return it('links multiple paths', function() {
      var multilineResult;
      multilineResult = linkPaths("foo() b/c.js:44:55\nbar() b/c.js:45:56");
      expect(multilineResult).toContain('foo() <a');
      return expect(multilineResult).toContain('bar() <a');
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL01hcnZpbi8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvc3BlYy9saW5rLXBhdGhzLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFNBQUE7O0FBQUEsRUFBQSxTQUFBLEdBQVksT0FBQSxDQUFRLG1CQUFSLENBQVosQ0FBQTs7QUFBQSxFQUVBLFFBQUEsQ0FBUyxXQUFULEVBQXNCLFNBQUEsR0FBQTtBQUNwQixJQUFBLEVBQUEsQ0FBRyxzQ0FBSCxFQUEyQyxTQUFBLEdBQUE7QUFDekMsVUFBQSxNQUFBO0FBQUEsTUFBQSxNQUFBLEdBQVMsU0FBQSxDQUFVLG9CQUFWLENBQVQsQ0FBQTtBQUFBLE1BQ0EsTUFBQSxDQUFPLE1BQVAsQ0FBYyxDQUFDLFNBQWYsQ0FBeUIsVUFBekIsQ0FEQSxDQUFBO0FBQUEsTUFFQSxNQUFBLENBQU8sTUFBUCxDQUFjLENBQUMsU0FBZixDQUF5QixzQkFBekIsQ0FGQSxDQUFBO0FBQUEsTUFHQSxNQUFBLENBQU8sTUFBUCxDQUFjLENBQUMsU0FBZixDQUF5QixvQkFBekIsQ0FIQSxDQUFBO0FBQUEsTUFJQSxNQUFBLENBQU8sTUFBUCxDQUFjLENBQUMsU0FBZixDQUF5QixnQkFBekIsQ0FKQSxDQUFBO0FBQUEsTUFLQSxNQUFBLENBQU8sTUFBUCxDQUFjLENBQUMsU0FBZixDQUF5QixrQkFBekIsQ0FMQSxDQUFBO2FBTUEsTUFBQSxDQUFPLE1BQVAsQ0FBYyxDQUFDLFNBQWYsQ0FBeUIsY0FBekIsRUFQeUM7SUFBQSxDQUEzQyxDQUFBLENBQUE7V0FTQSxFQUFBLENBQUcsc0JBQUgsRUFBMkIsU0FBQSxHQUFBO0FBQ3pCLFVBQUEsZUFBQTtBQUFBLE1BQUEsZUFBQSxHQUFrQixTQUFBLENBQVUsd0NBQVYsQ0FBbEIsQ0FBQTtBQUFBLE1BSUEsTUFBQSxDQUFPLGVBQVAsQ0FBdUIsQ0FBQyxTQUF4QixDQUFrQyxVQUFsQyxDQUpBLENBQUE7YUFLQSxNQUFBLENBQU8sZUFBUCxDQUF1QixDQUFDLFNBQXhCLENBQWtDLFVBQWxDLEVBTnlCO0lBQUEsQ0FBM0IsRUFWb0I7RUFBQSxDQUF0QixDQUZBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/Marvin/.atom/packages/script/spec/link-paths-spec.coffee
