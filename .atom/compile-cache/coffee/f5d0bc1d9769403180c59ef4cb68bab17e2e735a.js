(function() {
  var RangeFinder, beautify, prettify;

  RangeFinder = require('./range-finder');

  beautify = require('js-beautify').html;

  module.exports = {
    activate: function() {
      return atom.commands.add('atom-text-editor', {
        'prettify:prettify': function(event) {
          var editor;
          editor = this.getModel();
          return prettify(editor);
        }
      });
    }
  };

  prettify = function(editor) {
    var sortableRanges;
    sortableRanges = RangeFinder.rangesFor(editor);
    return sortableRanges.forEach(function(range) {
      var text;
      text = editor.getTextInBufferRange(range);
      text = beautify(text, {
        'indent_size': atom.config.get('editor.tabLength')
      });
      return editor.setTextInBufferRange(range, text);
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL01hcnZpbi8uYXRvbS9wYWNrYWdlcy9hdG9tLXByZXR0aWZ5L2xpYi9wcmV0dGlmeS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsK0JBQUE7O0FBQUEsRUFBQSxXQUFBLEdBQWMsT0FBQSxDQUFRLGdCQUFSLENBQWQsQ0FBQTs7QUFBQSxFQUNBLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUixDQUFzQixDQUFDLElBRGxDLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxRQUFBLEVBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGtCQUFsQixFQUFzQztBQUFBLFFBQUEsbUJBQUEsRUFBcUIsU0FBQyxLQUFELEdBQUE7QUFDekQsY0FBQSxNQUFBO0FBQUEsVUFBQSxNQUFBLEdBQVMsSUFBQyxDQUFBLFFBQUQsQ0FBQSxDQUFULENBQUE7aUJBQ0EsUUFBQSxDQUFTLE1BQVQsRUFGeUQ7UUFBQSxDQUFyQjtPQUF0QyxFQURRO0lBQUEsQ0FBVjtHQUpGLENBQUE7O0FBQUEsRUFTQSxRQUFBLEdBQVcsU0FBQyxNQUFELEdBQUE7QUFDVCxRQUFBLGNBQUE7QUFBQSxJQUFBLGNBQUEsR0FBaUIsV0FBVyxDQUFDLFNBQVosQ0FBc0IsTUFBdEIsQ0FBakIsQ0FBQTtXQUNBLGNBQWMsQ0FBQyxPQUFmLENBQXVCLFNBQUMsS0FBRCxHQUFBO0FBQ3JCLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQSxHQUFPLE1BQU0sQ0FBQyxvQkFBUCxDQUE0QixLQUE1QixDQUFQLENBQUE7QUFBQSxNQUNBLElBQUEsR0FBTyxRQUFBLENBQVMsSUFBVCxFQUNMO0FBQUEsUUFBQSxhQUFBLEVBQWUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGtCQUFoQixDQUFmO09BREssQ0FEUCxDQUFBO2FBR0EsTUFBTSxDQUFDLG9CQUFQLENBQTRCLEtBQTVCLEVBQW1DLElBQW5DLEVBSnFCO0lBQUEsQ0FBdkIsRUFGUztFQUFBLENBVFgsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/Marvin/.atom/packages/atom-prettify/lib/prettify.coffee
