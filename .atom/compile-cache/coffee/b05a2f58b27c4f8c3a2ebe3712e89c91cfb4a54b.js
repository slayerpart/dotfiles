(function() {
  var dash;

  dash = require('../lib/dash');

  describe("dash", function() {
    it("should open dash", function() {
      return waitsForPromise(function() {
        return atom.workspace.open('test.hs').then(function(editor) {
          var view;
          view = atom.views.getView(editor);
          editor.setCursorBufferPosition({
            row: 1,
            column: 6
          });
          return new Promise(function(resolve, reject) {
            dash.openExternal = function(uri) {
              expect(uri).toEqual('dash-plugin://query=.SetFlags');
              return resolve();
            };
            return dash.shortcut(true);
          });
        });
      });
    });
    return it("should open dash with background", function() {
      return waitsForPromise(function() {
        return atom.workspace.open('test.hs').then(function(editor) {
          var view;
          view = atom.views.getView(editor);
          editor.setCursorBufferPosition({
            row: 1,
            column: 6
          });
          return new Promise(function(resolve, reject) {
            dash.openExternal = function(uri) {
              expect(uri).toEqual('dash-plugin://query=.SetFlags&prevent_activation=true');
              return resolve();
            };
            return dash.shortcut(true, true);
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL01hcnZpbi8uYXRvbS9wYWNrYWdlcy9kYXNoL3NwZWMvZGFzaC1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxJQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxhQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUVBLFFBQUEsQ0FBUyxNQUFULEVBQWlCLFNBQUEsR0FBQTtBQUNmLElBQUEsRUFBQSxDQUFHLGtCQUFILEVBQXVCLFNBQUEsR0FBQTthQUNyQixlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNkLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixTQUFwQixDQUE4QixDQUFDLElBQS9CLENBQW9DLFNBQUMsTUFBRCxHQUFBO0FBQ2xDLGNBQUEsSUFBQTtBQUFBLFVBQUEsSUFBQSxHQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixNQUFuQixDQUFQLENBQUE7QUFBQSxVQUVBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQjtBQUFBLFlBQUUsR0FBQSxFQUFLLENBQVA7QUFBQSxZQUFVLE1BQUEsRUFBUSxDQUFsQjtXQUEvQixDQUZBLENBQUE7aUJBSUksSUFBQSxPQUFBLENBQVEsU0FBQyxPQUFELEVBQVUsTUFBVixHQUFBO0FBQ1YsWUFBQSxJQUFJLENBQUMsWUFBTCxHQUFvQixTQUFDLEdBQUQsR0FBQTtBQUNsQixjQUFBLE1BQUEsQ0FBTyxHQUFQLENBQVcsQ0FBQyxPQUFaLENBQW9CLCtCQUFwQixDQUFBLENBQUE7cUJBQ0EsT0FBQSxDQUFBLEVBRmtCO1lBQUEsQ0FBcEIsQ0FBQTttQkFJQSxJQUFJLENBQUMsUUFBTCxDQUFjLElBQWQsRUFMVTtVQUFBLENBQVIsRUFMOEI7UUFBQSxDQUFwQyxFQURjO01BQUEsQ0FBaEIsRUFEcUI7SUFBQSxDQUF2QixDQUFBLENBQUE7V0FjQSxFQUFBLENBQUcsa0NBQUgsRUFBdUMsU0FBQSxHQUFBO2FBQ3JDLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLFNBQXBCLENBQThCLENBQUMsSUFBL0IsQ0FBb0MsU0FBQyxNQUFELEdBQUE7QUFDbEMsY0FBQSxJQUFBO0FBQUEsVUFBQSxJQUFBLEdBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLE1BQW5CLENBQVAsQ0FBQTtBQUFBLFVBRUEsTUFBTSxDQUFDLHVCQUFQLENBQStCO0FBQUEsWUFBRSxHQUFBLEVBQUssQ0FBUDtBQUFBLFlBQVUsTUFBQSxFQUFRLENBQWxCO1dBQS9CLENBRkEsQ0FBQTtpQkFJSSxJQUFBLE9BQUEsQ0FBUSxTQUFDLE9BQUQsRUFBVSxNQUFWLEdBQUE7QUFDVixZQUFBLElBQUksQ0FBQyxZQUFMLEdBQW9CLFNBQUMsR0FBRCxHQUFBO0FBQ2xCLGNBQUEsTUFBQSxDQUFPLEdBQVAsQ0FBVyxDQUFDLE9BQVosQ0FBb0IsdURBQXBCLENBQUEsQ0FBQTtxQkFDQSxPQUFBLENBQUEsRUFGa0I7WUFBQSxDQUFwQixDQUFBO21CQUlBLElBQUksQ0FBQyxRQUFMLENBQWMsSUFBZCxFQUFvQixJQUFwQixFQUxVO1VBQUEsQ0FBUixFQUw4QjtRQUFBLENBQXBDLEVBRGM7TUFBQSxDQUFoQixFQURxQztJQUFBLENBQXZDLEVBZmU7RUFBQSxDQUFqQixDQUZBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/Marvin/.atom/packages/dash/spec/dash-spec.coffee
