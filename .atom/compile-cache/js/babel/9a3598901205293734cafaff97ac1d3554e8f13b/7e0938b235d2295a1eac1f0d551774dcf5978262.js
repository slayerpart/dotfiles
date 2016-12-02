Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _atom = require("atom");

"use babel";

var packageDir = atom.packages.resolvePackagePath("latex-plus");
var projectsDir = _path2["default"].join(packageDir, "projects");

var Project = (function (_File) {
  _inherits(Project, _File);

  // TODO: ensure that atomProject is a directory

  function Project(atomProject) {
    _classCallCheck(this, Project);

    filePath = _path2["default"].join(projectsDir, _path2["default"].basename(atomProject) + ".json");
    _get(Object.getPrototypeOf(Project.prototype), "constructor", this).call(this, filePath);
    this.atomProject = atomProject;
  }

  _createClass(Project, [{
    key: "onDidLoad",
    value: function onDidLoad(callback) {
      this.emitter.on("did-load-project", callback);
    }
  }, {
    key: "onDidLoadError",
    value: function onDidLoadError(callback) {
      this.emitter.on("did-load-error-project", callback);
    }
  }, {
    key: "load",
    value: _asyncToGenerator(function* () {
      var _this = this;

      exists = yield this.exists();
      if (!exists) {
        try {
          yield this._new();
        } catch (e) {
          throw e;
        }
      }

      if (this.subscription) {
        this.subscription.dispose();
      }

      set = _asyncToGenerator(function* () {
        try {
          yield _this._set();
          _this.error = null;
          _this.emitter.emit("did-load-project");
        } catch (e) {
          _this.error = e;
          _this.emitter.emit("did-load-error-project");
          throw e;
        }
      });

      this.subscription = this.onDidChange(_asyncToGenerator(function* () {
        yield set();
      }));

      yield set();
    })
  }, {
    key: "_set",
    value: function _set() {
      var _this2 = this;

      return this.read().then(function (data) {
        project = JSON.parse(data);

        // FIXME: make this async
        texRoot = _path2["default"].join(project.projectPath, project.root);
        if (!_fs2["default"].existsSync(texRoot)) {
          throw new Error("Invalid root: " + texRoot);
        }

        switch (project.program) {
          case "pdflatex":
            break;
          case "xelatex":
          case "lualatex":
            project.texProgram = "-" + project.program;
            break;
          default:
            throw new Error("Invalid program: " + project.program);
        }

        texOutput = _path2["default"].join(project.projectPath, project.output);
        if (_path2["default"].resolve(texOutput) == _path2["default"].resolve(_this2.atomProject)) {
          throw new Error("Invalid output: " + texOutput);
        }

        _this2.projectPath = project.projectPath;
        _this2.texTitle = project.title;
        _this2.texRoot = texRoot;
        _this2.texProgram = project.texProgram;
        _this2.texOutput = texOutput;
        _this2.texLog = _path2["default"].join(_this2.texOutput, _path2["default"].basename(_this2.texRoot).split(".")[0] + ".log");
        _this2.item = _path2["default"].join(_this2.texOutput, _path2["default"].basename(_this2.texRoot).split(".")[0] + ".pdf");
      });
    }
  }, {
    key: "_new",
    value: _asyncToGenerator(function* () {
      var contents = "{\n  \"projectPath\": \"" + this.atomProject + "\",\n  \"title\": \"LaTeX-Plus Project\",\n  \"root\": \"main.tex\",\n  \"program\": \"pdflatex\",\n  \"output\": \".latex\"\n}";

      try {
        yield this.create();
        yield this.write(contents);
      } catch (e) {
        throw e;
      }
    })
  }, {
    key: "edit",
    value: function edit() {
      atom.workspace.open(this.getPath());
    }
  }]);

  return Project;
})(_atom.File);

