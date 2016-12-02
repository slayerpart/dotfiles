(function() {
  var Linter, Pep8Linter, linterPath,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  linterPath = atom.packages.getLoadedPackage("linter").path;

  console.log(linterPath);

  Linter = require("" + linterPath + "/lib/linter");

  Pep8Linter = (function(_super) {
    __extends(Pep8Linter, _super);

    Pep8Linter.syntax = ['source.python'];

    Pep8Linter.prototype.cmd = 'pep8';

    Pep8Linter.prototype.executablePath = null;

    Pep8Linter.prototype.linterName = 'pep8';

    Pep8Linter.prototype.regex = ':(?<line>\\d+):(?<col>\\d+): ((?<error>E\\d+)|(?<warning>W\\d+)) (?<message>.*?)\n';

    function Pep8Linter(editor) {
      var errorCodes;
      Pep8Linter.__super__.constructor.call(this, editor);
      errorCodes = atom.config.get('linter-python-pep8.ignoreErrorCodes');
      if (errorCodes) {
        this.cmd += " --ignore=" + (errorCodes.toString());
      }
      atom.config.observe('linter-python-pep8.pep8DirToExecutable', (function(_this) {
        return function() {
          return _this.executablePath = atom.config.get('linter-python-pep8.pep8DirToExecutable');
        };
      })(this));
    }

    Pep8Linter.prototype.destroy = function() {
      return atom.config.unobserve('linter-python-pep8.pep8DirToExecutable');
    };

    return Pep8Linter;

  })(Linter);

  module.exports = Pep8Linter;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL01hcnZpbi8uYXRvbS9wYWNrYWdlcy9saW50ZXItcHl0aG9uLXBlcDgvbGliL2xpbnRlci1weXRob24tcGVwOC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsOEJBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLFVBQUEsR0FBYSxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFkLENBQStCLFFBQS9CLENBQXdDLENBQUMsSUFBdEQsQ0FBQTs7QUFBQSxFQUNBLE9BQU8sQ0FBQyxHQUFSLENBQVksVUFBWixDQURBLENBQUE7O0FBQUEsRUFFQSxNQUFBLEdBQVMsT0FBQSxDQUFRLEVBQUEsR0FBRyxVQUFILEdBQWMsYUFBdEIsQ0FGVCxDQUFBOztBQUFBLEVBSU07QUFDSixpQ0FBQSxDQUFBOztBQUFBLElBQUEsVUFBQyxDQUFBLE1BQUQsR0FBUyxDQUFDLGVBQUQsQ0FBVCxDQUFBOztBQUFBLHlCQUVBLEdBQUEsR0FBSyxNQUZMLENBQUE7O0FBQUEseUJBSUEsY0FBQSxHQUFnQixJQUpoQixDQUFBOztBQUFBLHlCQU1BLFVBQUEsR0FBWSxNQU5aLENBQUE7O0FBQUEseUJBU0EsS0FBQSxHQUNFLG9GQVZGLENBQUE7O0FBYWEsSUFBQSxvQkFBQyxNQUFELEdBQUE7QUFDWCxVQUFBLFVBQUE7QUFBQSxNQUFBLDRDQUFNLE1BQU4sQ0FBQSxDQUFBO0FBQUEsTUFFQSxVQUFBLEdBQWEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHFDQUFoQixDQUZiLENBQUE7QUFJQSxNQUFBLElBQUcsVUFBSDtBQUNFLFFBQUEsSUFBQyxDQUFBLEdBQUQsSUFBUyxZQUFBLEdBQVcsQ0FBQyxVQUFVLENBQUMsUUFBWCxDQUFBLENBQUQsQ0FBcEIsQ0FERjtPQUpBO0FBQUEsTUFPQSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0Isd0NBQXBCLEVBQThELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQzVELEtBQUMsQ0FBQSxjQUFELEdBQWtCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix3Q0FBaEIsRUFEMEM7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE5RCxDQVBBLENBRFc7SUFBQSxDQWJiOztBQUFBLHlCQXdCQSxPQUFBLEdBQVMsU0FBQSxHQUFBO2FBQ1AsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFaLENBQXNCLHdDQUF0QixFQURPO0lBQUEsQ0F4QlQsQ0FBQTs7c0JBQUE7O0tBRHVCLE9BSnpCLENBQUE7O0FBQUEsRUFnQ0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsVUFoQ2pCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/Marvin/.atom/packages/linter-python-pep8/lib/linter-python-pep8.coffee
