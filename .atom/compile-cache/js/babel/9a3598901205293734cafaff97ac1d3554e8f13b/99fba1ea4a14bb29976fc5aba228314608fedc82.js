Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _child_process = require("child_process");

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _atom = require("atom");

"use babel";

var Compiler = (function () {
  function Compiler() {
    _classCallCheck(this, Compiler);

    this.emitter = new _atom.Emitter();
  }

  _createClass(Compiler, [{
    key: "onDidCompileSuccess",
    value: function onDidCompileSuccess(callback) {
      this.emitter.on("did-compile-success", callback);
    }
  }, {
    key: "onDidCompileError",
    value: function onDidCompileError(callback) {
      this.emitter.on("did-compile-error", callback);
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.emitter.dispose();
    }
  }, {
    key: "execute",
    value: function execute(cmd, options, project) {
      var _this = this;

      args = this.arguments(project);
      command = cmd + " " + args.join(" ");
      proc = (0, _child_process.exec)(command, options, function (err, stdout, stderr) {
        _this.pid = proc.pid;
        _this.err = err;
        _this.stdout = stdout;
        _this.stderr = stderr;
        if (err) {
          _this.emitter.emit("did-compile-error");
        } else {
          _this.emitter.emit("did-compile-success");
        }
      });
    }
  }, {
    key: "arguments",
    value: function _arguments(project) {
      args = [];

      args.push("-interaction=nonstopmode -f -cd -pdf -file-line-error");

      if (atom.config.get("latex-plus.bibtexEnabled")) {
        args.push("-bibtex");
      }

      if (atom.config.get("latex-plus.shellEscapeEnabled")) {
        args.push("-shell-escape");
      }

      if (project.texProgram != "pdflatex") {
        args.push(project.texProgram);
      }

      args.push("-outdir=\"" + project.texOutput + "\"");
      args.push("\"" + project.texRoot + "\"");

      return args;
    }
  }, {
    key: "kill",
    value: function kill(pid) {
      if (!this.pid) {
        console.log("No pid to kill.");
      } else {
        try {
          process.kill(this.pid, "SIGINT");
        } catch (e) {
          if (e.code == "ESRCH") {
            throw new Error("Process " + this.pid + " has already been killed.");
          } else {
            throw e;
          }
        }
      }
    }
  }]);

  return Compiler;
})();

