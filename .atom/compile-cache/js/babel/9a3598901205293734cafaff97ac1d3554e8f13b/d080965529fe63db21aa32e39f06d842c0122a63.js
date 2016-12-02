Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

"use babel";

var Environment = function Environment() {
  _classCallCheck(this, Environment);

  this.texBin = atom.config.get("latex-plus.texBin");
  // FIXME: package should exit if this is true
  if (this.texBin == "") {
    atom.notifications.addError("A LaTeX installation must be specified in the LaTeX-Plus settings.");
  }

  switch (process.platform) {
    case "darwin":
    case "linux":
      this.delim = ":";
      this.PATH = process.env.PATH;
      break;
    case "win32":
      this.delim = ";";
      this.PATH = process.env.Path;
      break;
    default:
  }

  // #TODO: resolve texBin automatically
  this.options = process.env;
  this.options.timeout = 60000;
  this.options.PATH = this.texBin + this.delim + this.PATH;

  this.texInputs = atom.config.get("latex-plus.texInputs");
  if (this.texInputs != "") {
    // TEXINPUTS seems to only be available on *nix operating systems
    if (process.platform != "win32") {
      this.options.TEXINPUTS = this.texInputs + this.delim;
    }
  }
};

exports["default"] = Environment;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9NYXJ2aW4vLmF0b20vcGFja2FnZXMvbGF0ZXgtcGx1cy9saWIvZW52aXJvbm1lbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7b0JBRWlCLE1BQU07Ozs7QUFGdkIsV0FBVyxDQUFDOztJQUlTLFdBQVcsR0FDbkIsU0FEUSxXQUFXLEdBQ2hCO3dCQURLLFdBQVc7O0FBRTVCLE1BQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsQ0FBQzs7QUFFbkQsTUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLEVBQUUsRUFBRTtBQUNyQixRQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxvRUFBb0UsQ0FBQyxDQUFDO0dBQ25HOztBQUVELFVBQVEsT0FBTyxDQUFDLFFBQVE7QUFDdEIsU0FBSyxRQUFRLENBQUM7QUFDZCxTQUFLLE9BQU87QUFDVixVQUFJLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQztBQUNqQixVQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDO0FBQzdCLFlBQU07QUFBQSxBQUNSLFNBQUssT0FBTztBQUNWLFVBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO0FBQ2pCLFVBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUM7QUFDN0IsWUFBTTtBQUFBLEFBQ1IsWUFBUTtHQUNUOzs7QUFHRCxNQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUM7QUFDM0IsTUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO0FBQzdCLE1BQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDOztBQUV6RCxNQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHNCQUFzQixDQUFDLENBQUM7QUFDekQsTUFBSSxJQUFJLENBQUMsU0FBUyxJQUFJLEVBQUUsRUFBRTs7QUFFeEIsUUFBSSxPQUFPLENBQUMsUUFBUSxJQUFJLE9BQU8sRUFBRTtBQUMvQixVQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7S0FDdEQ7R0FDRjtDQUNGOztxQkFqQ2tCLFdBQVciLCJmaWxlIjoiL1VzZXJzL01hcnZpbi8uYXRvbS9wYWNrYWdlcy9sYXRleC1wbHVzL2xpYi9lbnZpcm9ubWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIGJhYmVsXCI7XG5cbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVudmlyb25tZW50IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy50ZXhCaW4gPSBhdG9tLmNvbmZpZy5nZXQoXCJsYXRleC1wbHVzLnRleEJpblwiKTtcbiAgICAvLyBGSVhNRTogcGFja2FnZSBzaG91bGQgZXhpdCBpZiB0aGlzIGlzIHRydWVcbiAgICBpZiAodGhpcy50ZXhCaW4gPT0gXCJcIikge1xuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKFwiQSBMYVRlWCBpbnN0YWxsYXRpb24gbXVzdCBiZSBzcGVjaWZpZWQgaW4gdGhlIExhVGVYLVBsdXMgc2V0dGluZ3MuXCIpO1xuICAgIH1cblxuICAgIHN3aXRjaCAocHJvY2Vzcy5wbGF0Zm9ybSkge1xuICAgICAgY2FzZSBcImRhcndpblwiOlxuICAgICAgY2FzZSBcImxpbnV4XCI6XG4gICAgICAgIHRoaXMuZGVsaW0gPSBcIjpcIjtcbiAgICAgICAgdGhpcy5QQVRIID0gcHJvY2Vzcy5lbnYuUEFUSDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwid2luMzJcIjpcbiAgICAgICAgdGhpcy5kZWxpbSA9IFwiO1wiO1xuICAgICAgICB0aGlzLlBBVEggPSBwcm9jZXNzLmVudi5QYXRoO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgfVxuXG4gICAgLy8gI1RPRE86IHJlc29sdmUgdGV4QmluIGF1dG9tYXRpY2FsbHlcbiAgICB0aGlzLm9wdGlvbnMgPSBwcm9jZXNzLmVudjtcbiAgICB0aGlzLm9wdGlvbnMudGltZW91dCA9IDYwMDAwO1xuICAgIHRoaXMub3B0aW9ucy5QQVRIID0gdGhpcy50ZXhCaW4gKyB0aGlzLmRlbGltICsgdGhpcy5QQVRIO1xuXG4gICAgdGhpcy50ZXhJbnB1dHMgPSBhdG9tLmNvbmZpZy5nZXQoXCJsYXRleC1wbHVzLnRleElucHV0c1wiKTtcbiAgICBpZiAodGhpcy50ZXhJbnB1dHMgIT0gXCJcIikge1xuICAgICAgLy8gVEVYSU5QVVRTIHNlZW1zIHRvIG9ubHkgYmUgYXZhaWxhYmxlIG9uICpuaXggb3BlcmF0aW5nIHN5c3RlbXNcbiAgICAgIGlmIChwcm9jZXNzLnBsYXRmb3JtICE9IFwid2luMzJcIikge1xuICAgICAgICB0aGlzLm9wdGlvbnMuVEVYSU5QVVRTID0gdGhpcy50ZXhJbnB1dHMgKyB0aGlzLmRlbGltO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19
//# sourceURL=/Users/Marvin/.atom/packages/latex-plus/lib/environment.js
