(function() {
  module.exports = {
    findNimProjectFile: function(editorfile) {
      var error, file, filepath, files, fs, name, path, stats, tfile, _i, _len;
      path = require('path');
      fs = require('fs');
      try {
        stats = fs.statSync(editorfile + "s");
        return editorfile;
      } catch (_error) {}
      try {
        stats = fs.statSync(editorfile + ".cfg");
        return editorfile;
      } catch (_error) {}
      try {
        stats = fs.statSync(editorfile + "cfg");
        return editorfile;
      } catch (_error) {}
      filepath = path.dirname(editorfile);
      files = fs.readdirSync(filepath);
      files.sort();
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        name = filepath + '/' + file;
        if (fs.statSync(name).isFile()) {
          if (path.extname(name) === '.nims' || path.extname(name) === '.nimcgf' || path.extname(name) === '.cfg') {
            try {
              tfile = name.slice(0, -1);
              stats = fs.statSync(tfile);
              return tfile;
            } catch (_error) {
              error = _error;
              console.log("File does not exist.");
            }
          }
        }
      }
      return editorfile;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL01hcnZpbi8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL2dyYW1tYXItdXRpbHMvbmltLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUNBO0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQU9FO0FBQUEsSUFBQSxrQkFBQSxFQUFvQixTQUFDLFVBQUQsR0FBQTtBQUNsQixVQUFBLG9FQUFBO0FBQUEsTUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBO0FBQUEsTUFDQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FETCxDQUFBO0FBS0E7QUFDRSxRQUFBLEtBQUEsR0FBUSxFQUFFLENBQUMsUUFBSCxDQUFZLFVBQUEsR0FBYSxHQUF6QixDQUFSLENBQUE7QUFDQSxlQUFPLFVBQVAsQ0FGRjtPQUFBLGtCQUxBO0FBU0E7QUFDRSxRQUFBLEtBQUEsR0FBUSxFQUFFLENBQUMsUUFBSCxDQUFZLFVBQUEsR0FBYSxNQUF6QixDQUFSLENBQUE7QUFDQSxlQUFPLFVBQVAsQ0FGRjtPQUFBLGtCQVRBO0FBYUE7QUFDRSxRQUFBLEtBQUEsR0FBUSxFQUFFLENBQUMsUUFBSCxDQUFZLFVBQUEsR0FBYSxLQUF6QixDQUFSLENBQUE7QUFDQSxlQUFPLFVBQVAsQ0FGRjtPQUFBLGtCQWJBO0FBQUEsTUFzQkEsUUFBQSxHQUFXLElBQUksQ0FBQyxPQUFMLENBQWEsVUFBYixDQXRCWCxDQUFBO0FBQUEsTUF1QkEsS0FBQSxHQUFRLEVBQUUsQ0FBQyxXQUFILENBQWUsUUFBZixDQXZCUixDQUFBO0FBQUEsTUF3QkEsS0FBSyxDQUFDLElBQU4sQ0FBQSxDQXhCQSxDQUFBO0FBeUJBLFdBQUEsNENBQUE7eUJBQUE7QUFDRSxRQUFBLElBQUEsR0FBTyxRQUFBLEdBQVcsR0FBWCxHQUFpQixJQUF4QixDQUFBO0FBQ0EsUUFBQSxJQUFJLEVBQUUsQ0FBQyxRQUFILENBQVksSUFBWixDQUFpQixDQUFDLE1BQWxCLENBQUEsQ0FBSjtBQUNJLFVBQUEsSUFBRyxJQUFJLENBQUMsT0FBTCxDQUFhLElBQWIsQ0FBQSxLQUFvQixPQUFwQixJQUNELElBQUksQ0FBQyxPQUFMLENBQWEsSUFBYixDQUFBLEtBQW9CLFNBRG5CLElBRUQsSUFBSSxDQUFDLE9BQUwsQ0FBYSxJQUFiLENBQUEsS0FBb0IsTUFGdEI7QUFHSTtBQUNFLGNBQUEsS0FBQSxHQUFRLElBQUksQ0FBQyxLQUFMLENBQVcsQ0FBWCxFQUFjLENBQUEsQ0FBZCxDQUFSLENBQUE7QUFBQSxjQUNBLEtBQUEsR0FBUSxFQUFFLENBQUMsUUFBSCxDQUFZLEtBQVosQ0FEUixDQUFBO0FBRUEscUJBQU8sS0FBUCxDQUhGO2FBQUEsY0FBQTtBQUtFLGNBREksY0FDSixDQUFBO0FBQUEsY0FBQSxPQUFPLENBQUMsR0FBUixDQUFZLHNCQUFaLENBQUEsQ0FMRjthQUhKO1dBREo7U0FGRjtBQUFBLE9BekJBO0FBdUNBLGFBQU8sVUFBUCxDQXhDa0I7SUFBQSxDQUFwQjtHQVBGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/Marvin/.atom/packages/script/lib/grammar-utils/nim.coffee
