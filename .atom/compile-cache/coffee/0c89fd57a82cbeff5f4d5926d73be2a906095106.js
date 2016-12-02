(function() {
  var HeaderView, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom-space-pen-views').View;

  module.exports = HeaderView = (function(_super) {
    __extends(HeaderView, _super);

    function HeaderView() {
      return HeaderView.__super__.constructor.apply(this, arguments);
    }

    HeaderView.content = function() {
      return this.div({
        "class": 'panel-heading padded heading header-view'
      }, (function(_this) {
        return function() {
          _this.span({
            "class": 'heading-title',
            outlet: 'title'
          });
          _this.span({
            "class": 'heading-status',
            outlet: 'status'
          });
          return _this.span({
            "class": 'heading-close icon-remove-close pull-right',
            outlet: 'closeButton',
            click: 'close'
          });
        };
      })(this));
    };

    HeaderView.prototype.close = function() {
      return atom.commands.dispatch(this.workspaceView(), 'script:close-view');
    };

    HeaderView.prototype.setStatus = function(status) {
      this.status.removeClass('icon-alert icon-check icon-hourglass icon-stop');
      switch (status) {
        case 'start':
          return this.status.addClass('icon-hourglass');
        case 'stop':
          return this.status.addClass('icon-check');
        case 'kill':
          return this.status.addClass('icon-stop');
        case 'err':
          return this.status.addClass('icon-alert');
      }
    };

    HeaderView.prototype.workspaceView = function() {
      return atom.views.getView(atom.workspace);
    };

    return HeaderView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL01hcnZpbi8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL2hlYWRlci12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxnQkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUMsT0FBUSxPQUFBLENBQVEsc0JBQVIsRUFBUixJQUFELENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBRUosaUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsVUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sMENBQVA7T0FBTCxFQUF3RCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ3RELFVBQUEsS0FBQyxDQUFBLElBQUQsQ0FBTTtBQUFBLFlBQUEsT0FBQSxFQUFPLGVBQVA7QUFBQSxZQUF3QixNQUFBLEVBQVEsT0FBaEM7V0FBTixDQUFBLENBQUE7QUFBQSxVQUNBLEtBQUMsQ0FBQSxJQUFELENBQU07QUFBQSxZQUFBLE9BQUEsRUFBTyxnQkFBUDtBQUFBLFlBQXlCLE1BQUEsRUFBUSxRQUFqQztXQUFOLENBREEsQ0FBQTtpQkFFQSxLQUFDLENBQUEsSUFBRCxDQUNFO0FBQUEsWUFBQSxPQUFBLEVBQU8sNENBQVA7QUFBQSxZQUNBLE1BQUEsRUFBUSxhQURSO0FBQUEsWUFFQSxLQUFBLEVBQU8sT0FGUDtXQURGLEVBSHNEO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBeEQsRUFEUTtJQUFBLENBQVYsQ0FBQTs7QUFBQSx5QkFTQSxLQUFBLEdBQU8sU0FBQSxHQUFBO2FBQ0wsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLElBQUMsQ0FBQSxhQUFELENBQUEsQ0FBdkIsRUFBeUMsbUJBQXpDLEVBREs7SUFBQSxDQVRQLENBQUE7O0FBQUEseUJBWUEsU0FBQSxHQUFXLFNBQUMsTUFBRCxHQUFBO0FBQ1QsTUFBQSxJQUFDLENBQUEsTUFBTSxDQUFDLFdBQVIsQ0FBb0IsZ0RBQXBCLENBQUEsQ0FBQTtBQUNBLGNBQU8sTUFBUDtBQUFBLGFBQ08sT0FEUDtpQkFDb0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxRQUFSLENBQWlCLGdCQUFqQixFQURwQjtBQUFBLGFBRU8sTUFGUDtpQkFFbUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxRQUFSLENBQWlCLFlBQWpCLEVBRm5CO0FBQUEsYUFHTyxNQUhQO2lCQUdtQixJQUFDLENBQUEsTUFBTSxDQUFDLFFBQVIsQ0FBaUIsV0FBakIsRUFIbkI7QUFBQSxhQUlPLEtBSlA7aUJBSWtCLElBQUMsQ0FBQSxNQUFNLENBQUMsUUFBUixDQUFpQixZQUFqQixFQUpsQjtBQUFBLE9BRlM7SUFBQSxDQVpYLENBQUE7O0FBQUEseUJBb0JBLGFBQUEsR0FBZSxTQUFBLEdBQUE7YUFDYixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQXhCLEVBRGE7SUFBQSxDQXBCZixDQUFBOztzQkFBQTs7S0FGdUIsS0FIekIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/Marvin/.atom/packages/script/lib/header-view.coffee
