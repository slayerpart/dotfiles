(function() {
  var Inspector, MessagePanelView, PlainMessageView, transform, transformime, _ref;

  _ref = require('atom-message-panel'), MessagePanelView = _ref.MessagePanelView, PlainMessageView = _ref.PlainMessageView;

  transformime = require('transformime');

  module.exports = Inspector = (function() {
    function Inspector(kernelManager, codeManager) {
      this.kernelManager = kernelManager;
      this.codeManager = codeManager;
      this._lastInspectionResult = '';
    }

    Inspector.prototype.toggle = function() {
      var code, cursor_pos, editor, grammar, kernel, language, _ref1, _ref2;
      editor = atom.workspace.getActiveTextEditor();
      grammar = editor.getGrammar();
      language = this.kernelManager.getLanguageFor(grammar);
      kernel = this.kernelManager.getRunningKernelFor(language);
      if (kernel == null) {
        atom.notifications.addInfo('No kernel running!');
        if ((_ref1 = this.view) != null) {
          _ref1.close();
        }
        return;
      }
      if (this.view == null) {
        this.view = new MessagePanelView({
          title: 'Hydrogen Inspector',
          closeMethod: 'destroy'
        });
      }
      _ref2 = this.codeManager.getCodeToInspect(), code = _ref2[0], cursor_pos = _ref2[1];
      if (cursor_pos === 0) {
        return;
      }
      return kernel.inspect(code, cursor_pos, (function(_this) {
        return function(result) {
          return _this.showInspectionResult(result);
        };
      })(this));
    };

    Inspector.prototype.showInspectionResult = function(result) {
      var onError, onInspectResult, _ref1;
      console.log('Inspector: Result:', result);
      if (!result.found) {
        atom.notifications.addInfo('No introspection available!');
        if ((_ref1 = this.view) != null) {
          _ref1.close();
        }
        return;
      }
      onInspectResult = (function(_this) {
        return function(_arg) {
          var container, el, firstline, lines, message, mimetype, _ref2, _ref3, _ref4;
          mimetype = _arg.mimetype, el = _arg.el;
          if (mimetype === 'text/plain') {
            lines = el.innerHTML.split('\n');
            firstline = lines[0];
            lines.splice(0, 1);
            message = lines.join('\n');
            if (_this._lastInspectionResult === message && (_this.view.panel != null)) {
              if ((_ref2 = _this.view) != null) {
                _ref2.close();
              }
              return;
            }
            _this.view.clear();
            _this.view.attach();
            _this.view.add(new PlainMessageView({
              message: firstline,
              className: 'inspect-message',
              raw: true
            }));
            _this.view.add(new PlainMessageView({
              message: message,
              className: 'inspect-message',
              raw: true
            }));
            _this._lastInspectionResult = message;
            return;
          } else if (mimetype === 'text/html') {
            container = document.createElement('div');
            container.appendChild(el);
            message = container.innerHTML;
            if (_this._lastInspectionResult === message && (_this.view.panel != null)) {
              if ((_ref3 = _this.view) != null) {
                _ref3.close();
              }
              return;
            }
            _this.view.clear();
            _this.view.attach();
            _this.view.add(new PlainMessageView({
              message: message,
              className: 'inspect-message',
              raw: true
            }));
            _this._lastInspectionResult = message;
            return;
          }
          console.error('Inspector: Rendering error:', mimetype, el);
          atom.notifications.addInfo('Cannot render introspection result!');
          if ((_ref4 = _this.view) != null) {
            _ref4.close();
          }
        };
      })(this);
      onError = (function(_this) {
        return function(error) {
          var _ref2;
          console.error('Inspector: Rendering error:', error);
          atom.notifications.addInfo('Cannot render introspection result!');
          return (_ref2 = _this.view) != null ? _ref2.close() : void 0;
        };
      })(this);
      return transform(result.data).then(onInspectResult, onError);
    };

    return Inspector;

  })();

  transform = transformime.createTransform();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL01hcnZpbi8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvaW5zcGVjdG9yLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw0RUFBQTs7QUFBQSxFQUFBLE9BQXVDLE9BQUEsQ0FBUSxvQkFBUixDQUF2QyxFQUFDLHdCQUFBLGdCQUFELEVBQW1CLHdCQUFBLGdCQUFuQixDQUFBOztBQUFBLEVBQ0EsWUFBQSxHQUFlLE9BQUEsQ0FBUSxjQUFSLENBRGYsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDVyxJQUFBLG1CQUFFLGFBQUYsRUFBa0IsV0FBbEIsR0FBQTtBQUNULE1BRFUsSUFBQyxDQUFBLGdCQUFBLGFBQ1gsQ0FBQTtBQUFBLE1BRDBCLElBQUMsQ0FBQSxjQUFBLFdBQzNCLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxxQkFBRCxHQUF5QixFQUF6QixDQURTO0lBQUEsQ0FBYjs7QUFBQSx3QkFHQSxNQUFBLEdBQVEsU0FBQSxHQUFBO0FBQ0osVUFBQSxpRUFBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFULENBQUE7QUFBQSxNQUNBLE9BQUEsR0FBVSxNQUFNLENBQUMsVUFBUCxDQUFBLENBRFYsQ0FBQTtBQUFBLE1BRUEsUUFBQSxHQUFXLElBQUMsQ0FBQSxhQUFhLENBQUMsY0FBZixDQUE4QixPQUE5QixDQUZYLENBQUE7QUFBQSxNQUdBLE1BQUEsR0FBUyxJQUFDLENBQUEsYUFBYSxDQUFDLG1CQUFmLENBQW1DLFFBQW5DLENBSFQsQ0FBQTtBQUlBLE1BQUEsSUFBTyxjQUFQO0FBQ0ksUUFBQSxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQW5CLENBQTJCLG9CQUEzQixDQUFBLENBQUE7O2VBQ0ssQ0FBRSxLQUFQLENB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

//# sourceURL=/Users/Marvin/.atom/packages/Hydrogen/lib/inspector.coffee
