Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _atom = require('atom');

var _rimraf = require("rimraf");

var _rimraf2 = _interopRequireDefault(_rimraf);

var _config = require("./config");

var _config2 = _interopRequireDefault(_config);

var _project = require("./project");

var _project2 = _interopRequireDefault(_project);

var _environment = require("./environment");

var _environment2 = _interopRequireDefault(_environment);

var _compiler = require("./compiler");

var _compiler2 = _interopRequireDefault(_compiler);

var _parser = require("./parser");

var _parser2 = _interopRequireDefault(_parser);

var _status = require("./status");

var _status2 = _interopRequireDefault(_status);

"use babel";

exports["default"] = {
  config: _config2["default"],
  status: new _status2["default"](),
  environment: new _environment2["default"](),
  compiler: new _compiler2["default"](),
  parser: new _parser2["default"](),
  disposables: new _atom.CompositeDisposable(),

  activate: _asyncToGenerator(function* () {
    var _this = this;

    this.commands = atom.commands.add("atom-workspace", {
      "latex-plus:compile": _asyncToGenerator(function* () {
        _this.saveAll();
        try {
          yield _this.setProject();
        } catch (e) {
          console.log(e);
          return;
        }

        _this.status.updateStatusBarMode("compile");
        _this.compiler.execute("latexmk", _this.environment.options, _this.project);
      }),
      "latex-plus:edit": function latexPlusEdit() {
        _this.project.edit();
      },
      "latex-plus:clean": function latexPlusClean() {
        if (_this.project.error) {
          return;
        }

        shouldClean = atom.confirm({
          message: "Are you sure you want to clean " + _this.project.texOutput + "?",
          detailedMessage: "This cannot be recovered. Be absolutely certain that you are not cleaning files you would like to keep.",
          buttons: ["Cancel", "Clean"]
        });

        if (shouldClean) {
          (0, _rimraf2["default"])(_this.project.texOutput, function (e) {
            if (e) {
              throw e;
            }
          });
        }
      }
    });

    configChangedEvent = new _atom.Disposable(atom.config.onDidChange(function () {
      _this.environment = new _environment2["default"]();
    }));

    compileSuccessEvent = new _atom.Disposable(this.compiler.onDidCompileSuccess(function () {
      _this.status.updateStatusBarTitle(_this.project.texTitle);
      _this.status.updateStatusBarMode("ready");
      _this.status.clear();
      _this.openOutput();
    }));

    compileErrorEvent = new _atom.Disposable(this.compiler.onDidCompileError(function () {
      _this.status.updateStatusBarMode("error");
      _this.parser.parse(_this.getRootPath(), _this.project.texLog).then(function (errors) {
        if (errors.length == 0) {
          atom.notifications.addError("LaTeXmk Error:", {
            detail: _this.compiler.stderr,
            dismissable: true
          });
        } else {
          _this.status.showLogErrors(errors);
        }
      }, function (e) {
        throw e;
      });
    }));

    this.configSubscriptions = new _atom.CompositeDisposable(configChangedEvent);
    this.compilerSubscriptions = new _atom.CompositeDisposable(compileSuccessEvent, compileErrorEvent);
  }),

  deactivate: function deactivate() {
    // TODO: clean up any projects that no longer exist
  },

  setProject: _asyncToGenerator(function* () {
    var _this2 = this;

    filePath = atom.workspace.getActiveTextEditor().getPath();

    // check if the current latex project contains the active file

    var _atom$project$relativizePath = atom.project.relativizePath(filePath);

    var _atom$project$relativizePath2 = _slicedToArray(_atom$project$relativizePath, 2);

    atomProject = _atom$project$relativizePath2[0];
    relativeToAtomProject = _atom$project$relativizePath2[1];
    if (this.project && this.project.projectPath == atomProject) {
      return;
    }

    if (!atom.project.contains(filePath)) {
      atom.notifications.addError("The file " + _path2["default"].basename(filePath) + " must exist in an Atom project.");
      return;
    }

    this.project = new _project2["default"](atomProject);

    projectChangedEvent = new _atom.Disposable(this.project.onDidChange(function () {
      _this2.status.updateStatusBarTitle(_this2.project.texTitle);
    }));

    projectLoadedEvent = new _atom.Disposable(this.project.onDidLoad(function () {
      _this2.status.updateStatusBarMode("load");
      atom.notifications.addSuccess(_this2.project.texTitle + " loaded.");
    }));

    projectErrorEvent = new _atom.Disposable(this.project.onDidLoadError(function () {
      _this2.status.updateStatusBarMode("invalid");
      atom.notifications.addError("Configuration Error: Invalid parameter", {
        detail: _this2.project.error.message
      });
    }));

    if (this.projectSubscriptions) {
      this.projectSubscriptions.dispose();
    }

    this.projectSubscriptions = new _atom.CompositeDisposable(projectLoadedEvent, projectChangedEvent, projectErrorEvent);

    try {
      yield this.project.load();
    } catch (e) {
      throw e;
    }
  }),

  openOutput: function openOutput() {
    // copy and open the output upon successful compilation
    target = _path2["default"].join(this.project.projectPath, _path2["default"].basename(this.project.item));
    source = this.project.item;
    _fs2["default"].exists(target, function (exist) {
      if (exists) {
        _fs2["default"].unlink(target, function () {
          read = _fs2["default"].createReadStream(source);
          read.on("error", function (e) {
            throw e;
          });

          write = _fs2["default"].createWriteStream(target);
          write.on("error", function (e) {
            throw e;
          });

          write.on("finish", function (ex) {
            for (pane of atom.workspace.getPaneItems()) {
              if (pane.filePath === target) {
                return;
              }
            }

            pane = atom.workspace.getActivePane();
            outputPane = pane.splitRight();
            atom.workspace.open(target, outputPane);
          });

          read.pipe(write);
        });
      }
    });
  },

  getRootPath: function getRootPath() {
    var _atom$project$relativizePath3 = atom.project.relativizePath(this.project.texRoot);

    var _atom$project$relativizePath32 = _slicedToArray(_atom$project$relativizePath3, 2);

    atomProject = _atom$project$relativizePath32[0];
    relativeToAtomProject = _atom$project$relativizePath32[1];

    return _path2["default"].join(atomProject, _path2["default"].dirname(relativeToAtomProject));
  },

  saveAll: function saveAll() {
    // TODO: save only latex associated files
    for (pane of atom.workspace.getPanes()) {
      pane.saveItems();
    }
  },

  consumeStatusBar: function consumeStatusBar(status) {
    var _this3 = this;

    this.status.initialize(status);
    this.status.attach();
    this.disposables.add(new _atom.Disposable(function () {
      _this3.status.detach();
    }));
  }
};
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9NYXJ2aW4vLmF0b20vcGFja2FnZXMvbGF0ZXgtcGx1cy9saWIvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O2tCQUVlLElBQUk7Ozs7b0JBQ0YsTUFBTTs7OztvQkFFdUIsTUFBTTs7c0JBQ2pDLFFBQVE7Ozs7c0JBRVIsVUFBVTs7Ozt1QkFDVCxXQUFXOzs7OzJCQUNQLGVBQWU7Ozs7d0JBQ2xCLFlBQVk7Ozs7c0JBQ2QsVUFBVTs7OztzQkFDVixVQUFVOzs7O0FBYjdCLFdBQVcsQ0FBQzs7cUJBZ0JHO0FBQ2IsUUFBTSxxQkFBUTtBQUNkLFFBQU0sRUFBRSx5QkFBWTtBQUNwQixhQUFXLEVBQUUsOEJBQWlCO0FBQzlCLFVBQVEsRUFBRSwyQkFBYztBQUN4QixRQUFNLEVBQUUseUJBQVk7QUFDcEIsYUFBVyxFQUFFLCtCQUF1Qjs7QUFFcEMsQUFBTSxVQUFRLG9CQUFBLGFBQUc7OztBQUNmLFFBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUU7QUFDbEQsMEJBQW9CLG9CQUFFLGFBQVk7QUFDaEMsY0FBSyxPQUFPLEVBQUUsQ0FBQztBQUNmLFlBQUk7QUFDRixnQkFBTSxNQUFLLFVBQVUsRUFBRSxDQUFDO1NBQ3pCLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDVixpQkFBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNmLGlCQUFPO1NBQ1I7O0FBRUQsY0FBSyxNQUFNLENBQUMsbUJBQW1CLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDM0MsY0FBSyxRQUFRLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxNQUFLLFdBQVcsQ0FBQyxPQUFPLEVBQUUsTUFBSyxPQUFPLENBQUMsQ0FBQztPQUMxRSxDQUFBO0FBQ0QsdUJBQWlCLEVBQUUseUJBQU07QUFDdkIsY0FBSyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUE7T0FDcEI7QUFDRCx3QkFBa0IsRUFB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QUksQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUM7V0FDekMsQ0FBQyxDQUFDOztBQUVILGNBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDbEIsQ0FBQyxDQUFDO09BQ0o7S0FDRixDQUFDLENBQUE7R0FDSDs7QUFFRCxhQUFXLEVBQUEsdUJBQUc7d0NBQzJCLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDOzs7O0FBQXZGLGVBQVc7QUFBRSx5QkFBcUI7O0FBQ25DLFdBQU8sa0JBQUssSUFBSSxDQUFDLFdBQVcsRUFBRSxrQkFBSyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDO0dBQ3BFOztBQUVELFNBQU8sRUFBQSxtQkFBRzs7QUFFUixTQUFLLElBQUksSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxFQUFFO0FBQ3RDLFVBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQTtLQUNqQjtHQUNGOztBQUVELGtCQUFnQixFQUFBLDBCQUFDLE1BQU0sRUFBRTs7O0FBQ3ZCLFFBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQzlCLFFBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUE7QUFDcEIsUUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMscUJBQWUsWUFBTTtBQUN4QyxhQUFLLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQTtLQUNyQixDQUFDLENBQUMsQ0FBQztHQUNMO0NBQ0YiLCJmaWxlIjoiL1VzZXJzL01hcnZpbi8uYXRvbS9wYWNrYWdlcy9sYXRleC1wbHVzL2xpYi9tYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2UgYmFiZWxcIjtcblxuaW1wb3J0IGZzIGZyb20gXCJmc1wiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcblxuaW1wb3J0IHtEaXNwb3NhYmxlLCBDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tICdhdG9tJztcbmltcG9ydCByaW1yYWYgZnJvbSBcInJpbXJhZlwiO1xuXG5pbXBvcnQgQ29uZmlnIGZyb20gXCIuL2NvbmZpZ1wiO1xuaW1wb3J0IFByb2plY3QgZnJvbSBcIi4vcHJvamVjdFwiO1xuaW1wb3J0IEVudmlyb25tZW50IGZyb20gXCIuL2Vudmlyb25tZW50XCI7XG5pbXBvcnQgQ29tcGlsZXIgZnJvbSBcIi4vY29tcGlsZXJcIjtcbmltcG9ydCBQYXJzZXIgZnJvbSBcIi4vcGFyc2VyXCI7XG5pbXBvcnQgU3RhdHVzIGZyb20gXCIuL3N0YXR1c1wiO1xuXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgY29uZmlnOiBDb25maWcsXG4gIHN0YXR1czogbmV3IFN0YXR1cygpLFxuICBlbnZpcm9ubWVudDogbmV3IEVudmlyb25tZW50KCksXG4gIGNvbXBpbGVyOiBuZXcgQ29tcGlsZXIoKSxcbiAgcGFyc2VyOiBuZXcgUGFyc2VyKCksXG4gIGRpc3Bvc2FibGVzOiBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSxcblxuICBhc3luYyBhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLmNvbW1hbmRzID0gYXRvbS5jb21tYW5kcy5hZGQoXCJhdG9tLXdvcmtzcGFjZVwiLCB7XG4gICAgICBcImxhdGV4LXBsdXM6Y29tcGlsZVwiOiBhc3luYyAoKSA9PiB7XG4gICAgICAgIHRoaXMuc2F2ZUFsbCgpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGF3YWl0IHRoaXMuc2V0UHJvamVjdCgpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zdGF0dXMudXBkYXRlU3RhdHVzQmFyTW9kZShcImNvbXBpbGVcIik7XG4gICAgICAgIHRoaXMuY29tcGlsZXIuZXhlY3V0ZShcImxhdGV4bWtcIiwgdGhpcy5lbnZpcm9ubWVudC5vcHRpb25zLCB0aGlzLnByb2plY3QpO1xuICAgICAgfSxcbiAgICAgIFwibGF0ZXgtcGx1czplZGl0XCI6ICgpID0+IHtcbiAgICAgICAgdGhpcy5wcm9qZWN0LmVkaXQoKVxuICAgICAgfSxcbiAgICAgIFwibGF0ZXgtcGx1czpjbGVhblwiOiAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLnByb2plY3QuZXJyb3IpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBzaG91bGRDbGVhbiA9IGF0b20uY29uZmlybSh7XG4gICAgICAgICAgbWVzc2FnZTogYEFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBjbGVhbiAke3RoaXMucHJvamVjdC50ZXhPdXRwdXR9P2AsXG4gICAgICAgICAgZGV0YWlsZWRNZXNzYWdlOiBcIlRoaXMgY2Fubm90IGJlIHJlY292ZXJlZC4gQmUgYWJzb2x1dGVseSBjZXJ0YWluIHRoYXQgeW91IGFyZSBub3QgY2xlYW5pbmcgZmlsZXMgeW91IHdvdWxkIGxpa2UgdG8ga2VlcC5cIixcbiAgICAgICAgICBidXR0b25zOiBbXCJDYW5jZWxcIiwgXCJDbGVhblwiXVxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoc2hvdWxkQ2xlYW4pIHtcbiAgICAgICAgICByaW1yYWYodGhpcy5wcm9qZWN0LnRleE91dHB1dCwgKGUpID0+IHtcbiAgICAgICAgICAgIGlmIChlKSB7XG4gICAgICAgICAgICAgIHRocm93KGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25maWdDaGFuZ2VkRXZlbnQgPSBuZXcgRGlzcG9zYWJsZShhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgoKSA9PiB7XG4gICAgICAgIHRoaXMuZW52aXJvbm1lbnQgPSBuZXcgRW52aXJvbm1lbnQoKTtcbiAgICAgIH0pXG4gICAgKVxuXG4gICAgY29tcGlsZVN1Y2Nlc3NFdmVudCA9IG5ldyBEaXNwb3NhYmxlKFxuICAgICAgdGhpcy5jb21waWxlci5vbkRpZENvbXBpbGVTdWNjZXNzKCgpID0+IHtcbiAgICAgICAgdGhpcy5zdGF0dXMudXBkYXRlU3RhdHVzQmFyVGl0bGUodGhpcy5wcm9qZWN0LnRleFRpdGxlKVxuICAgICAgICB0aGlzLnN0YXR1cy51cGRhdGVTdGF0dXNCYXJNb2RlKFwicmVhZHlcIilcbiAgICAgICAgdGhpcy5zdGF0dXMuY2xlYXIoKTtcbiAgICAgICAgdGhpcy5vcGVuT3V0cHV0KCk7XG4gICAgICB9XG4gICAgKSk7XG5cbiAgICBjb21waWxlRXJyb3JFdmVudCA9IG5ldyBEaXNwb3NhYmxlKHRoaXMuY29tcGlsZXIub25EaWRDb21waWxlRXJyb3IoKCkgPT4ge1xuICAgICAgdGhpcy5zdGF0dXMudXBkYXRlU3RhdHVzQmFyTW9kZShcImVycm9yXCIpO1xuICAgICAgdGhpcy5wYXJzZXIucGFyc2UodGhpcy5nZXRSb290UGF0aCgpLCB0aGlzLnByb2plY3QudGV4TG9nKVxuICAgICAgLnRoZW4oKGVycm9ycykgPT4ge1xuICAgICAgICAgIGlmIChlcnJvcnMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihcIkxhVGVYbWsgRXJyb3I6XCIsIHtcbiAgICAgICAgICAgICAgZGV0YWlsOiB0aGlzLmNvbXBpbGVyLnN0ZGVycixcbiAgICAgICAgICAgICAgZGlzbWlzc2FibGU6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnN0YXR1cy5zaG93TG9nRXJyb3JzKGVycm9ycyk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCAoZSkgPT4ge1xuICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgfSkpO1xuXG4gICAgdGhpcy5jb25maWdTdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoY29uZmlnQ2hhbmdlZEV2ZW50KTtcbiAgICB0aGlzLmNvbXBpbGVyU3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKGNvbXBpbGVTdWNjZXNzRXZlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21waWxlRXJyb3JFdmVudCk7XG4gIH0sXG5cbiAgZGVhY3RpdmF0ZSgpIHtcbiAgICAvLyBUT0RPOiBjbGVhbiB1cCBhbnkgcHJvamVjdHMgdGhhdCBubyBsb25nZXIgZXhpc3RcbiAgfSxcblxuICBhc3luYyBzZXRQcm9qZWN0KCkge1xuICAgIGZpbGVQYXRoID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpLmdldFBhdGgoKTtcbiAgICBbYXRvbVByb2plY3QsIHJlbGF0aXZlVG9BdG9tUHJvamVjdF0gPSBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoZmlsZVBhdGgpO1xuXG4gICAgLy8gY2hlY2sgaWYgdGhlIGN1cnJlbnQgbGF0ZXggcHJvamVjdCBjb250YWlucyB0aGUgYWN0aXZlIGZpbGVcbiAgICBpZiAodGhpcy5wcm9qZWN0ICYmIHRoaXMucHJvamVjdC5wcm9qZWN0UGF0aCA9PSBhdG9tUHJvamVjdCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghYXRvbS5wcm9qZWN0LmNvbnRhaW5zKGZpbGVQYXRoKSkge1xuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKGBUaGUgZmlsZSAke3BhdGguYmFzZW5hbWUoZmlsZVBhdGgpfSBtdXN0IGV4aXN0IGluIGFuIEF0b20gcHJvamVjdC5gKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnByb2plY3QgPSBuZXcgUHJvamVjdChhdG9tUHJvamVjdCk7XG5cbiAgICBwcm9qZWN0Q2hhbmdlZEV2ZW50ID0gbmV3IERpc3Bvc2FibGUodGhpcy5wcm9qZWN0Lm9uRGlkQ2hhbmdlKCgpID0+IHtcbiAgICAgICAgdGhpcy5zdGF0dXMudXBkYXRlU3RhdHVzQmFyVGl0bGUodGhpcy5wcm9qZWN0LnRleFRpdGxlKVxuICAgICAgfSlcbiAgICApXG5cbiAgICBwcm9qZWN0TG9hZGVkRXZlbnQgPSBuZXcgRGlzcG9zYWJsZSh0aGlzLnByb2plY3Qub25EaWRMb2FkKCgpID0+IHtcbiAgICAgICAgdGhpcy5zdGF0dXMudXBkYXRlU3RhdHVzQmFyTW9kZShcImxvYWRcIilcbiAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFN1Y2Nlc3MoYCR7dGhpcy5wcm9qZWN0LnRleFRpdGxlfSBsb2FkZWQuYCk7XG4gICAgICB9KVxuICAgIClcblxuICAgIHByb2plY3RFcnJvckV2ZW50ID0gbmV3IERpc3Bvc2FibGUodGhpcy5wcm9qZWN0Lm9uRGlkTG9hZEVycm9yKCgpID0+IHtcbiAgICAgICAgdGhpcy5zdGF0dXMudXBkYXRlU3RhdHVzQmFyTW9kZShcImludmFsaWRcIilcbiAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKFwiQ29uZmlndXJhdGlvbiBFcnJvcjogSW52YWxpZCBwYXJhbWV0ZXJcIiwge1xuICAgICAgICAgIGRldGFpbDogdGhpcy5wcm9qZWN0LmVycm9yLm1lc3NhZ2VcbiAgICAgICAgfSk7XG4gICAgICB9KVxuICAgIClcblxuICAgIGlmICh0aGlzLnByb2plY3RTdWJzY3JpcHRpb25zKSB7XG4gICAgICB0aGlzLnByb2plY3RTdWJzY3JpcHRpb25zLmRpc3Bvc2UoKTtcbiAgICB9XG5cbiAgICB0aGlzLnByb2plY3RTdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUocHJvamVjdExvYWRlZEV2ZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9qZWN0Q2hhbmdlZEV2ZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9qZWN0RXJyb3JFdmVudCk7XG5cbiAgICB0cnkge1xuICAgICAgYXdhaXQgdGhpcy5wcm9qZWN0LmxvYWQoKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB0aHJvdyBlO1xuICAgIH1cbiAgfSxcblxuICBvcGVuT3V0cHV0KCkge1xuICAgIC8vIGNvcHkgYW5kIG9wZW4gdGhlIG91dHB1dCB1cG9uIHN1Y2Nlc3NmdWwgY29tcGlsYXRpb25cbiAgICB0YXJnZXQgPSBwYXRoLmpvaW4odGhpcy5wcm9qZWN0LnByb2plY3RQYXRoLCBwYXRoLmJhc2VuYW1lKHRoaXMucHJvamVjdC5pdGVtKSk7XG4gICAgc291cmNlID0gdGhpcy5wcm9qZWN0Lml0ZW07XG4gICAgZnMuZXhpc3RzKHRhcmdldCwgKGV4aXN0KSA9PiB7XG4gICAgICBpZiAoZXhpc3RzKSB7XG4gICAgICAgIGZzLnVubGluayh0YXJnZXQsICgpID0+IHtcbiAgICAgICAgICByZWFkID0gZnMuY3JlYXRlUmVhZFN0cmVhbShzb3VyY2UpO1xuICAgICAgICAgIHJlYWQub24oXCJlcnJvclwiLCAoZSkgPT4ge1xuICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHdyaXRlID0gZnMuY3JlYXRlV3JpdGVTdHJlYW0odGFyZ2V0KTtcbiAgICAgICAgICB3cml0ZS5vbihcImVycm9yXCIsIChlKSA9PiB7XG4gICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgd3JpdGUub24oXCJmaW5pc2hcIiwgKGV4KSA9PiB7XG4gICAgICAgICAgICBmb3IgKHBhbmUgb2YgYXRvbS53b3Jrc3BhY2UuZ2V0UGFuZUl0ZW1zKCkpIHtcbiAgICAgICAgICAgICAgaWYgKHBhbmUuZmlsZVBhdGggPT09IHRhcmdldCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBwYW5lID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpO1xuICAgICAgICAgICAgb3V0cHV0UGFuZSA9IHBhbmUuc3BsaXRSaWdodCgpO1xuICAgICAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3Blbih0YXJnZXQsIG91dHB1dFBhbmUpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgcmVhZC5waXBlKHdyaXRlKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSlcbiAgfSxcblxuICBnZXRSb290UGF0aCgpIHtcbiAgICBbYXRvbVByb2plY3QsIHJlbGF0aXZlVG9BdG9tUHJvamVjdF0gPSBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgodGhpcy5wcm9qZWN0LnRleFJvb3QpO1xuICAgIHJldHVybiBwYXRoLmpvaW4oYXRvbVByb2plY3QsIHBhdGguZGlybmFtZShyZWxhdGl2ZVRvQXRvbVByb2plY3QpKTtcbiAgfSxcblxuICBzYXZlQWxsKCkge1xuICAgIC8vIFRPRE86IHNhdmUgb25seSBsYXRleCBhc3NvY2lhdGVkIGZpbGVzXG4gICAgZm9yIChwYW5lIG9mIGF0b20ud29ya3NwYWNlLmdldFBhbmVzKCkpIHtcbiAgICAgIHBhbmUuc2F2ZUl0ZW1zKClcbiAgICB9XG4gIH0sXG5cbiAgY29uc3VtZVN0YXR1c0JhcihzdGF0dXMpIHtcbiAgICB0aGlzLnN0YXR1cy5pbml0aWFsaXplKHN0YXR1cylcbiAgICB0aGlzLnN0YXR1cy5hdHRhY2goKVxuICAgIHRoaXMuZGlzcG9zYWJsZXMuYWRkKG5ldyBEaXNwb3NhYmxlKCgpID0+IHtcbiAgICAgIHRoaXMuc3RhdHVzLmRldGFjaCgpXG4gICAgfSkpO1xuICB9XG59XG4iXX0=
//# sourceURL=/Users/Marvin/.atom/packages/latex-plus/lib/main.js