exports["default"] = Compiler;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9NYXJ2aW4vLmF0b20vcGFja2FnZXMvbGF0ZXgtcGx1cy9saWIvY29tcGlsZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs2QkFFbUIsZUFBZTs7a0JBQ25CLElBQUk7Ozs7b0JBQ0YsTUFBTTs7OztvQkFDRCxNQUFNOztBQUw1QixXQUFXLENBQUM7O0lBT1MsUUFBUTtBQUNoQixXQURRLFFBQVEsR0FDYjswQkFESyxRQUFROztBQUV6QixRQUFJLENBQUMsT0FBTyxHQUFHLG1CQUFXLENBQUM7R0FDNUI7O2VBSGtCLFFBQVE7O1dBS1IsNkJBQUMsUUFBUSxFQUFFO0FBQzVCLFVBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLHFCQUFxQixFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQ2xEOzs7V0FFZ0IsMkJBQUMsUUFBUSxFQUFFO0FBQzFCLFVBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLG1CQUFtQixFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQ2hEOzs7V0FFTSxtQkFBRztBQUNSLFVBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDeEI7OztXQUVNLGlCQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFOzs7QUFDN0IsVUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDL0IsYUFBTyxHQUFNLEdBQUcsU0FBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxBQUFFLENBQUM7QUFDckMsVUFBSSxHQUFHLHlCQUFLLE9BQU8sRUFBRSxPQUFPLEVBQUUsVUFBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBSztBQUNyRCxjQUFLLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO0FBQ3BCLGNBQUssR0FBRyxHQUFHLEdBQUcsQ0FBQztBQUNmLGNBQUssTUFBTSxHQUFHLE1BQU0sQ0FBQztBQUNyQixjQUFLLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFDckIsWUFBSSxHQUFHLEVBQUU7QUFDUCxnQkFBSyxPQUFPLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUM7U0FDeEMsTUFBTTtBQUNMLGdCQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsQ0FBQztTQUMxQztPQUNGLENBQUMsQ0FBQztLQUNKOzs7V0FFUSxvQkFBQyxPQUFPLEVBQUU7QUFDakIsVUFBSSxHQUFHLEVBQUUsQ0FBQzs7QUFFVixVQUFJLENBQUMsSUFBSSxDQUFDLHVEQUF1RCxDQUFDLENBQUM7O0FBRW5FLFVBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsMEJBQTBCLENBQUMsRUFBRTtBQUMvQyxZQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO09BQ3RCOztBQUVELFVBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsK0JBQStCLENBQUMsRUFBRTtBQUNwRCxZQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO09BQzVCOztBQUVELFVBQUksT0FBTyxDQUFDLFVBQVUsSUFBSSxVQUFVLEVBQUU7QUFDcEMsWUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUE7T0FDOUI7O0FBRUQsVUFBSSxDQUFDLElBQUksZ0JBQWMsT0FBTyxDQUFDLFNBQVMsUUFBSyxDQUFDO0FBQzlDLFVBQUksQ0FBQyxJQUFJLFFBQU0sT0FBTyxDQUFDLE9BQU8sUUFBSyxDQUFDOztBQUVwQyxhQUFPLElBQUksQ0FBQTtLQUNaOzs7V0FFRyxjQUFDLEdBQUcsRUFBRTtBQUNSLFVBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO0FBQ2IsZUFBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBO09BQy9CLE1BQU07QUFDTCxZQUFJO0FBQ0YsaUJBQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQTtTQUNqQyxDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ1YsY0FBSSxDQUFDLENBQUMsSUFBSSxJQUFJLE9BQU8sRUFBRTtBQUNyQixrQkFBTSxJQUFJLEtBQUssY0FBWSxJQUFJLENBQUMsR0FBRywrQkFBNEIsQ0FBQTtXQUNoRSxNQUFNO0FBQ0wsa0JBQU8sQ0FBQyxDQUFDO1dBQ1Y7U0FDRjtPQUNGO0tBQ0Y7OztTQXRFa0IsUUFBUTs7O3FCQUFSLFFBQVEiLCJmaWxlIjoiL1VzZXJzL01hcnZpbi8uYXRvbS9wYWNrYWdlcy9sYXRleC1wbHVzL2xpYi9jb21waWxlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIGJhYmVsXCI7XG5cbmltcG9ydCB7ZXhlY30gZnJvbSBcImNoaWxkX3Byb2Nlc3NcIjtcbmltcG9ydCBmcyBmcm9tIFwiZnNcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQge0VtaXR0ZXJ9IGZyb20gXCJhdG9tXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbXBpbGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXI7XG4gIH1cblxuICBvbkRpZENvbXBpbGVTdWNjZXNzKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5lbWl0dGVyLm9uKFwiZGlkLWNvbXBpbGUtc3VjY2Vzc1wiLCBjYWxsYmFjayk7XG4gIH1cblxuICBvbkRpZENvbXBpbGVFcnJvcihjYWxsYmFjaykge1xuICAgIHRoaXMuZW1pdHRlci5vbihcImRpZC1jb21waWxlLWVycm9yXCIsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5lbWl0dGVyLmRpc3Bvc2UoKTtcbiAgfVxuXG4gIGV4ZWN1dGUoY21kLCBvcHRpb25zLCBwcm9qZWN0KSB7XG4gICAgYXJncyA9IHRoaXMuYXJndW1lbnRzKHByb2plY3QpO1xuICAgIGNvbW1hbmQgPSBgJHtjbWR9ICR7YXJncy5qb2luKFwiIFwiKX1gO1xuICAgIHByb2MgPSBleGVjKGNvbW1hbmQsIG9wdGlvbnMsIChlcnIsIHN0ZG91dCwgc3RkZXJyKSA9PiB7XG4gICAgICB0aGlzLnBpZCA9IHByb2MucGlkO1xuICAgICAgdGhpcy5lcnIgPSBlcnI7XG4gICAgICB0aGlzLnN0ZG91dCA9IHN0ZG91dDtcbiAgICAgIHRoaXMuc3RkZXJyID0gc3RkZXJyO1xuICAgICAgaWYgKGVycikge1xuICAgICAgICB0aGlzLmVtaXR0ZXIuZW1pdChcImRpZC1jb21waWxlLWVycm9yXCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoXCJkaWQtY29tcGlsZS1zdWNjZXNzXCIpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgYXJndW1lbnRzKHByb2plY3QpIHtcbiAgICBhcmdzID0gW107XG5cbiAgICBhcmdzLnB1c2goXCItaW50ZXJhY3Rpb249bm9uc3RvcG1vZGUgLWYgLWNkIC1wZGYgLWZpbGUtbGluZS1lcnJvclwiKTtcblxuICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoXCJsYXRleC1wbHVzLmJpYnRleEVuYWJsZWRcIikpIHtcbiAgICAgIGFyZ3MucHVzaChcIi1iaWJ0ZXhcIik7XG4gICAgfVxuXG4gICAgaWYgKGF0b20uY29uZmlnLmdldChcImxhdGV4LXBsdXMuc2hlbGxFc2NhcGVFbmFibGVkXCIpKSB7XG4gICAgICBhcmdzLnB1c2goXCItc2hlbGwtZXNjYXBlXCIpO1xuICAgIH1cblxuICAgIGlmIChwcm9qZWN0LnRleFByb2dyYW0gIT0gXCJwZGZsYXRleFwiKSB7XG4gICAgICBhcmdzLnB1c2gocHJvamVjdC50ZXhQcm9ncmFtKVxuICAgIH1cblxuICAgIGFyZ3MucHVzaChgLW91dGRpcj1cXFwiJHtwcm9qZWN0LnRleE91dHB1dH1cXFwiYCk7XG4gICAgYXJncy5wdXNoKGBcXFwiJHtwcm9qZWN0LnRleFJvb3R9XFxcImApO1xuXG4gICAgcmV0dXJuIGFyZ3NcbiAgfVxuXG4gIGtpbGwocGlkKSB7XG4gICAgaWYgKCF0aGlzLnBpZCkge1xuICAgICAgY29uc29sZS5sb2coXCJObyBwaWQgdG8ga2lsbC5cIilcbiAgICB9IGVsc2Uge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcHJvY2Vzcy5raWxsKHRoaXMucGlkLCBcIlNJR0lOVFwiKVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBpZiAoZS5jb2RlID09IFwiRVNSQ0hcIikge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgUHJvY2VzcyAke3RoaXMucGlkfSBoYXMgYWxyZWFkeSBiZWVuIGtpbGxlZC5gKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IChlKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXX0=
//# sourceURL=/Users/Marvin/.atom/packages/latex-plus/lib/compiler.js
