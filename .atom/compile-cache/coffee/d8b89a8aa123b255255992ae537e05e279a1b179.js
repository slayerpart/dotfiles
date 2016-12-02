(function() {
  var InsertNlJsx,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = [].slice;

  module.exports = InsertNlJsx = (function() {
    function InsertNlJsx(editor) {
      this.editor = editor;
      this.insertText = __bind(this.insertText, this);
      this.adviseBefore(this.editor, 'insertText', this.insertText);
    }

    InsertNlJsx.prototype.insertText = function(text, options) {
      var cursorBufferPosition, indentLength;
      if (!(text === "\n")) {
        return true;
      }
      if (this.editor.hasMultipleCursors()) {
        return true;
      }
      cursorBufferPosition = this.editor.getCursorBufferPosition();
      if (!(cursorBufferPosition.column > 0)) {
        return true;
      }
      if ('JSXEndTagStart' !== this.editor.scopeDescriptorForBufferPosition(cursorBufferPosition).getScopesArray().pop()) {
        return true;
      }
      cursorBufferPosition.column--;
      if ('JSXStartTagEnd' !== this.editor.scopeDescriptorForBufferPosition(cursorBufferPosition).getScopesArray().pop()) {
        return true;
      }
      indentLength = this.editor.indentationForBufferRow(cursorBufferPosition.row);
      this.editor.insertText("\n\n");
      this.editor.setIndentationForBufferRow(cursorBufferPosition.row + 1, indentLength + 1, {
        preserveLeadingWhitespace: false
      });
      this.editor.setIndentationForBufferRow(cursorBufferPosition.row + 2, indentLength, {
        preserveLeadingWhitespace: false
      });
      this.editor.moveUp();
      this.editor.moveToEndOfLine();
      return false;
    };

    InsertNlJsx.prototype.adviseBefore = function(object, methodName, advice) {
      var original;
      original = object[methodName];
      return object[methodName] = function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        if (advice.apply(this, args) !== false) {
          return original.apply(this, args);
        }
      };
    };

    return InsertNlJsx;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL01hcnZpbi8uYXRvbS9wYWNrYWdlcy9sYW5ndWFnZS1iYWJlbC9saWIvaW5zZXJ0LW5sLWpzeC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsV0FBQTtJQUFBO3NCQUFBOztBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNTLElBQUEscUJBQUUsTUFBRixHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsU0FBQSxNQUNiLENBQUE7QUFBQSxxREFBQSxDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsWUFBRCxDQUFjLElBQUMsQ0FBQSxNQUFmLEVBQXVCLFlBQXZCLEVBQXFDLElBQUMsQ0FBQSxVQUF0QyxDQUFBLENBRFc7SUFBQSxDQUFiOztBQUFBLDBCQU1BLFVBQUEsR0FBWSxTQUFDLElBQUQsRUFBTyxPQUFQLEdBQUE7QUFDVixVQUFBLGtDQUFBO0FBQUEsTUFBQSxJQUFBLENBQUEsQ0FBcUIsSUFBQSxLQUFRLElBQVYsQ0FBbkI7QUFBQSxlQUFPLElBQVAsQ0FBQTtPQUFBO0FBQ0EsTUFBQSxJQUFlLElBQUMsQ0FBQSxNQUFNLENBQUMsa0JBQVIsQ0FBQSxDQUFmO0FBQUEsZUFBTyxJQUFQLENBQUE7T0FEQTtBQUFBLE1BR0Esb0JBQUEsR0FBdUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyx1QkFBUixDQUFBLENBSHZCLENBQUE7QUFJQSxNQUFBLElBQUEsQ0FBQSxDQUFtQixvQkFBb0IsQ0FBQyxNQUFyQixHQUE4QixDQUFqRCxDQUFBO0FBQUEsZUFBTyxJQUFQLENBQUE7T0FKQTtBQUtBLE1BQUEsSUFBbUIsZ0JBQUEsS0FBb0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxnQ0FBUixDQUF5QyxvQkFBekMsQ0FBOEQsQ0FBQyxjQUEvRCxDQUFBLENBQStFLENBQUMsR0FBaEYsQ0FBQSxDQUF2QztBQUFBLGVBQU8sSUFBUCxDQUFBO09BTEE7QUFBQSxNQU1BLG9CQUFvQixDQUFDLE1BQXJCLEVBTkEsQ0FBQTtBQU9BLE1BQUEsSUFBbUIsZ0JBQUEsS0FBb0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxnQ0FBUixDQUF5QyxvQkFBekMsQ0FBOEQsQ0FBQyxjQUEvRCxDQUFBLENBQStFLENBQUMsR0FBaEYsQ0FBQSxDQUF2QztBQUFBLGVBQU8sSUFBUCxDQUFBO09BUEE7QUFBQSxNQVFBLFlBQUEsR0FBZSxJQUFDLENBQUEsTUFBTSxDQUFDLHVCQUFSLENBQWdDLG9CQUFvQixDQUFDLEdBQXJELENBUmYsQ0FBQTtBQUFBLE1BU0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxVQUFSLENBQW1CLE1BQW5CLENBVEEsQ0FBQTtBQUFBLE1BVUEsSUFBQyxDQUFBLE1BQU0sQ0FBQywwQkFBUixDQUFtQyxvQkFBb0IsQ0FBQyxHQUFyQixHQUF5QixDQUE1RCxFQUErRCxZQUFBLEdBQWEsQ0FBNUUsRUFBK0U7QUFBQSxRQUFFLHlCQUFBLEVBQTJCLEtBQTdCO09BQS9FLENBVkEsQ0FBQTtBQUFBLE1BV0EsSUFBQyxDQUFBLE1BQU0sQ0FBQywwQkFBUixDQUFtQyxvQkFBb0IsQ0FBQyxHQUFyQixHQUF5QixDQUE1RCxFQUErRCxZQUEvRCxFQUE2RTtBQUFBLFFBQUUseUJBQUEsRUFBMkIsS0FBN0I7T0FBN0UsQ0FYQSxDQUFBO0FBQUEsTUFZQSxJQUFDLENBQUEsTUFBTSxDQUFDLE1BQVIsQ0FBQSxDQVpBLENBQUE7QUFBQSxNQWFBLElBQUMsQ0FBQSxNQUFNLENBQUMsZUFBUixDQUFBLENBYkEsQ0FBQTthQWNBLE1BZlU7SUFBQSxDQU5aLENBQUE7O0FBQUEsMEJBd0JBLFlBQUEsR0FBYyxTQUFDLE1BQUQsRUFBUyxVQUFULEVBQXFCLE1BQXJCLEdBQUE7QUFDWixVQUFBLFFBQUE7QUFBQSxNQUFBLFFBQUEsR0FBVyxNQUFPLENBQUEsVUFBQSxDQUFsQixDQUFBO2FBQ0EsTUFBTyxDQUFBLFVBQUEsQ0FBUCxHQUFxQixTQUFBLEdBQUE7QUFDbkIsWUFBQSxJQUFBO0FBQUEsUUFEb0IsOERBQ3BCLENBQUE7QUFBQSxRQUFBLElBQU8sTUFBTSxDQUFDLEtBQVAsQ0FBYSxJQUFiLEVBQW1CLElBQW5CLENBQUEsS0FBNEIsS0FBbkM7aUJBQ0UsUUFBUSxDQUFDLEtBQVQsQ0FBZSxJQUFmLEVBQXFCLElBQXJCLEVBREY7U0FEbUI7TUFBQSxFQUZUO0lBQUEsQ0F4QmQsQ0FBQTs7dUJBQUE7O01BRkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/Marvin/.atom/packages/language-babel/lib/insert-nl-jsx.coffee
