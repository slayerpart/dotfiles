(function() {
  var Breakpoint;

  module.exports = Breakpoint = (function() {
    Breakpoint.prototype.decoration = null;

    function Breakpoint(filename, lineNumber) {
      this.filename = filename;
      this.lineNumber = lineNumber;
    }

    Breakpoint.prototype.toCommand = function() {
      return "b " + this.filename + ":" + this.lineNumber;
    };

    return Breakpoint;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL01hcnZpbi8uYXRvbS9wYWNrYWdlcy9weXRob24tZGVidWdnZXIvbGliL2JyZWFrcG9pbnQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFVBQUE7O0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0oseUJBQUEsVUFBQSxHQUFZLElBQVosQ0FBQTs7QUFDYSxJQUFBLG9CQUFFLFFBQUYsRUFBYSxVQUFiLEdBQUE7QUFBMEIsTUFBekIsSUFBQyxDQUFBLFdBQUEsUUFBd0IsQ0FBQTtBQUFBLE1BQWQsSUFBQyxDQUFBLGFBQUEsVUFBYSxDQUExQjtJQUFBLENBRGI7O0FBQUEseUJBRUEsU0FBQSxHQUFXLFNBQUEsR0FBQTthQUNULElBQUEsR0FBTyxJQUFDLENBQUEsUUFBUixHQUFtQixHQUFuQixHQUF5QixJQUFDLENBQUEsV0FEakI7SUFBQSxDQUZYLENBQUE7O3NCQUFBOztNQUZGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/Marvin/.atom/packages/python-debugger/lib/breakpoint.coffee