exports["default"] = Project;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9NYXJ2aW4vLmF0b20vcGFja2FnZXMvbGF0ZXgtcGx1cy9saWIvcHJvamVjdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O2tCQUVlLElBQUk7Ozs7b0JBQ0YsTUFBTTs7OztvQkFDTSxNQUFNOztBQUpuQyxXQUFXLENBQUM7O0FBTVosSUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUNsRSxJQUFNLFdBQVcsR0FBRyxrQkFBSyxJQUFJLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDOztJQUVqQyxPQUFPO1lBQVAsT0FBTzs7OztBQUVmLFdBRlEsT0FBTyxDQUVkLFdBQVcsRUFBRTswQkFGTixPQUFPOztBQUd4QixZQUFRLEdBQUcsa0JBQUssSUFBSSxDQUFDLFdBQVcsRUFBSyxrQkFBSyxRQUFRLENBQUMsV0FBVyxDQUFDLFdBQVEsQ0FBQztBQUN4RSwrQkFKaUIsT0FBTyw2Q0FJbEIsUUFBUSxFQUFFO0FBQ2hCLFFBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFBO0dBQy9COztlQU5rQixPQUFPOztXQVFqQixtQkFBQyxRQUFRLEVBQUU7QUFDbEIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsa0JBQWtCLEVBQUUsUUFBUSxDQUFDLENBQUM7S0FDL0M7OztXQUVhLHdCQUFDLFFBQVEsRUFBRTtBQUN2QixVQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyx3QkFBd0IsRUFBRSxRQUFRLENBQUMsQ0FBQztLQUNyRDs7OzZCQUVTLGFBQUc7OztBQUNYLFlBQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUM3QixVQUFJLENBQUMsTUFBTSxFQUFFO0FBQ1gsWUFBSTtBQUNGLGdCQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUNuQixDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ1YsZ0JBQU0sQ0FBQyxD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O0FBRUUsVUFBSTtBQUNGLGNBQU0sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ3BCLGNBQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztPQUM1QixDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ1YsY0FBTSxDQUFDLENBQUM7T0FDVDtLQUNGOzs7V0FFRyxnQkFBRztBQUNMLFVBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0tBQ3JDOzs7U0F6R2tCLE9BQU87OztxQkFBUCxPQUFPIiwiZmlsZSI6Ii9Vc2Vycy9NYXJ2aW4vLmF0b20vcGFja2FnZXMvbGF0ZXgtcGx1cy9saWIvcHJvamVjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIGJhYmVsXCI7XG5cbmltcG9ydCBmcyBmcm9tIFwiZnNcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQge0ZpbGUsIEVtaXR0ZXJ9ICBmcm9tIFwiYXRvbVwiO1xuXG5jb25zdCBwYWNrYWdlRGlyID0gYXRvbS5wYWNrYWdlcy5yZXNvbHZlUGFja2FnZVBhdGgoXCJsYXRleC1wbHVzXCIpO1xuY29uc3QgcHJvamVjdHNEaXIgPSBwYXRoLmpvaW4ocGFja2FnZURpciwgXCJwcm9qZWN0c1wiKTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHJvamVjdCBleHRlbmRzIEZpbGUge1xuICAvLyBUT0RPOiBlbnN1cmUgdGhhdCBhdG9tUHJvamVjdCBpcyBhIGRpcmVjdG9yeVxuICBjb25zdHJ1Y3RvcihhdG9tUHJvamVjdCkge1xuICAgIGZpbGVQYXRoID0gcGF0aC5qb2luKHByb2plY3RzRGlyLCBgJHtwYXRoLmJhc2VuYW1lKGF0b21Qcm9qZWN0KX0uanNvbmApO1xuICAgIHN1cGVyKGZpbGVQYXRoKTtcbiAgICB0aGlzLmF0b21Qcm9qZWN0ID0gYXRvbVByb2plY3RcbiAgfVxuXG4gIG9uRGlkTG9hZChjYWxsYmFjaykge1xuICAgIHRoaXMuZW1pdHRlci5vbihcImRpZC1sb2FkLXByb2plY3RcIiwgY2FsbGJhY2spO1xuICB9XG5cbiAgb25EaWRMb2FkRXJyb3IoY2FsbGJhY2spIHtcbiAgICB0aGlzLmVtaXR0ZXIub24oXCJkaWQtbG9hZC1lcnJvci1wcm9qZWN0XCIsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIGFzeW5jIGxvYWQoKSB7XG4gICAgZXhpc3RzID0gYXdhaXQgdGhpcy5leGlzdHMoKTtcbiAgICBpZiAoIWV4aXN0cykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgdGhpcy5fbmV3KCk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHRocm93IGVcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5zdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9uLmRpc3Bvc2UoKVxuICAgIH1cblxuICAgIHNldCA9IGFzeW5jICgpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IHRoaXMuX3NldCgpO1xuICAgICAgICB0aGlzLmVycm9yID0gbnVsbDtcbiAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoXCJkaWQtbG9hZC1wcm9qZWN0XCIpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB0aGlzLmVycm9yID0gZTtcbiAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoXCJkaWQtbG9hZC1lcnJvci1wcm9qZWN0XCIpO1xuICAgICAgICB0aHJvdyBlXG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb24gPSB0aGlzLm9uRGlkQ2hhbmdlKGFzeW5jICgpID0+IHtcbiAgICAgIGF3YWl0IHNldCgpO1xuICAgIH0pO1xuXG4gICAgYXdhaXQgc2V0KCk7XG4gIH1cblxuICBfc2V0KCkge1xuICAgIHJldHVybiB0aGlzLnJlYWQoKS50aGVuKChkYXRhKSA9PiB7XG4gICAgICBwcm9qZWN0ID0gSlNPTi5wYXJzZShkYXRhKTtcblxuICAgICAgLy8gRklYTUU6IG1ha2UgdGhpcyBhc3luY1xuICAgICAgdGV4Um9vdCA9ICBwYXRoLmpvaW4ocHJvamVjdC5wcm9qZWN0UGF0aCwgcHJvamVjdC5yb290KVxuICAgICAgaWYgKCFmcy5leGlzdHNTeW5jKHRleFJvb3QpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCByb290OiAke3RleFJvb3R9YCk7XG4gICAgICB9XG5cbiAgICAgIHN3aXRjaCAocHJvamVjdC5wcm9ncmFtKSB7XG4gICAgICAgIGNhc2UgXCJwZGZsYXRleFwiOlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwieGVsYXRleFwiOlxuICAgICAgICBjYXNlIFwibHVhbGF0ZXhcIjpcbiAgICAgICAgICBwcm9qZWN0LnRleFByb2dyYW0gPSBgLSR7cHJvamVjdC5wcm9ncmFtfWA7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHByb2dyYW06ICR7cHJvamVjdC5wcm9ncmFtfWApO1xuICAgICAgfVxuXG4gICAgICB0ZXhPdXRwdXQgPSBwYXRoLmpvaW4ocHJvamVjdC5wcm9qZWN0UGF0aCwgcHJvamVjdC5vdXRwdXQpO1xuICAgICAgaWYgKHBhdGgucmVzb2x2ZSh0ZXhPdXRwdXQpID09IHBhdGgucmVzb2x2ZSh0aGlzLmF0b21Qcm9qZWN0KSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgb3V0cHV0OiAke3RleE91dHB1dH1gKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5wcm9qZWN0UGF0aCA9IHByb2plY3QucHJvamVjdFBhdGg7XG4gICAgICB0aGlzLnRleFRpdGxlID0gcHJvamVjdC50aXRsZTtcbiAgICAgIHRoaXMudGV4Um9vdCA9IHRleFJvb3Q7XG4gICAgICB0aGlzLnRleFByb2dyYW0gPSBwcm9qZWN0LnRleFByb2dyYW07XG4gICAgICB0aGlzLnRleE91dHB1dCA9IHRleE91dHB1dDtcbiAgICAgIHRoaXMudGV4TG9nID0gcGF0aC5qb2luKHRoaXMudGV4T3V0cHV0LCBwYXRoLmJhc2VuYW1lKHRoaXMudGV4Um9vdCkuc3BsaXQoXCIuXCIpWzBdICsgXCIubG9nXCIpO1xuICAgICAgdGhpcy5pdGVtID0gcGF0aC5qb2luKHRoaXMudGV4T3V0cHV0LCBwYXRoLmJhc2VuYW1lKHRoaXMudGV4Um9vdCkuc3BsaXQoXCIuXCIpWzBdICsgXCIucGRmXCIpO1xuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgX25ldygpIHtcbiAgICBjb25zdCBjb250ZW50cyA9XG5ge1xuICBcInByb2plY3RQYXRoXCI6IFwiJHt0aGlzLmF0b21Qcm9qZWN0fVwiLFxuICBcInRpdGxlXCI6IFwiTGFUZVgtUGx1cyBQcm9qZWN0XCIsXG4gIFwicm9vdFwiOiBcIm1haW4udGV4XCIsXG4gIFwicHJvZ3JhbVwiOiBcInBkZmxhdGV4XCIsXG4gIFwib3V0cHV0XCI6IFwiLmxhdGV4XCJcbn1gXG5cbiAgICB0cnkge1xuICAgICAgYXdhaXQgdGhpcy5jcmVhdGUoKTtcbiAgICAgIGF3YWl0IHRoaXMud3JpdGUoY29udGVudHMpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHRocm93IGU7XG4gICAgfVxuICB9XG5cbiAgZWRpdCgpIHtcbiAgICBhdG9tLndvcmtzcGFjZS5vcGVuKHRoaXMuZ2V0UGF0aCgpKTtcbiAgfVxufVxuIl19
//# sourceURL=/Users/Marvin/.atom/packages/latex-plus/lib/project.js
