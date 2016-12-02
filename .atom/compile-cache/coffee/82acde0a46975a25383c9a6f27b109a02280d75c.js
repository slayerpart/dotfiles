(function() {
  var HydrogenProvider;

  module.exports = HydrogenProvider = (function() {
    function HydrogenProvider(_hydrogen) {
      this._hydrogen = _hydrogen;
      this._happy = true;
    }

    HydrogenProvider.prototype.onDidChangeKernel = function(callback) {
      return this._hydrogen.emitter.on('did-change-kernel', function(kernel) {
        if (kernel != null) {
          return callback(kernel.getPluginWrapper());
        } else {
          return callback(null);
        }
      });
    };

    HydrogenProvider.prototype.getActiveKernel = function() {
      if (!this._hydrogen.kernel) {
        return null;
      }
      return this._hydrogen.kernel.getPluginWrapper();
    };

    return HydrogenProvider;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL01hcnZpbi8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvcGx1Z2luLWFwaS9oeWRyb2dlbi1wcm92aWRlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsZ0JBQUE7O0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ1csSUFBQSwwQkFBRSxTQUFGLEdBQUE7QUFDVCxNQURVLElBQUMsQ0FBQSxZQUFBLFNBQ1gsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFWLENBRFM7SUFBQSxDQUFiOztBQUFBLCtCQUdBLGlCQUFBLEdBQW1CLFNBQUMsUUFBRCxHQUFBO2FBQ2YsSUFBQyxDQUFBLFNBQVMsQ0FBQyxPQUFPLENBQUMsRUFBbkIsQ0FBc0IsbUJBQXRCLEVBQTJDLFNBQUMsTUFBRCxHQUFBO0FBQ3ZDLFFBQUEsSUFBRyxjQUFIO2lCQUNJLFFBQUEsQ0FBUyxNQUFNLENBQUMsZ0JBQVAsQ0FBQSxDQUFULEVBREo7U0FBQSxNQUFBO2lCQUdJLFFBQUEsQ0FBUyxJQUFULEVBSEo7U0FEdUM7TUFBQSxDQUEzQyxFQURlO0lBQUEsQ0FIbkIsQ0FBQTs7QUFBQSwrQkFVQSxlQUFBLEdBQWlCLFNBQUEsR0FBQTtBQUNiLE1BQUEsSUFBQSxDQUFBLElBQVEsQ0FBQSxTQUFTLENBQUMsTUFBbEI7QUFDSSxlQUFPLElBQVAsQ0FESjtPQUFBO0FBR0EsYUFBTyxJQUFDLENBQUEsU0FBUyxDQUFDLE1BQU0sQ0FBQyxnQkFBbEIsQ0FBQSxDQUFQLENBSmE7SUFBQSxDQVZqQixDQUFBOzs0QkFBQTs7TUFGSixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/Marvin/.atom/packages/Hydrogen/lib/plugin-api/hydrogen-provider.coffee
