(function() {
  var $$, DefinitionsView, SelectListView, path, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $$ = _ref.$$, SelectListView = _ref.SelectListView;

  path = require('path');

  module.exports = DefinitionsView = (function(_super) {
    __extends(DefinitionsView, _super);

    function DefinitionsView() {
      return DefinitionsView.__super__.constructor.apply(this, arguments);
    }

    DefinitionsView.prototype.initialize = function(matches) {
      DefinitionsView.__super__.initialize.apply(this, arguments);
      this.addClass('symbols-view');
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      this.setLoading('Looking for definitions');
      return this.focusFilterEditor();
    };

    DefinitionsView.prototype.destroy = function() {
      this.cancel();
      return this.panel.destroy();
    };

    DefinitionsView.prototype.viewForItem = function(_arg) {
      var column, fileName, line, projectPath, relativePath, text, type, _i, _len, _ref1;
      text = _arg.text, fileName = _arg.fileName, line = _arg.line, column = _arg.column, type = _arg.type;
      _ref1 = atom.project.getPaths();
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        projectPath = _ref1[_i];
        relativePath = path.relative(projectPath, fileName);
        if (relativePath.indexOf('..') !== 0) {
          fileName = relativePath;
          break;
        }
      }
      return $$(function() {
        return this.li({
          "class": 'two-lines'
        }, (function(_this) {
          return function() {
            _this.div("" + type + " " + text, {
              "class": 'primary-line'
            });
            return _this.div("" + fileName + ", line " + (line + 1), {
              "class": 'secondary-line'
            });
          };
        })(this));
      });
    };

    DefinitionsView.prototype.getFilterKey = function() {
      return 'fileName';
    };

    DefinitionsView.prototype.getEmptyMessage = function(itemCount) {
      if (itemCount === 0) {
        return 'No definition found';
      } else {
        return DefinitionsView.__super__.getEmptyMessage.apply(this, arguments);
      }
    };

    DefinitionsView.prototype.confirmed = function(_arg) {
      var column, fileName, line, promise;
      fileName = _arg.fileName, line = _arg.line, column = _arg.column;
      this.cancelPosition = null;
      this.cancel();
      promise = atom.workspace.open(fileName);
      return promise.then(function(editor) {
        editor.setCursorBufferPosition([line, column]);
        return editor.scrollToCursorPosition();
      });
    };

    DefinitionsView.prototype.cancelled = function() {
      return this.panel.hide();
    };

    return DefinitionsView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL01hcnZpbi8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtcHl0aG9uL2xpYi9kZWZpbml0aW9ucy12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwrQ0FBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsT0FBdUIsT0FBQSxDQUFRLHNCQUFSLENBQXZCLEVBQUMsVUFBQSxFQUFELEVBQUssc0JBQUEsY0FBTCxDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRFAsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixzQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsOEJBQUEsVUFBQSxHQUFZLFNBQUMsT0FBRCxHQUFBO0FBQ1YsTUFBQSxpREFBQSxTQUFBLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFFBQUQsQ0FBVSxjQUFWLENBREEsQ0FBQTs7UUFFQSxJQUFDLENBQUEsUUFBUyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBNkI7QUFBQSxVQUFBLElBQUEsRUFBTSxJQUFOO1NBQTdCO09BRlY7QUFBQSxNQUdBLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxDQUFBLENBSEEsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLFVBQUQsQ0FBWSx5QkFBWixDQUpBLENBQUE7YUFLQSxJQUFDLENBQUEsaUJBQUQsQ0FBQSxFQU5VO0lBQUEsQ0FBWixDQUFBOztBQUFBLDhCQVFBLE9BQUEsR0FBUyxTQUFBLEdBQUE7QUFDUCxNQUFBLElBQUMsQ0FBQSxNQUFELENBQUEsQ0FBQSxDQUFBO2FBQ0EsSUFBQyxDQUFBLEtBQUssQ0FBQyxPQUFQLENBQUEsRUFGTztJQUFBLENBUlQsQ0FBQTs7QUFBQSw4QkFZQSxXQUFBLEdBQWEsU0FBQyxJQUFELEdBQUE7QUFDWCxVQUFBLDhFQUFBO0FBQUEsTUFEYSxZQUFBLE1BQU0sZ0JBQUEsVUFBVSxZQUFBLE1BQU0sY0FBQSxRQUFRLFlBQUEsSUFDM0MsQ0FBQTtBQUFBO0FBQUEsV0FBQSw0Q0FBQTtnQ0FBQTtBQUNFLFFBQUEsWUFBQSxHQUFlLElBQUksQ0FBQyxRQUFMLENBQWMsV0FBZCxFQUEyQixRQUEzQixDQUFmLENBQUE7QUFDQSxRQUFBLElBQUcsWUFBWSxDQUFDLE9BQWIsQ0FBcUIsSUFBckIsQ0FBQSxLQUE4QixDQUFqQztBQUNFLFVBQUEsUUFBQSxHQUFXLFlBQVgsQ0FBQTtBQUNBLGdCQUZGO1NBRkY7QUFBQSxPQUFBO0FBS0EsYUFBTyxFQUFBLENBQUcsU0FBQSxHQUFBO2VBQ1IsSUFBQyxDQUFBLEVBQUQsQ0FBSTtBQUFBLFVBQUEsT0FBQSxFQUFPLFdBQVA7U0FBSixFQUF3QixDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTtBQUN0QixZQUFBLEtBQUMsQ0FBQSxHQUFELENBQUssRUFBQSxHQUFHLElBQUgsR0FBUSxHQUFSLEdBQVcsSUFBaEIsRUFBd0I7QUFBQSxjQUFBLE9BQUEsRUFBTyxjQUFQO2FBQXhCLENBQUEsQ0FBQTttQkFDQSxLQUFDLENBQUEsR0FBRCxDQUFLLEVBQUEsR0FBRyxRQUFILEdBQVksU0FBWixHQUFvQixDQUFDLElBQUEsR0FBTyxDQUFSLENBQXpCLEVBQXNDO0FBQUEsY0FBQSxPQUFBLEVBQU8sZ0JBQVA7YUFBdEMsRUFGc0I7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF4QixFQURRO01BQUEsQ0FBSCxDQUFQLENBTlc7SUFBQSxDQVpiLENBQUE7O0FBQUEsOEJBdUJBLFlBQUEsR0FBYyxTQUFBLEdBQUE7YUFBRyxXQUFIO0lBQUEsQ0F2QmQsQ0FBQTs7QUFBQSw4QkF5QkEsZUFBQSxHQUFpQixTQUFDLFNBQUQsR0FBQTtBQUNmLE1BQUEsSUFBRyxTQUFBLEtBQWEsQ0FBaEI7ZUFDRSxzQkFERjtPQUFBLE1BQUE7ZUFHRSxzREFBQSxTQUFBLEVBSEY7T0FEZTtJQUFBLENBekJqQixDQUFBOztBQUFBLDhCQStCQSxTQUFBLEdBQVcsU0FBQyxJQUFELEdBQUE7QUFDVCxVQUFBLCtCQUFBO0FBQUEsTUFEVyxnQkFBQSxVQUFVLFlBQUEsTUFBTSxjQUFBLE1BQzNCLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxjQUFELEdBQWtCLElBQWxCLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxNQUFELENBQUEsQ0FEQSxDQUFBO0FBQUEsTUFFQSxPQUFBLEdBQVUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLFFBQXBCLENBRlYsQ0FBQTthQUdBLE9BQU8sQ0FBQyxJQUFSLENBQWEsU0FBQyxNQUFELEdBQUE7QUFDWCxRQUFBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLElBQUQsRUFBTyxNQUFQLENBQS9CLENBQUEsQ0FBQTtlQUNBLE1BQU0sQ0FBQyxzQkFBUCxDQUFBLEVBRlc7TUFBQSxDQUFiLEVBSlM7SUFBQSxDQS9CWCxDQUFBOztBQUFBLDhCQXVDQSxTQUFBLEdBQVcsU0FBQSxHQUFBO2FBQ1QsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLENBQUEsRUFEUztJQUFBLENBdkNYLENBQUE7OzJCQUFBOztLQUQ0QixlQUo5QixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/Marvin/.atom/packages/autocomplete-python/lib/definitions-view.coffee
