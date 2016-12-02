(function() {
  var CodeManager, escapeStringRegexp, _;

  escapeStringRegexp = require('escape-string-regexp');

  _ = require('lodash');

  module.exports = CodeManager = (function() {
    function CodeManager() {
      this.editor = atom.workspace.getActiveTextEditor();
    }

    CodeManager.prototype.findCodeBlock = function() {
      var cursor, endRow, foldRange, foldable, indentLevel, row, selectedRange, selectedText;
      selectedText = this.getSelectedText();
      if (selectedText) {
        selectedRange = this.editor.getSelectedBufferRange();
        endRow = selectedRange.end.row;
        if (selectedRange.end.column === 0) {
          endRow = endRow - 1;
        }
        endRow = this.escapeBlankRows(selectedRange.start.row, endRow);
        return [selectedText, endRow];
      }
      cursor = this.editor.getLastCursor();
      row = cursor.getBufferRow();
      console.log('findCodeBlock:', row);
      indentLevel = cursor.getIndentLevel();
      foldable = this.editor.isFoldableAtBufferRow(row);
      foldRange = this.editor.languageMode.rowRangeForCodeFoldAtBufferRow(row);
      if ((foldRange == null) || (foldRange[0] == null) || (foldRange[1] == null)) {
        foldable = false;
      }
      if (foldable) {
        return this.getFoldContents(row);
      } else if (this.isBlank(row)) {
        return this.findPrecedingBlock(row, indentLevel);
      } else if (this.getRow(row).trim() === 'end') {
        return this.findPrecedingBlock(row, indentLevel);
      } else {
        return [this.getRow(row), row];
      }
    };

    CodeManager.prototype.findPrecedingBlock = function(row, indentLevel) {
      var blank, isEnd, previousIndentLevel, previousRow, sameIndent;
      previousRow = row - 1;
      while (previousRow >= 0) {
        previousIndentLevel = this.editor.indentationForBufferRow(previousRow);
        sameIndent = previousIndentLevel <= indentLevel;
        blank = this.isBlank(previousRow);
        isEnd = this.getRow(previousRow).trim() === 'end';
        if (this.isBlank(row)) {
          row = previousRow;
        }
        if (sameIndent && !blank && !isEnd) {
          return [this.getRows(previousRow, row), row];
        }
        previousRow--;
      }
      return null;
    };

    CodeManager.prototype.getRow = function(row) {
      return this.normalizeString(this.editor.lineTextForBufferRow(row));
    };

    CodeManager.prototype.getTextInRange = function(start, end) {
      var code;
      code = this.editor.getTextInBufferRange([start, end]);
      return this.normalizeString(code);
    };

    CodeManager.prototype.getRows = function(startRow, endRow) {
      var code;
      code = this.editor.getTextInBufferRange({
        start: {
          row: startRow,
          column: 0
        },
        end: {
          row: endRow,
          column: 9999999
        }
      });
      return this.normalizeString(code);
    };

    CodeManager.prototype.getSelectedText = function() {
      return this.normalizeString(this.editor.getSelectedText());
    };

    CodeManager.prototype.normalizeString = function(code) {
      if (code != null) {
        return code.replace(/\r\n|\r/g, '\n');
      }
    };

    CodeManager.prototype.getFoldRange = function(row) {
      var range, _ref;
      range = this.editor.languageMode.rowRangeForCodeFoldAtBufferRow(row);
      if (((_ref = this.getRow(range[1] + 1)) != null ? _ref.trim() : void 0) === 'end') {
        range[1] = range[1] + 1;
      }
      console.log('getFoldRange:', range);
      return range;
    };

    CodeManager.prototype.getFoldContents = function(row) {
      var range;
      range = this.getFoldRange(row);
      return [this.getRows(range[0], range[1]), range[1]];
    };

    CodeManager.prototype.getCodeToInspect = function() {
      var code, cursor, cursor_pos, identifier_end, row, selectedText;
      selectedText = this.getSelectedText();
      if (selectedText) {
        code = selectedText;
        cursor_pos = code.length;
      } else {
        cursor = this.editor.getLastCursor();
        row = cursor.getBufferRow();
        code = this.getRow(row);
        cursor_pos = cursor.getBufferColumn();
        identifier_end = code.slice(cursor_pos).search(/\W/);
        if (identifier_end !== -1) {
          cursor_pos += identifier_end;
        }
      }
      return [code, cursor_pos];
    };

    CodeManager.prototype.getCurrentCell = function() {
      var buffer, cursor, end, regex, regexString, start;
      buffer = this.editor.getBuffer();
      start = buffer.getFirstPosition();
      end = buffer.getEndPosition();
      regexString = this.getRegexString(this.editor);
      if (regexString == null) {
        return [start, end];
      }
      regex = new RegExp(regexString);
      cursor = this.editor.getCursorBufferPosition();
      while (cursor.row < end.row && this.isComment(cursor)) {
        cursor.row += 1;
        cursor.column = 0;
      }
      if (cursor.row > 0) {
        buffer.backwardsScanInRange(regex, [start, cursor], function(_arg) {
          var range;
          range = _arg.range;
          return start = range.start;
        });
      }
      buffer.scanInRange(regex, [cursor, end], function(_arg) {
        var range;
        range = _arg.range;
        return end = range.start;
      });
      console.log('CellManager: Cell [start, end]:', [start, end], 'cursor:', cursor);
      return [start, end];
    };

    CodeManager.prototype.getBreakpoints = function() {
      var breakpoints, buffer, regex, regexString;
      buffer = this.editor.getBuffer();
      breakpoints = [buffer.getFirstPosition()];
      regexString = this.getRegexString(this.editor);
      if (regexString != null) {
        regex = new RegExp(regexString, 'g');
        buffer.scan(regex, function(_arg) {
          var range;
          range = _arg.range;
          return breakpoints.push(range.start);
        });
      }
      breakpoints.push(buffer.getEndPosition());
      console.log('CellManager: Breakpoints:', breakpoints);
      return breakpoints;
    };

    CodeManager.prototype.getRegexString = function() {
      var commentEndString, commentStartString, escapedCommentStartString, regexString, scope, _ref;
      scope = this.editor.getRootScopeDescriptor();
      _ref = this.getCommentStrings(scope), commentStartString = _ref.commentStartString, commentEndString = _ref.commentEndString;
      if (!commentStartString) {
        console.log('CellManager: No comment string defined in root scope');
        return;
      }
      escapedCommentStartString = escapeStringRegexp(commentStartString.trimRight());
      regexString = escapedCommentStartString + '(%%| %%| <codecell>| In\[[0-9 ]*\]:?)';
      return regexString;
    };

    CodeManager.prototype.getCommentStrings = function(scope) {
      if (parseFloat(atom.getVersion()) <= 1.1) {
        return this.editor.languageMode.commentStartAndEndStringsForScope(scope);
      } else {
        return this.editor.getCommentStrings(scope);
      }
    };

    CodeManager.prototype.isComment = function(position) {
      var scope, scopeString;
      scope = this.editor.scopeDescriptorForBufferPosition(position);
      scopeString = scope.getScopeChain();
      return _.includes(scopeString, 'comment.line');
    };

    CodeManager.prototype.isBlank = function(row) {
      return this.editor.getBuffer().isRowBlank(row) || this.editor.languageMode.isLineCommentedAtBufferRow(row);
    };

    CodeManager.prototype.escapeBlankRows = function(startRow, endRow) {
      var i, _i, _ref;
      if (endRow > startRow) {
        for (i = _i = startRow, _ref = endRow - 1; startRow <= _ref ? _i <= _ref : _i >= _ref; i = startRow <= _ref ? ++_i : --_i) {
          if (this.isBlank(endRow)) {
            endRow -= 1;
          }
        }
      }
      return endRow;
    };

    CodeManager.prototype.moveDown = function(row) {
      var lastRow;
      lastRow = this.editor.getLastBufferRow();
      if (row >= lastRow) {
        this.editor.moveToBottom();
        this.editor.insertNewline();
        return;
      }
      while (row < lastRow) {
        row++;
        if (!this.isBlank(row)) {
          break;
        }
      }
      return this.editor.setCursorBufferPosition({
        row: row,
        column: 0
      });
    };

    return CodeManager;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL01hcnZpbi8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvY29kZS1tYW5hZ2VyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxrQ0FBQTs7QUFBQSxFQUFBLGtCQUFBLEdBQXFCLE9BQUEsQ0FBUSxzQkFBUixDQUFyQixDQUFBOztBQUFBLEVBQ0EsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSLENBREosQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDVyxJQUFBLHFCQUFBLEdBQUE7QUFDVCxNQUFBLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQVYsQ0FEUztJQUFBLENBQWI7O0FBQUEsMEJBSUEsYUFBQSxHQUFlLFNBQUEsR0FBQTtBQUNYLFVBQUEsa0ZBQUE7QUFBQSxNQUFBLFlBQUEsR0FBZSxJQUFDLENBQUEsZUFBRCxDQUFBLENBQWYsQ0FBQTtBQUVBLE1BQUEsSUFBRyxZQUFIO0FBQ0ksUUFBQSxhQUFBLEdBQWdCLElBQUMsQ0FBQSxNQUFNLENBQUMsc0JBQVIsQ0FBQSxDQUFoQixDQUFBO0FBQUEsUUFDQSxNQUFBLEdBQVMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxHQUQzQixDQUFBO0FBRUEsUUFBQSxJQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsTUFBbEIsS0FBNEIsQ0FBL0I7QUFDSSxVQUFBLE1BQUEsR0FBUyxNQUFBLEdBQVMsQ0FBbEIsQ0FESjtTQUZBO0FBQUEsUUFJQSxNQUFBLEdBQVMsSUFBQyxDQUFBLGVBQUQsQ0FBaUIsYUFBYSxDQUFDLEtBQUssQ0FBQyxHQUFyQyxFQUEwQyxNQUExQyxDQUpULENBQUE7QUFLQSxlQUFPLENBQUMsWUFBRCxFQUFlLE1BQWYsQ0FBUCxDQU5KO09BRkE7QUFBQSxNQVVBLE1BQUEs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

//# sourceURL=/Users/Marvin/.atom/packages/Hydrogen/lib/code-manager.coffee
