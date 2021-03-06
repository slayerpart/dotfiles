
/*
Requires https://github.com/jaspervdj/stylish-haskell
 */

(function() {
  "use strict";
  var Beautifier, StylishHaskell,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  module.exports = StylishHaskell = (function(_super) {
    __extends(StylishHaskell, _super);

    function StylishHaskell() {
      return StylishHaskell.__super__.constructor.apply(this, arguments);
    }

    StylishHaskell.prototype.name = "stylish-haskell";

    StylishHaskell.prototype.link = "https://github.com/jaspervdj/stylish-haskell";

    StylishHaskell.prototype.options = {
      Haskell: true
    };

    StylishHaskell.prototype.beautify = function(text, language, options) {
      return this.run("stylish-haskell", [this.tempFile("input", text)], {
        help: {
          link: "https://github.com/jaspervdj/stylish-haskell"
        }
      });
    };

    return StylishHaskell;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL01hcnZpbi8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9zdHlsaXNoLWhhc2tlbGwuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQTs7R0FBQTtBQUFBO0FBQUE7QUFBQSxFQUlBLFlBSkEsQ0FBQTtBQUFBLE1BQUEsMEJBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUtBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUixDQUxiLENBQUE7O0FBQUEsRUFPQSxNQUFNLENBQUMsT0FBUCxHQUF1QjtBQUNyQixxQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsNkJBQUEsSUFBQSxHQUFNLGlCQUFOLENBQUE7O0FBQUEsNkJBQ0EsSUFBQSxHQUFNLDhDQUROLENBQUE7O0FBQUEsNkJBR0EsT0FBQSxHQUFTO0FBQUEsTUFDUCxPQUFBLEVBQVMsSUFERjtLQUhULENBQUE7O0FBQUEsNkJBT0EsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakIsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUssaUJBQUwsRUFBd0IsQ0FDdEIsSUFBQyxDQUFBLFFBQUQsQ0FBVSxPQUFWLEVBQW1CLElBQW5CLENBRHNCLENBQXhCLEVBRUs7QUFBQSxRQUNELElBQUEsRUFBTTtBQUFBLFVBQ0osSUFBQSxFQUFNLDhDQURGO1NBREw7T0FGTCxFQURRO0lBQUEsQ0FQVixDQUFBOzswQkFBQTs7S0FENEMsV0FQOUMsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/Marvin/.atom/packages/atom-beautify/src/beautifiers/stylish-haskell.coffee
