Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _atomMessagePanel = require("atom-message-panel");

"use babel";

var ContentsByMode = {
  'compile': ["status-bar-latex-plus-mode-action", "Compiling"],
  'load': ["status-bar-latex-plus-mode-action", "Loaded"],
  'ready': ["status-bar-latex-plus-mode-good", "Ready"],
  'invalid': ["status-bar-latex-plus-mode-error", "Invalid"],
  'error': ["status-bar-latex-plus-mode-error", "Error"]
};

var Status = (function () {
  function Status() {
    _classCallCheck(this, Status);

    this.container = document.createElement("div");
    this.container.className = "inline-block";
    this.titleElement = document.createElement("span");
    this.titleElement.id = "status-bar-latex-plus-title";
    this.statusElement = document.createElement("span");
    this.statusElement.id = "status-bar-latex-plus-mode";

    this.container.appendChild(this.titleElement);
    this.container.appendChild(this.statusElement);

    this.messagepanel = new _atomMessagePanel.MessagePanelView({ title: 'LaTeX-Plus' });
    this.markers = [];
  }

  _createClass(Status, [{
    key: "initialize",
    value: function initialize(statusBar) {
      this.statusBar = statusBar;
    }
  }, {
    key: "showLogErrors",
    value: function showLogErrors(errors) {
      this.updateMessagePanel(errors);
      this.updateGutter(errors);
    }
  }, {
    key: "updateStatusBarTitle",
    value: function updateStatusBarTitle(title) {
      if (title) {
        this.titleElement.textContent = title + ": ";
      }
    }
  }, {
    key: "updateStatusBarMode",
    value: function updateStatusBarMode(mode) {
      if (newContents = ContentsByMode[mode]) {
        var _newContents = newContents;

        var _newContents2 = _slicedToArray(_newContents, 2);

        klass = _newContents2[0];
        status = _newContents2[1];

        this.statusElement.className = klass;
        this.statusElement.textContent = "" + status;
      }
    }
  }, {
    key: "updateMessagePanel",
    value: function updateMessagePanel(errors) {
      editors = atom.workspace.getTextEditors();
      for (var e of errors) {
        this.messagepanel.add(new _atomMessagePanel.LineMessageView({
          file: e.file,
          line: e.line,
          character: 0,
          message: e.message
        }));
      }

      this.messagepanel.attach();
    }
  }, {
    key: "updateGutter",
    value: function updateGutter(errors) {
      editors = atom.workspace.getTextEditors();
      for (var e of errors) {
        for (editor of editors) {
          errorFile = _path2["default"].basename(e.file);
          if (errorFile == _path2["default"].basename(editor.getPath())) {
            row = parseInt(e.line) - 1;
            column = editor.buffer.lineLengthForRow(row);
            range = [[row, 0], [row, column]];
            marker = editor.markBufferRange(range, { invalidate: 'touch' });
            decoration = editor.decorateMarker(marker, { type: 'line-number', "class": 'gutter-red' });
            this.markers.push(marker);
          }
        }
      }
    }
  }, {
    key: "clear",
    value: function clear() {
      this.messagepanel.clear();
      this.messagepanel.close();

      for (marker of this.markers) {
        marker.destroy();
      }
    }
  }, {
    key: "attach",
    value: function attach() {
      this.tile = this.statusBar.addLeftTile({ item: this.container, priority: 20 });
    }
  }, {
    key: "detach",
    value: function detach() {
      this.tile.destroy();
    }
  }, {
    key: "destroy",
    value: function destroy() {
      if (this.element) {
        this.element.remove();
        this.element = null;
      }

      if (this.container) {
        this.container.remove();
        this.container = null;
      }

      if (this.messagepanel) {
        this.messagepanel.remove();
        this.messagepanel = null;
      }
    }
  }]);

  return Status;
})();

