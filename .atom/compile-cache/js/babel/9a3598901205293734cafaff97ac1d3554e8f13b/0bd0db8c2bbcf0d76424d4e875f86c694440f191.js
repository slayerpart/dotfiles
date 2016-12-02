Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

"use babel";

var errorPattern = new RegExp("^.\/(|[A-D:])(.*\\.tex):(\\d*):\\s(.*)");

var Parser = (function () {
  function Parser() {
    _classCallCheck(this, Parser);
  }

  _createClass(Parser, [{
    key: "parse",
    value: function parse(projectPath, log) {
      errors = [];
      promise = new Promise(function (resolve, reject) {
        _fs2["default"].readFile(log, function (err, data) {
          if (err) {
            reject(err);
          }

          bufferString = data.toString().split('\n').forEach(function (line) {
            e = line.match(errorPattern);

            if (e === null) {
              return;
            }

            error = {
              // normalize to an absolute path so that the message panel links work
              // properly
              file: _path2["default"].join(projectPath, _path2["default"].normalize(e[2])),
              line: e[3],
              message: e[4]
            };

            errors.push(error);
          });

          resolve(errors);
        });
      });

      return promise;
    }
  }]);

  return Parser;
})();

exports["default"] = Parser;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9NYXJ2aW4vLmF0b20vcGFja2FnZXMvbGF0ZXgtcGx1cy9saWIvcGFyc2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7a0JBRWUsSUFBSTs7OztvQkFDRixNQUFNOzs7O0FBSHZCLFdBQVcsQ0FBQzs7QUFLWixJQUFNLFlBQVksR0FBRyxJQUFJLE1BQU0sQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDOztJQUVyRCxNQUFNO1dBQU4sTUFBTTswQkFBTixNQUFNOzs7ZUFBTixNQUFNOztXQUNwQixlQUFDLFdBQVcsRUFBRSxHQUFHLEVBQUU7QUFDdEIsWUFBTSxHQUFHLEVBQUUsQ0FBQztBQUNaLGFBQU8sR0FBRyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUs7QUFDekMsd0JBQUcsUUFBUSxDQUFDLEdBQUcsRUFBRSxVQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUs7QUFDOUIsY0FBRyxHQUFHLEVBQUU7QUFDTixrQkFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1dBQ2I7O0FBRUQsc0JBQVksR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUksRUFBSztBQUMzRCxhQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQzs7QUFFN0IsZ0JBQUksQ0FBQyxLQUFLLElBQUksRUFBRTtBQUNkLHFCQUFPO2FBQ1I7O0FBRUQsaUJBQUssR0FBRzs7O0FBR04sa0JBQUksRUFBTSxrQkFBSyxJQUFJLENBQUMsV0FBVyxFQUFFLGtCQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN0RCxrQkFBSSxFQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDZCxxQkFBTyxFQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDZixDQUFBOztBQUVELGtCQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO1dBQ25CLENBQUMsQ0FBQzs7QUFFSCxpQkFBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ2pCLENBQUMsQ0FBQztPQUNKLENBQUMsQ0FBQzs7QUFFSCxhQUFPLE9BQU8sQ0FBQztLQUNoQjs7O1NBaENrQixNQUFNOzs7cUJBQU4sTUFBTSIsImZpbGUiOiIvVXNlcnMvTWFydmluLy5hdG9tL3BhY2thZ2VzL2xhdGV4LXBsdXMvbGliL3BhcnNlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIGJhYmVsXCI7XG5cbmltcG9ydCBmcyBmcm9tIFwiZnNcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5cbmNvbnN0IGVycm9yUGF0dGVybiA9IG5ldyBSZWdFeHAoXCJeLlxcLyh8W0EtRDpdKSguKlxcXFwudGV4KTooXFxcXGQqKTpcXFxccyguKilcIik7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhcnNlciB7XG4gIHBhcnNlKHByb2plY3RQYXRoLCBsb2cpIHtcbiAgICBlcnJvcnMgPSBbXTtcbiAgICBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgZnMucmVhZEZpbGUobG9nLCAoZXJyLCBkYXRhKSA9PiB7XG4gICAgICAgIGlmKGVycikge1xuICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICB9XG5cbiAgICAgICAgYnVmZmVyU3RyaW5nID0gZGF0YS50b1N0cmluZygpLnNwbGl0KCdcXG4nKS5mb3JFYWNoKChsaW5lKSA9PiB7XG4gICAgICAgICAgZSA9IGxpbmUubWF0Y2goZXJyb3JQYXR0ZXJuKTtcblxuICAgICAgICAgIGlmIChlID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZXJyb3IgPSB7XG4gICAgICAgICAgICAvLyBub3JtYWxpemUgdG8gYW4gYWJzb2x1dGUgcGF0aCBzbyB0aGF0IHRoZSBtZXNzYWdlIHBhbmVsIGxpbmtzIHdvcmtcbiAgICAgICAgICAgIC8vIHByb3Blcmx5XG4gICAgICAgICAgICBmaWxlOiAgICAgcGF0aC5qb2luKHByb2plY3RQYXRoLCBwYXRoLm5vcm1hbGl6ZShlWzJdKSksXG4gICAgICAgICAgICBsaW5lOiAgICAgZVszXSxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICBlWzRdXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZXJyb3JzLnB1c2goZXJyb3IpXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJlc29sdmUoZXJyb3JzKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbn1cbiJdfQ==
//# sourceURL=/Users/Marvin/.atom/packages/latex-plus/lib/parser.js
