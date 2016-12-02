(function() {
  var HydrogenKernel;

  module.exports = HydrogenKernel = (function() {
    function HydrogenKernel(_kernel) {
      this._kernel = _kernel;
      this.destroyed = false;
    }

    HydrogenKernel.prototype._assertNotDestroyed = function() {
      if (this.destroyed) {
        throw new Error('HydrogenKernel: operation not allowed because the kernel has been destroyed');
      }
    };

    HydrogenKernel.prototype.onDidDestroy = function(callback) {
      this._assertNotDestroyed();
      return this._kernel.emitter.on('did-destroy', callback);
    };

    HydrogenKernel.prototype.getConnectionFile = function() {
      var connectionFile;
      this._assertNotDestroyed();
      connectionFile = this._kernel.connectionFile;
      if (connectionFile == null) {
        return null;
      }
      return connectionFile;
    };

    return HydrogenKernel;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL01hcnZpbi8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvcGx1Z2luLWFwaS9oeWRyb2dlbi1rZXJuZWwuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBR0E7QUFBQSxNQUFBLGNBQUE7O0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ1csSUFBQSx3QkFBRSxPQUFGLEdBQUE7QUFDVCxNQURVLElBQUMsQ0FBQSxVQUFBLE9BQ1gsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLFNBQUQsR0FBYSxLQUFiLENBRFM7SUFBQSxDQUFiOztBQUFBLDZCQUdBLG1CQUFBLEdBQXFCLFNBQUEsR0FBQTtBQUdqQixNQUFBLElBQUcsSUFBQyxDQUFBLFNBQUo7QUFDSSxjQUFVLElBQUEsS0FBQSxDQUFNLDZFQUFOLENBQVYsQ0FESjtPQUhpQjtJQUFBLENBSHJCLENBQUE7O0FBQUEsNkJBU0EsWUFBQSxHQUFjLFNBQUMsUUFBRCxHQUFBO0FBQ1YsTUFBQSxJQUFDLENBQUEsbUJBQUQsQ0FBQSxDQUFBLENBQUE7QUFDQSxhQUFPLElBQUMsQ0FBQSxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQWpCLENBQW9CLGFBQXBCLEVBQW1DLFFBQW5DLENBQVAsQ0FGVTtJQUFBLENBVGQsQ0FBQTs7QUFBQSw2QkFhQSxpQkFBQSxHQUFtQixTQUFBLEdBQUE7QUFDZixVQUFBLGNBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxtQkFBRCxDQUFBLENBQUEsQ0FBQTtBQUFBLE1BQ0EsY0FBQSxHQUFpQixJQUFDLENBQUEsT0FBTyxDQUFDLGNBRDFCLENBQUE7QUFFQSxNQUFBLElBQU8sc0JBQVA7QUFHSSxlQUFPLElBQVAsQ0FISjtPQUZBO0FBTUEsYUFBTyxjQUFQLENBUGU7SUFBQSxDQWJuQixDQUFBOzswQkFBQTs7TUFGSixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/Marvin/.atom/packages/Hydrogen/lib/plugin-api/hydrogen-kernel.coffee
