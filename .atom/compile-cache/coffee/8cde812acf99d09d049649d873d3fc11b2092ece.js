(function() {
  var dash;

  dash = require('../lib/dash');

  describe("dash", function() {
    return it("should open dash", function() {
      return waitsForPromise(function() {
        return atom.workspace.open('test.hs').then(function(editor) {
          var view;
          view = atom.views.getView(editor);
          editor.setCursorBufferPosition({
            row: 1,
            column: 6
          });
          return new Promise(function(resolve, reject) {
            dash.exec = function(cmd) {
              expect(cmd).toEqual('open -g "dash-plugin://query=.SetFlags"');
              return resolve();
            };
            return dash.shortcut(true);
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL01hcnZpbi8uYXRvbS9wYWNrYWdlcy9kYXNoL3NwZWMvZGFzaC1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxJQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxhQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUVBLFFBQUEsQ0FBUyxNQUFULEVBQWlCLFNBQUEsR0FBQTtXQUNmLEVBQUEsQ0FBRyxrQkFBSCxFQUF1QixTQUFBLEdBQUE7YUFDckIsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsU0FBcEIsQ0FBOEIsQ0FBQyxJQUEvQixDQUFvQyxTQUFDLE1BQUQsR0FBQTtBQUNsQyxjQUFBLElBQUE7QUFBQSxVQUFBLElBQUEsR0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsTUFBbkIsQ0FBUCxDQUFBO0FBQUEsVUFFQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0I7QUFBQSxZQUFFLEdBQUEsRUFBSyxDQUFQO0FBQUEsWUFBVSxNQUFBLEVBQVEsQ0FBbEI7V0FBL0IsQ0FGQSxDQUFBO2lCQUlJLElBQUEsT0FBQSxDQUFRLFNBQUMsT0FBRCxFQUFVLE1BQVYsR0FBQTtBQUNWLFlBQUEsSUFBSSxDQUFDLElBQUwsR0FBWSxTQUFDLEdBQUQsR0FBQTtBQUNWLGNBQUEsTUFBQSxDQUFPLEdBQVAsQ0FBVyxDQUFDLE9BQVosQ0FBb0IseUNBQXBCLENBQUEsQ0FBQTtxQkFDQSxPQUFBLENBQUEsRUFGVTtZQUFBLENBQVosQ0FBQTttQkFJQSxJQUFJLENBQUMsUUFBTCxDQUFjLElBQWQsRUFMVTtVQUFBLENBQVIsRUFMOEI7UUFBQSxDQUFwQyxFQURjO01BQUEsQ0FBaEIsRUFEcUI7SUFBQSxDQUF2QixFQURlO0VBQUEsQ0FBakIsQ0FGQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/Marvin/.atom/packages/dash/spec/dash-spec.coffee
