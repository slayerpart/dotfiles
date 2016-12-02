(function() {
  var AtomReact, CompositeDisposable, Disposable, autoCompleteTagCloseRegex, autoCompleteTagStartRegex, contentCheckRegex, decreaseIndentForNextLinePattern, defaultDetectReactFilePattern, jsxComplexAttributePattern, jsxTagStartPattern, _ref;

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Disposable = _ref.Disposable;

  contentCheckRegex = null;

  defaultDetectReactFilePattern = '/((require\\([\'"]react(?:(-native|\\/addons))?[\'"]\\)))|(import\\s+[\\w{},\\s]+\\s+from\\s+[\'"]react(?:(-native|\\/addons))?[\'"])/';

  autoCompleteTagStartRegex = /(<)([a-zA-Z0-9\.:$_]+)/g;

  autoCompleteTagCloseRegex = /(<\/)([^>]+)(>)/g;

  jsxTagStartPattern = '(?x)((^|=|return)\\s*<([^!/?](?!.+?(</.+?>))))';

  jsxComplexAttributePattern = '(?x)\\{ [^}"\']* $|\\( [^)"\']* $';

  decreaseIndentForNextLinePattern = '(?x) />\\s*(,|;)?\\s*$ | ^\\s*\\S+.*</[-_\\.A-Za-z0-9]+>$';

  AtomReact = (function() {
    AtomReact.prototype.config = {
      enabledForAllJavascriptFiles: {
        type: 'boolean',
        "default": false,
        description: 'Enable grammar, snippets and other features automatically for all .js files.'
      },
      disableAutoClose: {
        type: 'boolean',
        "default": false,
        description: 'Disabled tag autocompletion'
      },
      detectReactFilePattern: {
        type: 'string',
        "default": defaultDetectReactFilePattern
      },
      jsxTagStartPattern: {
        type: 'string',
        "default": jsxTagStartPattern
      },
      jsxComplexAttributePattern: {
        type: 'string',
        "default": jsxComplexAttributePattern
      },
      decreaseIndentForNextLinePattern: {
        type: 'string',
        "default": decreaseIndentForNextLinePattern
      }
    };

    function AtomReact() {}

    AtomReact.prototype.patchEditorLangModeAutoDecreaseIndentForBufferRow = function(editor) {
      var fn, self;
      self = this;
      fn = editor.languageMode.autoDecreaseIndentForBufferRow;
      if (fn.jsxPatch) {
        return;
      }
      return editor.languageMode.autoDecreaseIndentForBufferRow = function(bufferRow, options) {
        var currentIndentLevel, decreaseIndentRegex, decreaseNextLineIndentRegex, desiredIndentLevel, increaseIndentRegex, line, precedingLine, precedingRow, scopeDescriptor;
        if (editor.getGrammar().scopeName !== "source.js.jsx") {
          return fn.call(editor.languageMode, bufferRow, options);
        }
        scopeDescriptor = this.editor.scopeDescriptorForBufferPosition([bufferRow, 0]);
        decreaseNextLineIndentRegex = this.cacheRegex(decreaseIndentForNextLinePattern);
        decreaseIndentRegex = this.decreaseIndentRegexForScopeDescriptor(scopeDescriptor);
        increaseIndentRegex = this.increaseIndentRegexForScopeDescriptor(scopeDescriptor);
        precedingRow = this.buffer.previousNonBlankRow(bufferRow);
        if (precedingRow < 0) {
          return;
        }
        precedingLine = this.buffer.lineForRow(precedingRow);
        line = this.buffer.lineForRow(bufferRow);
        if (precedingLine && decreaseNextLineIndentRegex.testSync(precedingLine) && !(increaseIndentRegex && increaseIndentRegex.testSync(precedingLine)) && !this.editor.isBufferRowCommented(precedingRow)) {
          currentIndentLevel = this.editor.indentationForBufferRow(precedingRow);
          if (decreaseIndentRegex && decreaseIndentRegex.testSync(line)) {
            currentIndentLevel -= 1;
          }
          desiredIndentLevel = currentIndentLevel - 1;
          if (desiredIndentLevel >= 0 && desiredIndentLevel < currentIndentLevel) {
            return this.editor.setIndentationForBufferRow(bufferRow, desiredIndentLevel);
          }
        } else if (!this.editor.isBufferRowCommented(bufferRow)) {
          return fn.call(editor.languageMode, bufferRow, options);
        }
      };
    };

    AtomReact.prototype.patchEditorLangModeSuggestedIndentForBufferRow = function(editor) {
      var fn, self;
      self = this;
      fn = editor.languageMode.suggestedIndentForBufferRow;
      if (fn.jsxPatch) {
        return;
      }
      return editor.languageMode.suggestedIndentForBufferRow = function(bufferRow, options) {
        var complexAttributeRegex, decreaseIndentRegex, decreaseIndentTest, decreaseNextLineIndentRegex, increaseIndentRegex, indent, precedingLine, precedingRow, scopeDescriptor, tagStartRegex, tagStartTest;
        indent = fn.call(editor.languageMode, bufferRow, options);
        if (!(editor.getGrammar().scopeName === "source.js.jsx" && bufferRow > 1)) {
          return indent;
        }
        scopeDescriptor = this.editor.scopeDescriptorForBufferPosition([bufferRow, 0]);
        decreaseNextLineIndentRegex = this.cacheRegex(decreaseIndentForNextLinePattern);
        increaseIndentRegex = this.increaseIndentRegexForScopeDescriptor(scopeDescriptor);
        decreaseIndentRegex = this.decreaseIndentRegexForScopeDescriptor(scopeDescriptor);
        tagStartRegex = this.cacheRegex(jsxTagStartPattern);
        complexAttributeRegex = this.cacheRegex(jsxComplexAttributePattern);
        precedingRow = this.buffer.previousNonBlankRow(bufferRow);
        if (precedingRow < 0) {
          return indent;
        }
        precedingLine = this.buffer.lineForRow(precedingRow);
        if (precedingLine == null) {
          return indent;
        }
        if (this.editor.isBufferRowCommented(bufferRow) && this.editor.isBufferRowCommented(precedingRow)) {
          return this.editor.indentationForBufferRow(precedingRow);
        }
        tagStartTest = tagStartRegex.testSync(precedingLine);
        decreaseIndentTest = decreaseIndentRegex.testSync(precedingLine);
        if (tagStartTest && complexAttributeRegex.testSync(precedingLine) && !this.editor.isBufferRowCommented(precedingRow)) {
          indent += 1;
        }
        if (precedingLine && !decreaseIndentTest && decreaseNextLineIndentRegex.testSync(precedingLine) && !this.editor.isBufferRowCommented(precedingRow)) {
          indent -= 1;
        }
        return Math.max(indent, 0);
      };
    };

    AtomReact.prototype.patchEditorLangMode = function(editor) {
      var _ref1, _ref2;
      if ((_ref1 = this.patchEditorLangModeSuggestedIndentForBufferRow(editor)) != null) {
        _ref1.jsxPatch = true;
      }
      return (_ref2 = this.patchEditorLangModeAutoDecreaseIndentForBufferRow(editor)) != null ? _ref2.jsxPatch = true : void 0;
    };

    AtomReact.prototype.isReact = function(text) {
      var match;
      if (atom.config.get('react.enabledForAllJavascriptFiles')) {
        return true;
      }
      if (contentCheckRegex == null) {
        match = (atom.config.get('react.detectReactFilePattern') || defaultDetectReactFilePattern).match(new RegExp('^/(.*?)/([gimy]*)$'));
        contentCheckRegex = new RegExp(match[1], match[2]);
      }
      return text.match(contentCheckRegex) != null;
    };

    AtomReact.prototype.isReactEnabledForEditor = function(editor) {
      var _ref1;
      return (editor != null) && ((_ref1 = editor.getGrammar().scopeName) === "source.js.jsx" || _ref1 === "source.coffee.jsx");
    };

    AtomReact.prototype.autoSetGrammar = function(editor) {
      var extName, jsxGrammar, path;
      if (this.isReactEnabledForEditor(editor)) {
        return;
      }
      path = require('path');
      extName = path.extname(editor.getPath());
      if (extName === ".jsx" || ((extName === ".js" || extName === ".es6") && this.isReact(editor.getText()))) {
        jsxGrammar = atom.grammars.grammarsByScopeName["source.js.jsx"];
        if (jsxGrammar) {
          return editor.setGrammar(jsxGrammar);
        }
      }
    };

    AtomReact.prototype.onHTMLToJSX = function() {
      var HTMLtoJSX, converter, editor, jsxformat, selections;
      jsxformat = require('jsxformat');
      HTMLtoJSX = require('./htmltojsx');
      converter = new HTMLtoJSX({
        createClass: false
      });
      editor = atom.workspace.getActiveTextEditor();
      if (!this.isReactEnabledForEditor(editor)) {
        return;
      }
      selections = editor.getSelections();
      return editor.transact((function(_this) {
        return function() {
          var jsxOutput, range, selection, selectionText, _i, _len, _results;
          _results = [];
          for (_i = 0, _len = selections.length; _i < _len; _i++) {
            selection = selections[_i];
            try {
              selectionText = selection.getText();
              jsxOutput = converter.convert(selectionText);
              try {
                jsxformat.setOptions({});
                jsxOutput = jsxformat.format(jsxOutput);
              } catch (_error) {}
              selection.insertText(jsxOutput);
              range = selection.getBufferRange();
              _results.push(editor.autoIndentBufferRows(range.start.row, range.end.row));
            } catch (_error) {}
          }
          return _results;
        };
      })(this));
    };

    AtomReact.prototype.onReformat = function() {
      var editor, jsxformat, selections, _;
      jsxformat = require('jsxformat');
      _ = require('lodash');
      editor = atom.workspace.getActiveTextEditor();
      if (!this.isReactEnabledForEditor(editor)) {
        return;
      }
      selections = editor.getSelections();
      return editor.transact((function(_this) {
        return function() {
          var bufEnd, bufStart, err, firstChangedLine, lastChangedLine, newLineCount, original, originalLineCount, range, result, selection, serializedRange, _i, _len, _results;
          _results = [];
          for (_i = 0, _len = selections.length; _i < _len; _i++) {
            selection = selections[_i];
            try {
              range = selection.getBufferRange();
              serializedRange = range.serialize();
              bufStart = serializedRange[0];
              bufEnd = serializedRange[1];
              jsxformat.setOptions({});
              result = jsxformat.format(selection.getText());
              originalLineCount = editor.getLineCount();
              selection.insertText(result);
              newLineCount = editor.getLineCount();
              editor.autoIndentBufferRows(bufStart[0], bufEnd[0] + (newLineCount - originalLineCount));
              _results.push(editor.setCursorBufferPosition(bufStart));
            } catch (_error) {
              err = _error;
              range = selection.getBufferRange().serialize();
              range[0][0]++;
              range[1][0]++;
              jsxformat.setOptions({
                range: range
              });
              original = editor.getText();
              try {
                result = jsxformat.format(original);
                selection.clear();
                originalLineCount = editor.getLineCount();
                editor.setText(result);
                newLineCount = editor.getLineCount();
                firstChangedLine = range[0][0] - 1;
                lastChangedLine = range[1][0] - 1 + (newLineCount - originalLineCount);
                editor.autoIndentBufferRows(firstChangedLine, lastChangedLine);
                _results.push(editor.setCursorBufferPosition([firstChangedLine, range[0][1]]));
              } catch (_error) {}
            }
          }
          return _results;
        };
      })(this));
    };

    AtomReact.prototype.autoCloseTag = function(eventObj, editor) {
      var fullLine, lastLine, lastLineSpaces, line, lines, match, rest, row, serializedEndPoint, tagName, token, tokenizedLine, _ref1, _ref2;
      if (atom.config.get('react.disableAutoClose')) {
        return;
      }
      if (!this.isReactEnabledForEditor(editor) || editor !== atom.workspace.getActiveTextEditor()) {
        return;
      }
      if ((eventObj != null ? eventObj.newText : void 0) === '>' && !eventObj.oldText) {
        if (editor.getCursorBufferPositions().length > 1) {
          return;
        }
        tokenizedLine = (_ref1 = editor.tokenizedBuffer) != null ? _ref1.tokenizedLineForRow(eventObj.newRange.end.row) : void 0;
        if (tokenizedLine == null) {
          return;
        }
        token = tokenizedLine.tokenAtBufferColumn(eventObj.newRange.end.column - 1);
        if ((token == null) || token.scopes.indexOf('tag.open.js') === -1 || token.scopes.indexOf('punctuation.definition.tag.end.js') === -1) {
          return;
        }
        lines = editor.buffer.getLines();
        row = eventObj.newRange.end.row;
        line = lines[row];
        line = line.substr(0, eventObj.newRange.end.column);
        if (line.substr(line.length - 2, 1) === '/') {
          return;
        }
        tagName = null;
        while ((line != null) && (tagName == null)) {
          match = line.match(autoCompleteTagStartRegex);
          if ((match != null) && match.length > 0) {
            tagName = match.pop().substr(1);
          }
          row--;
          line = lines[row];
        }
        if (tagName != null) {
          editor.insertText('</' + tagName + '>', {
            undo: 'skip'
          });
          return editor.setCursorBufferPosition(eventObj.newRange.end);
        }
      } else if ((eventObj != null ? eventObj.oldText : void 0) === '>' && (eventObj != null ? eventObj.newText : void 0) === '') {
        lines = editor.buffer.getLines();
        row = eventObj.newRange.end.row;
        fullLine = lines[row];
        tokenizedLine = (_ref2 = editor.tokenizedBuffer) != null ? _ref2.tokenizedLineForRow(eventObj.newRange.end.row) : void 0;
        if (tokenizedLine == null) {
          return;
        }
        token = tokenizedLine.tokenAtBufferColumn(eventObj.newRange.end.column - 1);
        if ((token == null) || token.scopes.indexOf('tag.open.js') === -1) {
          return;
        }
        line = fullLine.substr(0, eventObj.newRange.end.column);
        if (line.substr(line.length - 1, 1) === '/') {
          return;
        }
        tagName = null;
        while ((line != null) && (tagName == null)) {
          match = line.match(autoCompleteTagStartRegex);
          if ((match != null) && match.length > 0) {
            tagName = match.pop().substr(1);
          }
          row--;
          line = lines[row];
        }
        if (tagName != null) {
          rest = fullLine.substr(eventObj.newRange.end.column);
          if (rest.indexOf('</' + tagName + '>') === 0) {
            serializedEndPoint = [eventObj.newRange.end.row, eventObj.newRange.end.column];
            return editor.setTextInBufferRange([serializedEndPoint, [serializedEndPoint[0], serializedEndPoint[1] + tagName.length + 3]], '', {
              undo: 'skip'
            });
          }
        }
      } else if ((eventObj != null ? eventObj.newText : void 0) === '\n') {
        lines = editor.buffer.getLines();
        row = eventObj.newRange.end.row;
        lastLine = lines[row - 1];
        fullLine = lines[row];
        if (/>$/.test(lastLine) && fullLine.search(autoCompleteTagCloseRegex) === 0) {
          while (lastLine != null) {
            match = lastLine.match(autoCompleteTagStartRegex);
            if ((match != null) && match.length > 0) {
              break;
            }
            row--;
            lastLine = lines[row];
          }
          lastLineSpaces = lastLine.match(/^\s*/);
          lastLineSpaces = lastLineSpaces != null ? lastLineSpaces[0] : '';
          editor.insertText('\n' + lastLineSpaces);
          return editor.setCursorBufferPosition(eventObj.newRange.end);
        }
      }
    };

    AtomReact.prototype.processEditor = function(editor) {
      var disposableBufferEvent;
      this.patchEditorLangMode(editor);
      this.autoSetGrammar(editor);
      disposableBufferEvent = editor.buffer.onDidChange((function(_this) {
        return function(e) {
          return _this.autoCloseTag(e, editor);
        };
      })(this));
      this.disposables.add(editor.onDidDestroy((function(_this) {
        return function() {
          return disposableBufferEvent.dispose();
        };
      })(this)));
      return this.disposables.add(disposableBufferEvent);
    };

    AtomReact.prototype.deactivate = function() {
      return this.disposables.dispose();
    };

    AtomReact.prototype.activate = function() {
      var disposableConfigListener, disposableHTMLTOJSX, disposableProcessEditor, disposableReformat;
      this.disposables = new CompositeDisposable();
      disposableConfigListener = atom.config.observe('react.detectReactFilePattern', function(newValue) {
        return contentCheckRegex = null;
      });
      disposableReformat = atom.commands.add('atom-workspace', 'react:reformat-JSX', (function(_this) {
        return function() {
          return _this.onReformat();
        };
      })(this));
      disposableHTMLTOJSX = atom.commands.add('atom-workspace', 'react:HTML-to-JSX', (function(_this) {
        return function() {
          return _this.onHTMLToJSX();
        };
      })(this));
      disposableProcessEditor = atom.workspace.observeTextEditors(this.processEditor.bind(this));
      this.disposables.add(disposableConfigListener);
      this.disposables.add(disposableReformat);
      this.disposables.add(disposableHTMLTOJSX);
      return this.disposables.add(disposableProcessEditor);
    };

    return AtomReact;

  })();

  module.exports = AtomReact;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL01hcnZpbi8uYXRvbS9wYWNrYWdlcy9yZWFjdC9saWIvYXRvbS1yZWFjdC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsME9BQUE7O0FBQUEsRUFBQSxPQUFvQyxPQUFBLENBQVEsTUFBUixDQUFwQyxFQUFDLDJCQUFBLG1CQUFELEVBQXNCLGtCQUFBLFVBQXRCLENBQUE7O0FBQUEsRUFFQSxpQkFBQSxHQUFvQixJQUZwQixDQUFBOztBQUFBLEVBR0EsNkJBQUEsR0FBZ0Msd0lBSGhDLENBQUE7O0FBQUEsRUFJQSx5QkFBQSxHQUE0Qix5QkFKNUIsQ0FBQTs7QUFBQSxFQUtBLHlCQUFBLEdBQTRCLGtCQUw1QixDQUFBOztBQUFBLEVBT0Esa0JBQUEsR0FBcUIsZ0RBUHJCLENBQUE7O0FBQUEsRUFRQSwwQkFBQSxHQUE2QixtQ0FSN0IsQ0FBQTs7QUFBQSxFQVNBLGdDQUFBLEdBQW1DLDJEQVRuQyxDQUFBOztBQUFBLEVBYU07QUFDSix3QkFBQSxNQUFBLEdBQ0U7QUFBQSxNQUFBLDRCQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsS0FEVDtBQUFBLFFBRUEsV0FBQSxFQUFhLDhFQUZiO09BREY7QUFBQSxNQUlBLGdCQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsS0FEVDtBQUFBLFFBRUEsV0FBQSxFQUFhLDZCQUZiO09BTEY7QUFBQSxNQVFBLHNCQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsNkJBRFQ7T0FURjtBQUFBLE1BV0Esa0JBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxrQkFEVDtPQVpGO0FBQUEsTUFjQSwwQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLDBCQURUO09BZkY7QUFBQSxNQWlCQSxnQ0FBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLGdDQURUO09BbEJGO0tBREYsQ0FBQTs7QUFzQmEsSUFBQSxtQkFBQSxHQUFBLENBdEJiOztBQUFBLHdCQXVCQSxpREFBQSxHQUFtRCxTQUFDLE1BQUQsR0FBQTtBQUNqRCxVQUFBLFFBQUE7QUFBQSxNQUFBLElBQUEsR0FBTyxJQUFQLENBQUE7QUFBQSxNQUNBLEVBQUEsR0FBSyxNQUFNLENBQUMsWUFBWSxDQUFDLDhCQUR6QixDQUFBO0FBRUEsTUFBQSxJQUFVLEVBQUUsQ0FBQyxRQUFiO0FBQUEsY0FBQSxDQUFBO09BRkE7YUFJQSxNQUFNLENBQUMsWUFBWSxDQUFDLDhCQUFwQixHQUFxRCxTQUFDLFNBQUQsRUFBWSxPQUFaLEdBQUE7QUFDbkQsWUFBQSxpS0FBQTtBQUFBLFFBQUEsSUFBK0QsTUFBTSxDQUFDLFVBQVAsQ0FBQSxDQUFtQixDQUFDLFNBQXBCLEtBQWlDLGVBQWhHO0FBQUEsaUJBQU8sRUFBRSxDQUFDLElBQUgsQ0FBUSxNQUFNLENBQUMsWUFBZixFQUE2QixTQUE3QixFQUF3QyxPQUF4QyxDQUFQLENBQUE7U0FBQTtBQUFBLFFBRUEsZUFBQSxHQUFrQixJQUFDLENBQUEsTUFBTSxDQUFDLGdDQUFSLENBQXlDLENBQUMsU0FBRCxFQUFZLENBQVosQ0FBekMsQ0FGbEIsQ0FBQTtBQUFBLFFBR0EsMkJBQUEsR0FBOEIsSUFBQyxDQUFBLFVBQUQsQ0FBWSxnQ0FBWixDQUg5QixDQUFBO0FBQUEsUUFJQSxtQkFBQSxHQUFzQixJQUFDLENBQUEscUNBQUQsQ0FBdUMsZUFBdkMsQ0FKdEIsQ0FBQTtBQUFBLFFBS0EsbUJBQUEsR0FBc0IsSUFBQyxDQUFBLHFDQUFELENBQXVDLGVBQXZDLENBTHRCLENBQUE7QUFBQSxRQU9BLFlBQUEsR0FBZSxJQUFDLENBQUEsTUFBTSxDQUFDLG1CQUFSLENBQTRCLFNBQTVCLENBUGYsQ0FBQTtBQVNBLFFBQUEsSUFBVSxZQUFBLEdBQWUsQ0FBekI7QUFBQSxnQkFBQSxDQUFBO1NBVEE7QUFBQSxRQVdBLGFBQUEsR0FBZ0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxVQUFSLENBQW1CLFlBQW5CLENBWGhCLENBQUE7QUFBQSxRQVlBLElBQUEsR0FBTyxJQUFDLENBQUEsTUFBTSxDQUFDLFVBQVIsQ0FBbUIsU0FBbkIsQ0FaUCxDQUFBO0FBY0EsUUFBQSxJQUFHLGFBQUEsSUFBa0IsMkJBQTJCLENBQUMsUUFBNUIsQ0FBcUMsYUFBckMsQ0FBbEIsSUFDQSxDQUFBLENBQUssbUJBQUEsSUFBd0IsbUJBQW1CLENBQUMsUUFBcEIsQ0FBNkIsYUFBN0IsQ0FBekIsQ0FESixJQUVBLENBQUEsSUFBSyxDQUFBLE1BQU0sQ0FBQyxvQkFBUixDQUE2QixZQUE3QixDQUZQO0FBR0UsVUFBQSxrQkFBQSxHQUFxQixJQUFDLENBQUEsTUFBTSxDQUFDLHVCQUFSLENBQWdDLFlBQWhDLENBQXJCLENBQUE7QUFDQSxVQUFBLElBQTJCLG1CQUFBLElBQXdCLG1CQUFtQixDQUFDLFFBQXBCLENBQTZCLElBQTdCLENBQW5EO0FBQUEsWUFBQSxrQkFBQSxJQUFzQixDQUF0QixDQUFBO1dBREE7QUFBQSxVQUVBLGtCQUFBLEdBQXFCLGtCQUFBLEdBQXFCLENBRjFDLENBQUE7QUFHQSxVQUFBLElBQUcsa0JBQUEsSUFBc0IsQ0FBdEIsSUFBNEIsa0JBQUEsR0FBcUIsa0JBQXBEO21CQUNFLElBQUMsQ0FBQSxNQUFNLENBQUMsMEJBQVIsQ0FBbUMsU0FBbkMsRUFBOEMsa0JBQTlDLEVBREY7V0FORjtTQUFBLE1BUUssSUFBRyxDQUFBLElBQUssQ0FBQSxNQUFNLENBQUMsb0JBQVIsQ0FBNkIsU0FBN0IsQ0FBUDtpQkFDSCxFQUFFLENBQUMsSUFBSCxDQUFRLE1BQU0sQ0FBQyxZQUFmLEVBQTZCLFNBQTdCLEVBQXdDLE9BQXhDLEVBREc7U0F2QjhDO01BQUEsRUFMSjtJQUFBLENBdkJuRCxDQUFBOztBQUFBLHdCQXNEQSw4Q0FBQSxHQUFnRCxTQUFDLE1BQUQsR0FBQTtBQUM5QyxVQUFBLFFBQUE7QUFBQSxNQUFBLElBQUEsR0FBTyxJQUFQLENBQUE7QUFBQSxNQUNBLEVBQUEsR0FBSyxNQUFNLENBQUMsWUFBWSxDQUFDLDJCQUR6QixDQUFBO0FBRUEsTUFBQSxJQUFVLEVBQUUsQ0FBQyxRQUFiO0FBQUEsY0FBQSxDQUFBO09BRkE7YUFJQSxNQUFNLENBQUMsWUFBWSxDQUFDLDJCQUFwQixHQUFrRCxTQUFDLFNBQUQsRUFBWSxPQUFaLEdBQUE7QUFDaEQsWUFBQSxtTUFBQTtBQUFBLFFBQUEsTUFBQSxHQUFTLEVBQUUsQ0FBQyxJQUFILENBQVEsTUFBTSxDQUFDLFlBQWYsRUFBNkIsU0FBN0IsRUFBd0MsT0FBeEMsQ0FBVCxDQUFBO0FBQ0EsUUFBQSxJQUFBLENBQUEsQ0FBcUIsTUFBTSxDQUFDLFVBQVAsQ0FBQSxDQUFtQixDQUFDLFNBQXBCLEtBQWlDLGVBQWpDLElBQXFELFNBQUEsR0FBWSxDQUF0RixDQUFBO0FBQUEsaUJBQU8sTUFBUCxDQUFBO1NBREE7QUFBQSxRQUdBLGVBQUEsR0FBa0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxnQ0FBUixDQUF5QyxDQUFDLFNBQUQsRUFBWSxDQUFaLENBQXpDLENBSGxCLENBQUE7QUFBQSxRQUtBLDJCQUFBLEdBQThCLElBQUMsQ0FBQSxVQUFELENBQVksZ0NBQVosQ0FMOUIsQ0FBQTtBQUFBLFFBTUEsbUJBQUEsR0FBc0IsSUFBQyxDQUFBLHFDQUFELENBQXVDLGVBQXZDLENBTnRCLENBQUE7QUFBQSxRQVFBLG1CQUFBLEdBQXNCLElBQUMsQ0FBQSxxQ0FBRCxDQUF1QyxlQUF2QyxDQVJ0QixDQUFBO0FBQUEsUUFTQSxhQUFBLEdBQWdCLElBQUMsQ0FBQSxVQUFELENBQVksa0JBQVosQ0FUaEIsQ0FBQTtBQUFBLFFBVUEscUJBQUEsR0FBd0IsSUFBQyxDQUFBLFVBQUQsQ0FBWSwwQkFBWixDQVZ4QixDQUFBO0FBQUEsUUFZQSxZQUFBLEdBQWUsSUFBQyxDQUFBLE1BQU0sQ0FBQyxtQkFBUixDQUE0QixTQUE1QixDQVpmLENBQUE7QUFjQSxRQUFBLElBQWlCLFlBQUEsR0FBZSxDQUFoQztBQUFBLGlCQUFPLE1BQVAsQ0FBQTtTQWRBO0FBQUEsUUFnQkEsYUFBQSxHQUFnQixJQUFDLENBQUEsTUFBTSxDQUFDLFVBQVIsQ0FBbUIsWUFBbkIsQ0FoQmhCLENBQUE7QUFrQkEsUUFBQSxJQUFxQixxQkFBckI7QUFBQSxpQkFBTyxNQUFQLENBQUE7U0FsQkE7QUFvQkEsUUFBQSxJQUFHLElBQUMsQ0FBQSxNQUFNLENBQUMsb0JBQVIsQ0FBNkIsU0FBN0IsQ0FBQSxJQUE0QyxJQUFDLENBQUEsTUFBTSxDQUFDLG9CQUFSLENBQTZCLFlBQTdCLENBQS9DO0FBQ0UsaUJBQU8sSUFBQyxDQUFBLE1BQU0sQ0FBQyx1QkFBUixDQUFnQyxZQUFoQyxDQUFQLENBREY7U0FwQkE7QUFBQSxRQXVCQSxZQUFBLEdBQWUsYUFBYSxDQUFDLFFBQWQsQ0FBdUIsYUFBdkIsQ0F2QmYsQ0FBQTtBQUFBLFFBd0JBLGtCQUFBLEdBQXFCLG1CQUFtQixDQUFDLFFBQXBCLENBQTZCLGFBQTdCLENBeEJyQixDQUFBO0FBMEJBLFFBQUEsSUFBZSxZQUFBLElBQWlCLHFCQUFxQixDQUFDLFFBQXRCLENBQStCLGFBQS9CLENBQWpCLElBQW1FLENBQUEsSUFBSyxDQUFBLE1BQU0sQ0FBQyxvQkFBUixDQUE2QixZQUE3QixDQUF0RjtBQUFBLFVBQUEsTUFBQSxJQUFVLENBQVYsQ0FBQTtTQTFCQTtBQTJCQSxRQUFBLElBQWUsYUFBQSxJQUFrQixDQUFBLGtCQUFsQixJQUE2QywyQkFBMkIsQ0FBQyxRQUE1QixDQUFxQyxhQUFyQyxDQUE3QyxJQUFxRyxDQUFBLElBQUssQ0FBQSxNQUFNLENBQUMsb0JBQVIsQ0FBNkIsWUFBN0IsQ0FBeEg7QUFBQSxVQUFBLE1BQUEsSUFBVSxDQUFWLENBQUE7U0EzQkE7QUE2QkEsZUFBTyxJQUFJLENBQUMsR0FBTCxDQUFTLE1BQVQsRUFBaUIsQ0FBakIsQ0FBUCxDQTlCZ0Q7TUFBQSxFQUxKO0lBQUEsQ0F0RGhELENBQUE7O0FBQUEsd0JBMkZBLG1CQUFBLEdBQXFCLFNBQUMsTUFBRCxHQUFBO0FBQ25CLFVBQUEsWUFBQTs7YUFBdUQsQ0FBRSxRQUF6RCxHQUFvRTtPQUFwRTtxR0FDMEQsQ0FBRSxRQUE1RCxHQUF1RSxjQUZwRDtJQUFBLENBM0ZyQixDQUFBOztBQUFBLHdCQStGQSxPQUFBLEdBQVMsU0FBQyxJQUFELEdBQUE7QUFDUCxVQUFBLEtBQUE7QUFBQSxNQUFBLElBQWUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLG9DQUFoQixDQUFmO0FBQUEsZUFBTyxJQUFQLENBQUE7T0FBQTtBQUdBLE1BQUEsSUFBTyx5QkFBUDtBQUNFLFFBQUEsS0FBQSxHQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDhCQUFoQixDQUFBLElBQW1ELDZCQUFwRCxDQUFrRixDQUFDLEtBQW5GLENBQTZGLElBQUEsTUFBQSxDQUFPLG9CQUFQLENBQTdGLENBQVIsQ0FBQTtBQUFBLFFBQ0EsaUJBQUEsR0FBd0IsSUFBQSxNQUFBLENBQU8sS0FBTSxDQUFBLENBQUEsQ0FBYixFQUFpQixLQUFNLENBQUEsQ0FBQSxDQUF2QixDQUR4QixDQURGO09BSEE7QUFNQSxhQUFPLHFDQUFQLENBUE87SUFBQSxDQS9GVCxDQUFBOztBQUFBLHdCQXdHQSx1QkFBQSxHQUF5QixTQUFDLE1BQUQsR0FBQTtBQUN2QixVQUFBLEtBQUE7QUFBQSxhQUFPLGdCQUFBLElBQVcsVUFBQSxNQUFNLENBQUMsVUFBUCxDQUFBLENBQW1CLENBQUMsVUFBcEIsS0FBa0MsZUFBbEMsSUFBQSxLQUFBLEtBQW1ELG1CQUFuRCxDQUFsQixDQUR1QjtJQUFBLENBeEd6QixDQUFBOztBQUFBLHdCQTJHQSxjQUFBLEdBQWdCLFNBQUMsTUFBRCxHQUFBO0FBQ2QsVUFBQSx5QkFBQTtBQUFBLE1BQUEsSUFBVSxJQUFDLENBQUEsdUJBQUQsQ0FBeUIsTUFBekIsQ0FBVjtBQUFBLGNBQUEsQ0FBQTtPQUFBO0FBQUEsTUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FGUCxDQUFBO0FBQUEsTUFLQSxPQUFBLEdBQVUsSUFBSSxDQUFDLE9BQUwsQ0FBYSxNQUFNLENBQUMsT0FBUCxDQUFBLENBQWIsQ0FMVixDQUFBO0FBTUEsTUFBQSxJQUFHLE9BQUEsS0FBVyxNQUFYLElBQXFCLENBQUMsQ0FBQyxPQUFBLEtBQVcsS0FBWCxJQUFvQixPQUFBLEtBQVcsTUFBaEMsQ0FBQSxJQUE0QyxJQUFDLENBQUEsT0FBRCxDQUFTLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBVCxDQUE3QyxDQUF4QjtBQUNFLFFBQUEsVUFBQSxHQUFhLElBQUksQ0FBQyxRQUFRLENBQUMsbUJBQW9CLENBQUEsZUFBQSxDQUEvQyxDQUFBO0FBQ0EsUUFBQSxJQUFnQyxVQUFoQztpQkFBQSxNQUFNLENBQUMsVUFBUCxDQUFrQixVQUFsQixFQUFBO1NBRkY7T0FQYztJQUFBLENBM0doQixDQUFBOztBQUFBLHdCQXNIQSxXQUFBLEdBQWEsU0FBQSxHQUFBO0FBQ1gsVUFBQSxtREFBQTtBQUFBLE1BQUEsU0FBQSxHQUFZLE9BQUEsQ0FBUSxXQUFSLENBQVosQ0FBQTtBQUFBLE1BQ0EsU0FBQSxHQUFZLE9BQUEsQ0FBUSxhQUFSLENBRFosQ0FBQTtBQUFBLE1BRUEsU0FBQSxHQUFnQixJQUFBLFNBQUEsQ0FBVTtBQUFBLFFBQUEsV0FBQSxFQUFhLEtBQWI7T0FBVixDQUZoQixDQUFBO0FBQUEsTUFJQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBSlQsQ0FBQTtBQU1BLE1BQUEsSUFBVSxDQUFBLElBQUssQ0FBQSx1QkFBRCxDQUF5QixNQUF6QixDQUFkO0FBQUEsY0FBQSxDQUFBO09BTkE7QUFBQSxNQVFBLFVBQUEsR0FBYSxNQUFNLENBQUMsYUFBUCxDQUFBLENBUmIsQ0FBQTthQVVBLE1BQU0sQ0FBQyxRQUFQLENBQWdCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDZCxjQUFBLDhEQUFBO0FBQUE7ZUFBQSxpREFBQTt1Q0FBQTtBQUNFO0FBQ0UsY0FBQSxhQUFBLEdBQWdCLFNBQVMsQ0FBQyxPQUFWLENBQUEsQ0FBaEIsQ0FBQTtBQUFBLGNBQ0EsU0FBQSxHQUFZLFNBQVMsQ0FBQyxPQUFWLENBQWtCLGFBQWxCLENBRFosQ0FBQTtBQUdBO0FBQ0UsZ0JBQUEsU0FBUyxDQUFDLFVBQVYsQ0FBcUIsRUFBckIsQ0FBQSxDQUFBO0FBQUEsZ0JBQ0EsU0FBQSxHQUFZLFNBQVMsQ0FBQyxNQUFWLENBQWlCLFNBQWpCLENBRFosQ0FERjtlQUFBLGtCQUhBO0FBQUEsY0FPQSxTQUFTLENBQUMsVUFBVixDQUFxQixTQUFyQixDQVBBLENBQUE7QUFBQSxjQVFBLEtBQUEsR0FBUSxTQUFTLENBQUMsY0FBVixDQUFBLENBUlIsQ0FBQTtBQUFBLDRCQVNBLE1BQU0sQ0FBQyxvQkFBUCxDQUE0QixLQUFLLENBQUMsS0FBSyxDQUFDLEdBQXhDLEVBQTZDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBdkQsRUFUQSxDQURGO2FBQUEsa0JBREY7QUFBQTswQkFEYztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWhCLEVBWFc7SUFBQSxDQXRIYixDQUFBOztBQUFBLHdCQStJQSxVQUFBLEdBQVksU0FBQSxHQUFBO0FBQ1YsVUFBQSxnQ0FBQTtBQUFBLE1BQUEsU0FBQSxHQUFZLE9BQUEsQ0FBUSxXQUFSLENBQVosQ0FBQTtBQUFBLE1BQ0EsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSLENBREosQ0FBQTtBQUFBLE1BR0EsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUhULENBQUE7QUFLQSxNQUFBLElBQVUsQ0FBQSxJQUFLLENBQUEsdUJBQUQsQ0FBeUIsTUFBekIsQ0FBZDtBQUFBLGNBQUEsQ0FBQTtPQUxBO0FBQUEsTUFPQSxVQUFBLEdBQWEsTUFBTSxDQUFDLGFBQVAsQ0FBQSxDQVBiLENBQUE7YUFRQSxNQUFNLENBQUMsUUFBUCxDQUFnQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ2QsY0FBQSxrS0FBQTtBQUFBO2VBQUEsaURBQUE7dUNBQUE7QUFDRTtBQUNFLGNBQUEsS0FBQSxHQUFRLFNBQVMsQ0FBQyxjQUFWLENBQUEsQ0FBUixDQUFBO0FBQUEsY0FDQSxlQUFBLEdBQWtCLEtBQUssQ0FBQyxTQUFOLENBQUEsQ0FEbEIsQ0FBQTtBQUFBLGNBRUEsUUFBQSxHQUFXLGVBQWdCLENBQUEsQ0FBQSxDQUYzQixDQUFBO0FBQUEsY0FHQSxNQUFBLEdBQVMsZUFBZ0IsQ0FBQSxDQUFBLENBSHpCLENBQUE7QUFBQSxjQUtBLFNBQVMsQ0FBQyxVQUFWLENBQXFCLEVBQXJCLENBTEEsQ0FBQTtBQUFBLGNBTUEsTUFBQSxHQUFTLFNBQVMsQ0FBQyxNQUFWLENBQWlCLFNBQVMsQ0FBQyxPQUFWLENBQUEsQ0FBakIsQ0FOVCxDQUFBO0FBQUEsY0FRQSxpQkFBQSxHQUFvQixNQUFNLENBQUMsWUFBUCxDQUFBLENBUnBCLENBQUE7QUFBQSxjQVNBLFNBQVMsQ0FBQyxVQUFWLENBQXFCLE1BQXJCLENBVEEsQ0FBQTtBQUFBLGNBVUEsWUFBQSxHQUFlLE1BQU0sQ0FBQyxZQUFQLENBQUEsQ0FWZixDQUFBO0FBQUEsY0FZQSxNQUFNLENBQUMsb0JBQVAsQ0FBNEIsUUFBUyxDQUFBLENBQUEsQ0FBckMsRUFBeUMsTUFBTyxDQUFBLENBQUEsQ0FBUCxHQUFZLENBQUMsWUFBQSxHQUFlLGlCQUFoQixDQUFyRCxDQVpBLENBQUE7QUFBQSw0QkFhQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsUUFBL0IsRUFiQSxDQURGO2FBQUEsY0FBQTtBQWlCRSxjQUZJLFlBRUosQ0FBQTtBQUFBLGNBQUEsS0FBQSxHQUFRLFNBQVMsQ0FBQyxjQUFWLENBQUEsQ0FBMEIsQ0FBQyxTQUEzQixDQUFBLENBQVIsQ0FBQTtBQUFBLGNBRUEsS0FBTSxDQUFBLENBQUEsQ0FBRyxDQUFBLENBQUEsQ0FBVCxFQUZBLENBQUE7QUFBQSxjQUdBLEtBQU0sQ0FBQSxDQUFBLENBQUcsQ0FBQSxDQUFBLENBQVQsRUFIQSxDQUFBO0FBQUEsY0FLQSxTQUFTLENBQUMsVUFBVixDQUFxQjtBQUFBLGdCQUFDLEtBQUEsRUFBTyxLQUFSO2VBQXJCLENBTEEsQ0FBQTtBQUFBLGNBUUEsUUFBQSxHQUFXLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FSWCxDQUFBO0FBVUE7QUFDRSxnQkFBQSxNQUFBLEdBQVMsU0FBUyxDQUFDLE1BQVYsQ0FBaUIsUUFBakIsQ0FBVCxDQUFBO0FBQUEsZ0JBQ0EsU0FBUyxDQUFDLEtBQVYsQ0FBQSxDQURBLENBQUE7QUFBQSxnQkFHQSxpQkFBQSxHQUFvQixNQUFNLENBQUMsWUFBUCxDQUFBLENBSHBCLENBQUE7QUFBQSxnQkFJQSxNQUFNLENBQUMsT0FBUCxDQUFlLE1BQWYsQ0FKQSxDQUFBO0FBQUEsZ0JBS0EsWUFBQSxHQUFlLE1BQU0sQ0FBQyxZQUFQLENBQUEsQ0FMZixDQUFBO0FBQUEsZ0JBT0EsZ0JBQUEsR0FBbUIsS0FBTSxDQUFBLENBQUEsQ0FBRyxDQUFBLENBQUEsQ0FBVCxHQUFjLENBUGpDLENBQUE7QUFBQSxnQkFRQSxlQUFBLEdBQWtCLEtBQU0sQ0FBQSxDQUFBLENBQUcsQ0FBQSxDQUFBLENBQVQsR0FBYyxDQUFkLEdBQWtCLENBQUMsWUFBQSxHQUFlLGlCQUFoQixDQVJwQyxDQUFBO0FBQUEsZ0JBVUEsTUFBTSxDQUFDLG9CQUFQLENBQTRCLGdCQUE1QixFQUE4QyxlQUE5QyxDQVZBLENBQUE7QUFBQSw4QkFhQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxnQkFBRCxFQUFtQixLQUFNLENBQUEsQ0FBQSxDQUFHLENBQUEsQ0FBQSxDQUE1QixDQUEvQixFQWJBLENBREY7ZUFBQSxrQkEzQkY7YUFERjtBQUFBOzBCQURjO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBaEIsRUFUVTtJQUFBLENBL0laLENBQUE7O0FBQUEsd0JBcU1BLFlBQUEsR0FBYyxTQUFDLFFBQUQsRUFBVyxNQUFYLEdBQUE7QUFDWixVQUFBLGtJQUFBO0FBQUEsTUFBQSxJQUFVLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix3QkFBaEIsQ0FBVjtBQUFBLGNBQUEsQ0FBQTtPQUFBO0FBRUEsTUFBQSxJQUFVLENBQUEsSUFBSyxDQUFBLHVCQUFELENBQXlCLE1BQXpCLENBQUosSUFBd0MsTUFBQSxLQUFVLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUE1RDtBQUFBLGNBQUEsQ0FBQTtPQUZBO0FBSUEsTUFBQSx3QkFBRyxRQUFRLENBQUUsaUJBQVYsS0FBcUIsR0FBckIsSUFBNkIsQ0FBQSxRQUFTLENBQUMsT0FBMUM7QUFFRSxRQUFBLElBQVUsTUFBTSxDQUFDLHdCQUFQLENBQUEsQ0FBaUMsQ0FBQyxNQUFsQyxHQUEyQyxDQUFyRDtBQUFBLGdCQUFBLENBQUE7U0FBQTtBQUFBLFFBRUEsYUFBQSxtREFBc0MsQ0FBRSxtQkFBeEIsQ0FBNEMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBbEUsVUFGaEIsQ0FBQTtBQUdBLFFBQUEsSUFBYyxxQkFBZDtBQUFBLGdCQUFBLENBQUE7U0FIQTtBQUFBLFFBS0EsS0FBQSxHQUFRLGFBQWEsQ0FBQyxtQkFBZCxDQUFrQyxRQUFRLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxNQUF0QixHQUErQixDQUFqRSxDQUxSLENBQUE7QUFPQSxRQUFBLElBQU8sZUFBSixJQUFjLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBYixDQUFxQixhQUFyQixDQUFBLEtBQXVDLENBQUEsQ0FBckQsSUFBMkQsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFiLENBQXFCLG1DQUFyQixDQUFBLEtBQTZELENBQUEsQ0FBM0g7QUFDRSxnQkFBQSxDQURGO1NBUEE7QUFBQSxRQVVBLEtBQUEsR0FBUSxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQWQsQ0FBQSxDQVZSLENBQUE7QUFBQSxRQVdBLEdBQUEsR0FBTSxRQUFRLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQVg1QixDQUFBO0FBQUEsUUFZQSxJQUFBLEdBQU8sS0FBTSxDQUFBLEdBQUEsQ0FaYixDQUFBO0FBQUEsUUFhQSxJQUFBLEdBQU8sSUFBSSxDQUFDLE1BQUwsQ0FBWSxDQUFaLEVBQWUsUUFBUSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBckMsQ0FiUCxDQUFBO0FBZ0JBLFFBQUEsSUFBVSxJQUFJLENBQUMsTUFBTCxDQUFZLElBQUksQ0FBQyxNQUFMLEdBQWMsQ0FBMUIsRUFBNkIsQ0FBN0IsQ0FBQSxLQUFtQyxHQUE3QztBQUFBLGdCQUFBLENBQUE7U0FoQkE7QUFBQSxRQWtCQSxPQUFBLEdBQVUsSUFsQlYsQ0FBQTtBQW9CQSxlQUFNLGNBQUEsSUFBYyxpQkFBcEIsR0FBQTtBQUNFLFVBQUEsS0FBQSxHQUFRLElBQUksQ0FBQyxLQUFMLENBQVcseUJBQVgsQ0FBUixDQUFBO0FBQ0EsVUFBQSxJQUFHLGVBQUEsSUFBVSxLQUFLLENBQUMsTUFBTixHQUFlLENBQTVCO0FBQ0UsWUFBQSxPQUFBLEdBQVUsS0FBSyxDQUFDLEdBQU4sQ0FBQSxDQUFXLENBQUMsTUFBWixDQUFtQixDQUFuQixDQUFWLENBREY7V0FEQTtBQUFBLFVBR0EsR0FBQSxFQUhBLENBQUE7QUFBQSxVQUlBLElBQUEsR0FBTyxLQUFNLENBQUEsR0FBQSxDQUpiLENBREY7UUFBQSxDQXBCQTtBQTJCQSxRQUFBLElBQUcsZUFBSDtBQUNFLFVBQUEsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsSUFBQSxHQUFPLE9BQVAsR0FBaUIsR0FBbkMsRUFBd0M7QUFBQSxZQUFDLElBQUEsRUFBTSxNQUFQO1dBQXhDLENBQUEsQ0FBQTtpQkFDQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsUUFBUSxDQUFDLFFBQVEsQ0FBQyxHQUFqRCxFQUZGO1NBN0JGO09BQUEsTUFpQ0ssd0JBQUcsUUFBUSxDQUFFLGlCQUFWLEtBQXFCLEdBQXJCLHdCQUE2QixRQUFRLENBQUUsaUJBQVYsS0FBcUIsRUFBckQ7QUFFSCxRQUFBLEtBQUEsR0FBUSxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQWQsQ0FBQSxDQUFSLENBQUE7QUFBQSxRQUNBLEdBQUEsR0FBTSxRQUFRLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUQ1QixDQUFBO0FBQUEsUUFFQSxRQUFBLEdBQVcsS0FBTSxDQUFBLEdBQUEsQ0FGakIsQ0FBQTtBQUFBLFFBSUEsYUFBQSxtREFBc0MsQ0FBRSxtQkFBeEIsQ0FBNEMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBbEUsVUFKaEIsQ0FBQTtBQUtBLFFBQUEsSUFBYyxxQkFBZDtBQUFBLGdCQUFBLENBQUE7U0FMQTtBQUFBLFFBT0EsS0FBQSxHQUFRLGFBQWEsQ0FBQyxtQkFBZCxDQUFrQyxRQUFRLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxNQUF0QixHQUErQixDQUFqRSxDQVBSLENBQUE7QUFRQSxRQUFBLElBQU8sZUFBSixJQUFjLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBYixDQUFxQixhQUFyQixDQUFBLEtBQXVDLENBQUEsQ0FBeEQ7QUFDRSxnQkFBQSxDQURGO1NBUkE7QUFBQSxRQVVBLElBQUEsR0FBTyxRQUFRLENBQUMsTUFBVCxDQUFnQixDQUFoQixFQUFtQixRQUFRLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxNQUF6QyxDQVZQLENBQUE7QUFhQSxRQUFBLElBQVUsSUFBSSxDQUFDLE1BQUwsQ0FBWSxJQUFJLENBQUMsTUFBTCxHQUFjLENBQTFCLEVBQTZCLENBQTdCLENBQUEsS0FBbUMsR0FBN0M7QUFBQSxnQkFBQSxDQUFBO1NBYkE7QUFBQSxRQWVBLE9BQUEsR0FBVSxJQWZWLENBQUE7QUFpQkEsZUFBTSxjQUFBLElBQWMsaUJBQXBCLEdBQUE7QUFDRSxVQUFBLEtBQUEsR0FBUSxJQUFJLENBQUMsS0FBTCxDQUFXLHlCQUFYLENBQVIsQ0FBQTtBQUNBLFVBQUEsSUFBRyxlQUFBLElBQVUsS0FBSyxDQUFDLE1BQU4sR0FBZSxDQUE1QjtBQUNFLFlBQUEsT0FBQSxHQUFVLEtBQUssQ0FBQyxHQUFOLENBQUEsQ0FBVyxDQUFDLE1BQVosQ0FBbUIsQ0FBbkIsQ0FBVixDQURGO1dBREE7QUFBQSxVQUdBLEdBQUEsRUFIQSxDQUFBO0FBQUEsVUFJQSxJQUFBLEdBQU8sS0FBTSxDQUFBLEdBQUEsQ0FKYixDQURGO1FBQUEsQ0FqQkE7QUF3QkEsUUFBQSxJQUFHLGVBQUg7QUFDRSxVQUFBLElBQUEsR0FBTyxRQUFRLENBQUMsTUFBVCxDQUFnQixRQUFRLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxNQUF0QyxDQUFQLENBQUE7QUFDQSxVQUFBLElBQUcsSUFBSSxDQUFDLE9BQUwsQ0FBYSxJQUFBLEdBQU8sT0FBUCxHQUFpQixHQUE5QixDQUFBLEtBQXNDLENBQXpDO0FBRUUsWUFBQSxrQkFBQSxHQUFxQixDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQXZCLEVBQTRCLFFBQVEsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQWxELENBQXJCLENBQUE7bUJBQ0EsTUFBTSxDQUFDLG9CQUFQLENBQ0UsQ0FDRSxrQkFERixFQUVFLENBQUMsa0JBQW1CLENBQUEsQ0FBQSxDQUFwQixFQUF3QixrQkFBbUIsQ0FBQSxDQUFBLENBQW5CLEdBQXdCLE9BQU8sQ0FBQyxNQUFoQyxHQUF5QyxDQUFqRSxDQUZGLENBREYsRUFLRSxFQUxGLEVBS007QUFBQSxjQUFDLElBQUEsRUFBTSxNQUFQO2FBTE4sRUFIRjtXQUZGO1NBMUJHO09BQUEsTUFzQ0Esd0JBQUcsUUFBUSxDQUFFLGlCQUFWLEtBQXFCLElBQXhCO0FBQ0gsUUFBQSxLQUFBLEdBQVEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFkLENBQUEsQ0FBUixDQUFBO0FBQUEsUUFDQSxHQUFBLEdBQU0sUUFBUSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FENUIsQ0FBQTtBQUFBLFFBRUEsUUFBQSxHQUFXLEtBQU0sQ0FBQSxHQUFBLEdBQU0sQ0FBTixDQUZqQixDQUFBO0FBQUEsUUFHQSxRQUFBLEdBQVcsS0FBTSxDQUFBLEdBQUEsQ0FIakIsQ0FBQTtBQUtBLFFBQUEsSUFBRyxJQUFJLENBQUMsSUFBTCxDQUFVLFFBQVYsQ0FBQSxJQUF3QixRQUFRLENBQUMsTUFBVCxDQUFnQix5QkFBaEIsQ0FBQSxLQUE4QyxDQUF6RTtBQUNFLGlCQUFNLGdCQUFOLEdBQUE7QUFDRSxZQUFBLEtBQUEsR0FBUSxRQUFRLENBQUMsS0FBVCxDQUFlLHlCQUFmLENBQVIsQ0FBQTtBQUNBLFlBQUEsSUFBRyxlQUFBLElBQVUsS0FBSyxDQUFDLE1BQU4sR0FBZSxDQUE1QjtBQUNFLG9CQURGO2FBREE7QUFBQSxZQUdBLEdBQUEsRUFIQSxDQUFBO0FBQUEsWUFJQSxRQUFBLEdBQVcsS0FBTSxDQUFBLEdBQUEsQ0FKakIsQ0FERjtVQUFBLENBQUE7QUFBQSxVQU9BLGNBQUEsR0FBaUIsUUFBUSxDQUFDLEtBQVQsQ0FBZSxNQUFmLENBUGpCLENBQUE7QUFBQSxVQVFBLGNBQUEsR0FBb0Isc0JBQUgsR0FBd0IsY0FBZSxDQUFBLENBQUEsQ0FBdkMsR0FBK0MsRUFSaEUsQ0FBQTtBQUFBLFVBU0EsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsSUFBQSxHQUFPLGNBQXpCLENBVEEsQ0FBQTtpQkFVQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsUUFBUSxDQUFDLFFBQVEsQ0FBQyxHQUFqRCxFQVhGO1NBTkc7T0E1RU87SUFBQSxDQXJNZCxDQUFBOztBQUFBLHdCQW9TQSxhQUFBLEdBQWUsU0FBQyxNQUFELEdBQUE7QUFDYixVQUFBLHFCQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsbUJBQUQsQ0FBcUIsTUFBckIsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsY0FBRCxDQUFnQixNQUFoQixDQURBLENBQUE7QUFBQSxNQUVBLHFCQUFBLEdBQXdCLE1BQU0sQ0FBQyxNQUFNLENBQUMsV0FBZCxDQUEwQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxDQUFELEdBQUE7aUJBQzlCLEtBQUMsQ0FBQSxZQUFELENBQWMsQ0FBZCxFQUFpQixNQUFqQixFQUQ4QjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTFCLENBRnhCLENBQUE7QUFBQSxNQUtBLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixNQUFNLENBQUMsWUFBUCxDQUFvQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUFHLHFCQUFxQixDQUFDLE9BQXRCLENBQUEsRUFBSDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXBCLENBQWpCLENBTEEsQ0FBQTthQU9BLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixxQkFBakIsRUFSYTtJQUFBLENBcFNmLENBQUE7O0FBQUEsd0JBOFNBLFVBQUEsR0FBWSxTQUFBLEdBQUE7YUFDVixJQUFDLENBQUEsV0FBVyxDQUFDLE9BQWIsQ0FBQSxFQURVO0lBQUEsQ0E5U1osQ0FBQTs7QUFBQSx3QkFnVEEsUUFBQSxHQUFVLFNBQUEsR0FBQTtBQUVSLFVBQUEsMEZBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxXQUFELEdBQW1CLElBQUEsbUJBQUEsQ0FBQSxDQUFuQixDQUFBO0FBQUEsTUFJQSx3QkFBQSxHQUEyQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0IsOEJBQXBCLEVBQW9ELFNBQUMsUUFBRCxHQUFBO2VBQzdFLGlCQUFBLEdBQW9CLEtBRHlEO01BQUEsQ0FBcEQsQ0FKM0IsQ0FBQTtBQUFBLE1BT0Esa0JBQUEsR0FBcUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQyxvQkFBcEMsRUFBMEQsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFBRyxLQUFDLENBQUEsVUFBRCxDQUFBLEVBQUg7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUExRCxDQVByQixDQUFBO0FBQUEsTUFRQSxtQkFBQSxHQUFzQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DLG1CQUFwQyxFQUF5RCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUFHLEtBQUMsQ0FBQSxXQUFELENBQUEsRUFBSDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXpELENBUnRCLENBQUE7QUFBQSxNQVNBLHVCQUFBLEdBQTBCLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWYsQ0FBa0MsSUFBQyxDQUFBLGFBQWEsQ0FBQyxJQUFmLENBQW9CLElBQXBCLENBQWxDLENBVDFCLENBQUE7QUFBQSxNQVdBLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQix3QkFBakIsQ0FYQSxDQUFBO0FBQUEsTUFZQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsa0JBQWpCLENBWkEsQ0FBQTtBQUFBLE1BYUEsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLG1CQUFqQixDQWJBLENBQUE7YUFjQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsdUJBQWpCLEVBaEJRO0lBQUEsQ0FoVFYsQ0FBQTs7cUJBQUE7O01BZEYsQ0FBQTs7QUFBQSxFQWlWQSxNQUFNLENBQUMsT0FBUCxHQUFpQixTQWpWakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/Marvin/.atom/packages/react/lib/atom-react.coffee
