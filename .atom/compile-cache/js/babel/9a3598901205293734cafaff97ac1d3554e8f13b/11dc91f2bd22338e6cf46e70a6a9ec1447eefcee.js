Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _libLogger = require("../lib/logger");

var _libLogger2 = _interopRequireDefault(_libLogger);

var _libOpener = require("../lib/opener");

var _libOpener2 = _interopRequireDefault(_libOpener);

"use babel";

var NullLogger = (function (_Logger) {
  _inherits(NullLogger, _Logger);

  function NullLogger() {
    _classCallCheck(this, NullLogger);

    _get(Object.getPrototypeOf(NullLogger.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(NullLogger, [{
    key: "error",
    value: function error() {}
  }, {
    key: "warning",
    value: function warning() {}
  }, {
    key: "info",
    value: function info() {}
  }]);

  return NullLogger;
})(_libLogger2["default"]);

exports.NullLogger = NullLogger;

var NullOpener = (function (_Opener) {
  _inherits(NullOpener, _Opener);

  function NullOpener() {
    _classCallCheck(this, NullOpener);

    _get(Object.getPrototypeOf(NullOpener.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(NullOpener, [{
    key: "open",
    value: function open() {}
  }]);

  return NullOpener;
})(_libOpener2["default"]);

exports.NullOpener = NullOpener;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9NYXJ2aW4vLmF0b20vcGFja2FnZXMvbGF0ZXgvc3BlYy9zdHVicy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozt5QkFFbUIsZUFBZTs7Ozt5QkFDZixlQUFlOzs7O0FBSGxDLFdBQVcsQ0FBQzs7SUFLQyxVQUFVO1lBQVYsVUFBVTs7V0FBVixVQUFVOzBCQUFWLFVBQVU7OytCQUFWLFVBQVU7OztlQUFWLFVBQVU7O1dBQ2hCLGlCQUFHLEVBQUU7OztXQUNILG1CQUFHLEVBQUU7OztXQUNSLGdCQUFHLEVBQUU7OztTQUhFLFVBQVU7Ozs7O0lBTVYsVUFBVTtZQUFWLFVBQVU7O1dBQVYsVUFBVTswQkFBVixVQUFVOzsrQkFBVixVQUFVOzs7ZUFBVixVQUFVOztXQUNqQixnQkFBRyxFQUFFOzs7U0FERSxVQUFVIiwiZmlsZSI6Ii9Vc2Vycy9NYXJ2aW4vLmF0b20vcGFja2FnZXMvbGF0ZXgvc3BlYy9zdHVicy5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIGJhYmVsXCI7XG5cbmltcG9ydCBMb2dnZXIgZnJvbSBcIi4uL2xpYi9sb2dnZXJcIjtcbmltcG9ydCBPcGVuZXIgZnJvbSBcIi4uL2xpYi9vcGVuZXJcIjtcblxuZXhwb3J0IGNsYXNzIE51bGxMb2dnZXIgZXh0ZW5kcyBMb2dnZXIge1xuICBlcnJvcigpIHt9XG4gIHdhcm5pbmcoKSB7fVxuICBpbmZvKCkge31cbn1cblxuZXhwb3J0IGNsYXNzIE51bGxPcGVuZXIgZXh0ZW5kcyBPcGVuZXIge1xuICBvcGVuKCkge31cbn1cbiJdfQ==
//# sourceURL=/Users/Marvin/.atom/packages/latex/spec/stubs.js