exports["default"] = Status;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9NYXJ2aW4vLmF0b20vcGFja2FnZXMvbGF0ZXgtcGx1cy9saWIvc3RhdHVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztrQkFFZSxJQUFJOzs7O29CQUNGLE1BQU07Ozs7Z0NBQzJDLG9CQUFvQjs7QUFKdEYsV0FBVyxDQUFDOztBQU1aLElBQU0sY0FBYyxHQUFHO0FBQ3JCLFdBQVMsRUFBRSxDQUFDLG1DQUFtQyxFQUFFLFdBQVcsQ0FBQztBQUM3RCxRQUFNLEVBQUUsQ0FBQyxtQ0FBbUMsRUFBRSxRQUFRLENBQUM7QUFDdkQsU0FBTyxFQUFFLENBQUMsaUNBQWlDLEVBQUUsT0FBTyxDQUFDO0FBQ3JELFdBQVMsRUFBRSxDQUFDLGtDQUFrQyxFQUFFLFNBQVMsQ0FBQztBQUMxRCxTQUFPLEVBQUUsQ0FBQyxrQ0FBa0MsRUFBRSxPQUFPLENBQUM7Q0FDdkQsQ0FBQTs7SUFFb0IsTUFBTTtBQUNkLFdBRFEsTUFBTSxHQUNYOzBCQURLLE1BQU07O0FBRXZCLFFBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMvQyxRQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsR0FBRyxjQUFjLENBQUM7QUFDMUMsUUFBSSxDQUFDLFlBQVksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ25ELFFBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxHQUFHLDZCQUE2QixDQUFDO0FBQ3JELFFBQUksQ0FBQyxhQUFhLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNwRCxRQUFJLENBQUMsYUFBYSxDQUFDLEVBQUUsR0FBRyw0QkFBNEIsQ0FBQzs7QUFFckQsUUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQzlDLFFBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxh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O0FBRTFCLFdBQUssTUFBTSxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7QUFDM0IsY0FBTSxDQUFDLE9BQU8sRUFBRSxDQUFBO09BQ2pCO0tBQ0Y7OztXQUVLLGtCQUFHO0FBQ1AsVUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxFQUFDLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUMsQ0FBQyxDQUFDO0tBQzlFOzs7V0FFSyxrQkFBRztBQUNQLFVBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUE7S0FDcEI7OztXQUVNLG1CQUFHO0FBQ1IsVUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO0FBQ2hCLFlBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDdEIsWUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7T0FDckI7O0FBRUQsVUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO0FBQ2xCLFlBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDeEIsWUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7T0FDdkI7O0FBRUQsVUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO0FBQ3JCLFlBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDM0IsWUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7T0FDMUI7S0FDRjs7O1NBeEdrQixNQUFNOzs7cUJBQU4sTUFBTSIsImZpbGUiOiIvVXNlcnMvTWFydmluLy5hdG9tL3BhY2thZ2VzL2xhdGV4LXBsdXMvbGliL3N0YXR1cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIGJhYmVsXCI7XG5cbmltcG9ydCBmcyBmcm9tIFwiZnNcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQge01lc3NhZ2VQYW5lbFZpZXcsIExpbmVNZXNzYWdlVmlldywgUGxhaW5NZXNzYWdlVmlld30gZnJvbSBcImF0b20tbWVzc2FnZS1wYW5lbFwiO1xuXG5jb25zdCBDb250ZW50c0J5TW9kZSA9IHtcbiAgJ2NvbXBpbGUnOiBbXCJzdGF0dXMtYmFyLWxhdGV4LXBsdXMtbW9kZS1hY3Rpb25cIiwgXCJDb21waWxpbmdcIl0sXG4gICdsb2FkJzogW1wic3RhdHVzLWJhci1sYXRleC1wbHVzLW1vZGUtYWN0aW9uXCIsIFwiTG9hZGVkXCJdLFxuICAncmVhZHknOiBbXCJzdGF0dXMtYmFyLWxhdGV4LXBsdXMtbW9kZS1nb29kXCIsIFwiUmVhZHlcIl0sXG4gICdpbnZhbGlkJzogW1wic3RhdHVzLWJhci1sYXRleC1wbHVzLW1vZGUtZXJyb3JcIiwgXCJJbnZhbGlkXCJdLFxuICAnZXJyb3InOiBbXCJzdGF0dXMtYmFyLWxhdGV4LXBsdXMtbW9kZS1lcnJvclwiLCBcIkVycm9yXCJdXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0YXR1cyB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICB0aGlzLmNvbnRhaW5lci5jbGFzc05hbWUgPSBcImlubGluZS1ibG9ja1wiO1xuICAgIHRoaXMudGl0bGVFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgdGhpcy50aXRsZUVsZW1lbnQuaWQgPSBcInN0YXR1cy1iYXItbGF0ZXgtcGx1cy10aXRsZVwiO1xuICAgIHRoaXMuc3RhdHVzRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgIHRoaXMuc3RhdHVzRWxlbWVudC5pZCA9IFwic3RhdHVzLWJhci1sYXRleC1wbHVzLW1vZGVcIjtcblxuICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMudGl0bGVFbGVtZW50KTtcbiAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLnN0YXR1c0VsZW1lbnQpO1xuXG4gICAgdGhpcy5tZXNzYWdlcGFuZWwgPSBuZXcgTWVzc2FnZVBhbmVsVmlldyh7dGl0bGU6ICdMYVRlWC1QbHVzJ30pO1xuICAgIHRoaXMubWFya2VycyA9IFtdO1xuICB9XG5cbiAgaW5pdGlhbGl6ZShzdGF0dXNCYXIpIHtcbiAgICB0aGlzLnN0YXR1c0JhciA9IHN0YXR1c0JhcjtcbiAgfVxuXG4gIHNob3dMb2dFcnJvcnMoZXJyb3JzKSB7XG4gICAgdGhpcy51cGRhdGVNZXNzYWdlUGFuZWwoZXJyb3JzKTtcbiAgICB0aGlzLnVwZGF0ZUd1dHRlcihlcnJvcnMpO1xuICB9XG5cbiAgdXBkYXRlU3RhdHVzQmFyVGl0bGUodGl0bGUpIHtcbiAgICBpZiAodGl0bGUpIHtcbiAgICAgIHRoaXMudGl0bGVFbGVtZW50LnRleHRDb250ZW50ID0gYCR7dGl0bGV9OiBgO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZVN0YXR1c0Jhck1vZGUobW9kZSkge1xuICAgIGlmIChuZXdDb250ZW50cyA9IENvbnRlbnRzQnlNb2RlW21vZGVdKSB7XG4gICAgICBba2xhc3MsIHN0YXR1c10gPSBuZXdDb250ZW50cztcbiAgICAgIHRoaXMuc3RhdHVzRWxlbWVudC5jbGFzc05hbWUgPSBrbGFzcztcbiAgICAgIHRoaXMuc3RhdHVzRWxlbWVudC50ZXh0Q29udGVudCA9IGAke3N0YXR1c31gO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZU1lc3NhZ2VQYW5lbChlcnJvcnMpIHtcbiAgICBlZGl0b3JzID0gIGF0b20ud29ya3NwYWNlLmdldFRleHRFZGl0b3JzKClcbiAgICBmb3IgKHZhciBlIG9mIGVycm9ycykge1xuICAgICAgdGhpcy5tZXNzYWdlcGFuZWwuYWRkKFxuICAgICAgICAgIG5ldyBMaW5lTWVzc2FnZVZpZXcoe1xuICAgICAgICAgIGZpbGU6IGUuZmlsZSAsXG4gICAgICAgICAgbGluZTogZS5saW5lLFxuICAgICAgICAgIGNoYXJhY3RlcjogMCxcbiAgICAgICAgICBtZXNzYWdlOiBlLm1lc3NhZ2VcbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgfVxuXG4gICAgdGhpcy5tZXNzYWdlcGFuZWwuYXR0YWNoKCk7XG4gIH1cblxuICB1cGRhdGVHdXR0ZXIoZXJyb3JzKSB7XG4gICAgZWRpdG9ycyA9ICBhdG9tLndvcmtzcGFjZS5nZXRUZXh0RWRpdG9ycygpXG4gICAgZm9yICh2YXIgZSBvZiBlcnJvcnMpIHtcbiAgICAgIGZvciAoZWRpdG9yIG9mIGVkaXRvcnMpIHtcbiAgICAgICAgZXJyb3JGaWxlID0gcGF0aC5iYXNlbmFtZShlLmZpbGUpO1xuICAgICAgICBpZiAoZXJyb3JGaWxlID09IHBhdGguYmFzZW5hbWUoZWRpdG9yLmdldFBhdGgoKSkpIHtcbiAgICAgICAgICByb3cgPSBwYXJzZUludChlLmxpbmUpIC0gMTtcbiAgICAgICAgICBjb2x1bW4gPSBlZGl0b3IuYnVmZmVyLmxpbmVMZW5ndGhGb3JSb3cocm93KTtcbiAgICAgICAgICByYW5nZSA9IFtbcm93LCAwXSwgW3JvdywgY29sdW1uXV07XG4gICAgICAgICAgbWFya2VyID0gZWRpdG9yLm1hcmtCdWZmZXJSYW5nZShyYW5nZSwge2ludmFsaWRhdGU6ICd0b3VjaCd9KTtcbiAgICAgICAgICBkZWNvcmF0aW9uID0gZWRpdG9yLmRlY29yYXRlTWFya2VyKG1hcmtlciwge3R5cGU6ICdsaW5lLW51bWJlcicsIGNsYXNzOiAnZ3V0dGVyLXJlZCd9KTtcbiAgICAgICAgICB0aGlzLm1hcmtlcnMucHVzaChtYXJrZXIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY2xlYXIoKSB7XG4gICAgdGhpcy5tZXNzYWdlcGFuZWwuY2xlYXIoKVxuICAgIHRoaXMubWVzc2FnZXBhbmVsLmNsb3NlKCk7XG5cbiAgICBmb3IgKG1hcmtlciBvZiB0aGlzLm1hcmtlcnMpIHtcbiAgICAgIG1hcmtlci5kZXN0cm95KClcbiAgICB9XG4gIH1cblxuICBhdHRhY2goKSB7XG4gICAgdGhpcy50aWxlID0gdGhpcy5zdGF0dXNCYXIuYWRkTGVmdFRpbGUoe2l0ZW06IHRoaXMuY29udGFpbmVyLCBwcmlvcml0eTogMjB9KTtcbiAgfVxuXG4gIGRldGFjaCgpIHtcbiAgICB0aGlzLnRpbGUuZGVzdHJveSgpXG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIGlmICh0aGlzLmVsZW1lbnQpIHtcbiAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmUoKTtcbiAgICAgIHRoaXMuZWxlbWVudCA9IG51bGw7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY29udGFpbmVyKSB7XG4gICAgICB0aGlzLmNvbnRhaW5lci5yZW1vdmUoKTtcbiAgICAgIHRoaXMuY29udGFpbmVyID0gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5tZXNzYWdlcGFuZWwpIHtcbiAgICAgIHRoaXMubWVzc2FnZXBhbmVsLnJlbW92ZSgpO1xuICAgICAgdGhpcy5tZXNzYWdlcGFuZWwgPSBudWxsO1xuICAgIH1cbiAgfVxufVxuIl19
//# sourceURL=/Users/Marvin/.atom/packages/latex-plus/lib/status.js
