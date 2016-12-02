(function() {
  var extractRange,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  extractRange = function(_arg) {
    var code, colNumber, foundDecorator, lineNumber, message, offset, screenLine, symbol, textEditor, token, tokenizedLine, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _m, _ref, _ref1, _ref2, _ref3, _ref4;
    code = _arg.code, message = _arg.message, lineNumber = _arg.lineNumber, colNumber = _arg.colNumber, textEditor = _arg.textEditor;
    switch (code) {
      case 'C901':
        symbol = /'(?:[^.]+\.)?([^']+)'/.exec(message)[1];
        while (true) {
          offset = 0;
          tokenizedLine = textEditor.tokenizedLineForScreenRow(lineNumber);
          if (tokenizedLine === void 0) {
            break;
          }
          foundDecorator = false;
          _ref = tokenizedLine.tokens;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            token = _ref[_i];
            if (__indexOf.call(token.scopes, 'meta.function.python') >= 0) {
              if (token.value === symbol) {
                return [[lineNumber, offset], [lineNumber, offset + token.bufferDelta]];
              }
            }
            if (__indexOf.call(token.scopes, 'meta.function.decorator.python') >= 0) {
              foundDecorator = true;
            }
            offset += token.bufferDelta;
          }
          if (!foundDecorator) {
            break;
          }
          lineNumber += 1;
        }
        break;
      case 'E125':
      case 'E127':
      case 'E128':
      case 'E131':
        tokenizedLine = textEditor.tokenizedLineForScreenRow(lineNumber);
        if (tokenizedLine === void 0) {
          break;
        }
        offset = 0;
        _ref1 = tokenizedLine.tokens;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          token = _ref1[_j];
          if (!token.firstNonWhitespaceIndex) {
            return [[lineNumber, 0], [lineNumber, offset]];
          }
          if (token.firstNonWhitespaceIndex !== token.bufferDelta) {
            return [[lineNumber, 0], [lineNumber, offset + token.firstNonWhitespaceIndex]];
          }
          offset += token.bufferDelta;
        }
        break;
      case 'E262':
      case 'E265':
        return [[lineNumber, colNumber - 1], [lineNumber, colNumber + 1]];
      case 'F401':
        symbol = /'([^']+)'/.exec(message)[1];
        while (true) {
          offset = 0;
          tokenizedLine = textEditor.tokenizedLineForScreenRow(lineNumber);
          if (tokenizedLine === void 0) {
            break;
          }
          _ref2 = tokenizedLine.tokens;
          for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
            token = _ref2[_k];
            if (token.value === symbol) {
              return [[lineNumber, offset], [lineNumber, offset + token.bufferDelta]];
            }
            offset += token.bufferDelta;
          }
          lineNumber += 1;
        }
        break;
      case 'F821':
      case 'F841':
        symbol = /'([^']+)'/.exec(message)[1];
        tokenizedLine = textEditor.tokenizedLineForScreenRow(lineNumber);
        if (tokenizedLine === void 0) {
          break;
        }
        offset = 0;
        _ref3 = tokenizedLine.tokens;
        for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
          token = _ref3[_l];
          if (token.value === symbol) {
            return [[lineNumber, offset], [lineNumber, offset + token.bufferDelta]];
          }
          offset += token.bufferDelta;
        }
        break;
      case 'H101':
        return [[lineNumber, colNumber - 1], [lineNumber, colNumber + 3]];
      case 'H201':
        return [[lineNumber, colNumber - 7], [lineNumber, colNumber]];
      case 'H231':
        return [[lineNumber, colNumber - 1], [lineNumber, colNumber + 5]];
      case 'H233':
        return [[lineNumber, colNumber - 1], [lineNumber, colNumber + 4]];
      case 'H236':
        return [[lineNumber, colNumber - 1], [lineNumber, colNumber + 12]];
      case 'H238':
        return [[lineNumber, colNumber - 1], [lineNumber, colNumber + 4]];
      case 'H501':
        tokenizedLine = textEditor.tokenizedLineForScreenRow(lineNumber);
        if (tokenizedLine === void 0) {
          break;
        }
        offset = 0;
        _ref4 = tokenizedLine.tokens;
        for (_m = 0, _len4 = _ref4.length; _m < _len4; _m++) {
          token = _ref4[_m];
          if (__indexOf.call(token.scopes, 'meta.function-call.python') >= 0) {
            if (token.value === 'locals') {
              return [[lineNumber, offset], [lineNumber, offset + token.bufferDelta]];
            }
          }
          offset += token.bufferDelta;
        }
        break;
      case 'W291':
        screenLine = textEditor.lineTextForScreenRow(lineNumber);
        return [[lineNumber, colNumber - 1], [lineNumber, screenLine.length]];
    }
    return [[lineNumber, colNumber - 1], [lineNumber, colNumber]];
  };

  module.exports = {
    config: {
      executablePath: {
        type: 'string',
        "default": 'flake8',
        description: 'Full path to binary (e.g. /usr/local/bin/flake8)'
      },
      projectConfigFile: {
        type: 'string',
        "default": '',
        description: 'flake config file relative path from project (e.g. tox.ini or .flake8rc)'
      },
      maxLineLength: {
        type: 'integer',
        "default": 0
      },
      ignoreErrorCodes: {
        type: 'array',
        "default": [],
        items: {
          type: 'string'
        }
      },
      maxComplexity: {
        type: 'integer',
        "default": 10
      },
      hangClosing: {
        type: 'boolean',
        "default": false
      },
      selectErrors: {
        description: 'input "E, W" to include all errors/warnings',
        type: 'array',
        "default": [],
        items: {
          type: 'string'
        }
      }
    },
    activate: function() {
      return require('atom-package-deps').install('linter-flake8');
    },
    provideLinter: function() {
      var helpers, path, provider;
      helpers = require('atom-linter');
      path = require('path');
      return provider = {
        name: 'Flake8',
        grammarScopes: ['source.python', 'source.python.django'],
        scope: 'file',
        lintOnFly: true,
        lint: function(textEditor) {
          var cwd, execPath, filePath, fileText, ignoreErrorCodes, maxComplexity, maxLineLength, parameters, projectConfigFile, selectErrors;
          filePath = textEditor.getPath();
          fileText = textEditor.getText();
          parameters = [];
          if (maxLineLength = atom.config.get('linter-flake8.maxLineLength')) {
            parameters.push('--max-line-length', maxLineLength);
          }
          if ((ignoreErrorCodes = atom.config.get('linter-flake8.ignoreErrorCodes')).length) {
            parameters.push('--ignore', ignoreErrorCodes.join(','));
          }
          if (maxComplexity = atom.config.get('linter-flake8.maxComplexity')) {
            parameters.push('--max-complexity', maxComplexity);
          }
          if (atom.config.get('linter-flake8.hangClosing')) {
            parameters.push('--hang-closing');
          }
          if ((selectErrors = atom.config.get('linter-flake8.selectErrors')).length) {
            parameters.push('--select', selectErrors.join(','));
          }
          if ((projectConfigFile = atom.config.get('linter-flake8.projectConfigFile'))) {
            parameters.push('--config', path.join(atom.project.getPaths()[0], projectConfigFile));
          }
          parameters.push('-');
          execPath = atom.config.get('linter-flake8.executablePath');
          cwd = path.dirname(textEditor.getPath());
          return helpers.exec(execPath, parameters, {
            stdin: fileText,
            cwd: cwd
          }).then(function(result) {
            var col, line, match, regex, toReturn;
            toReturn = [];
            regex = /(\d+):(\d+):\s(([A-Z])\d{2,3})\s+(.*)/g;
            while ((match = regex.exec(result)) !== null) {
              line = parseInt(match[1]) || 0;
              col = parseInt(match[2]) || 0;
              toReturn.push({
                type: match[4] === 'E' ? 'Error' : 'Warning',
                text: match[3] + ' — ' + match[5],
                filePath: filePath,
                range: extractRange({
                  code: match[3],
                  message: match[5],
                  lineNumber: line - 1,
                  colNumber: col,
                  textEditor: textEditor
                })
              });
            }
            return toReturn;
          });
        }
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL01hcnZpbi8uYXRvbS9wYWNrYWdlcy9saW50ZXItZmxha2U4L2xpYi9tYWluLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxZQUFBO0lBQUEscUpBQUE7O0FBQUEsRUFBQSxZQUFBLEdBQWUsU0FBQyxJQUFELEdBQUE7QUFDYixRQUFBLDBNQUFBO0FBQUEsSUFEZSxZQUFBLE1BQU0sZUFBQSxTQUFTLGtCQUFBLFlBQVksaUJBQUEsV0FBVyxrQkFBQSxVQUNyRCxDQUFBO0FBQUEsWUFBTyxJQUFQO0FBQUEsV0FDTyxNQURQO0FBSUksUUFBQSxNQUFBLEdBQVMsdUJBQXVCLENBQUMsSUFBeEIsQ0FBNkIsT0FBN0IsQ0FBc0MsQ0FBQSxDQUFBLENBQS9DLENBQUE7QUFDQSxlQUFNLElBQU4sR0FBQTtBQUNFLFVBQUEsTUFBQSxHQUFTLENBQVQsQ0FBQTtBQUFBLFVBQ0EsYUFBQSxHQUFnQixVQUFVLENBQUMseUJBQVgsQ0FBcUMsVUFBckMsQ0FEaEIsQ0FBQTtBQUVBLFVBQUEsSUFBRyxhQUFBLEtBQWlCLE1BQXBCO0FBQ0Usa0JBREY7V0FGQTtBQUFBLFVBSUEsY0FBQSxHQUFpQixLQUpqQixDQUFBO0FBS0E7QUFBQSxlQUFBLDJDQUFBOzZCQUFBO0FBQ0UsWUFBQSxJQUFHLGVBQTBCLEtBQUssQ0FBQyxNQUFoQyxFQUFBLHNCQUFBLE1BQUg7QUFDRSxjQUFBLElBQUcsS0FBSyxDQUFDLEtBQU4sS0FBZSxNQUFsQjtBQUNFLHVCQUFPLENBQUMsQ0FBQyxVQUFELEVBQWEsTUFBYixDQUFELEVBQXVCLENBQUMsVUFBRCxFQUFhLE1BQUEsR0FBUyxLQUFLLENBQUMsV0FBNUIsQ0FBdkIsQ0FBUCxDQURGO2VBREY7YUFBQTtBQUdBLFlBQUEsSUFBRyxlQUFvQyxLQUFLLENBQUMsTUFBMUMsRUFBQSxnQ0FBQSxNQUFIO0FBQ0UsY0FBQSxjQUFBLEdBQWlCLElBQWpCLENBREY7YUFIQTtBQUFBLFlBS0EsTUFBQSxJQUFVLEtBQUssQ0FBQyxXQUxoQixDQURGO0FBQUEsV0FMQTtBQVlBLFVBQUEsSUFBRyxDQUFBLGNBQUg7QUFDRSxrQkFERjtXQVpBO0FBQUEsVUFjQSxVQUFBLElBQWMsQ0FkZCxDQURGO1FBQUEsQ0FMSjtBQUNPO0FBRFAsV0FxQk8sTUFyQlA7QUFBQSxXQXFCZSxNQXJCZjtBQUFBLFdBcUJ1QixNQXJCdkI7QUFBQSxXQXFCK0IsTUFyQi9CO0FBMEJJLFFBQUEsYUFBQSxHQUFnQixVQUFVLENBQUMseUJBQVgsQ0FBcUMsVUFBckMsQ0FBaEIsQ0FBQTtBQUNBLFFBQUEsSUFBRyxhQUFBLEtBQWlCLE1BQXBCO0FBQ0UsZ0JBREY7U0FEQTtBQUFBLFFBR0EsTUFBQSxHQUFTLENBSFQsQ0FBQTtBQUlBO0FBQUEsYUFBQSw4Q0FBQTs0QkFBQTtBQUNFLFVBQUEsSUFBRyxDQUFBLEtBQVMsQ0FBQyx1QkFBYjtBQUNFLG1CQUFPLENBQUMsQ0FBQyxVQUFELEVBQWEsQ0FBYixDQUFELEVBQWtCLENBQUMsVUFBRCxFQUFhLE1BQWIsQ0FBbEIsQ0FBUCxDQURGO1dBQUE7QUFFQSxVQUFBLElBQUcsS0FBSyxDQUFDLHVCQUFOLEtBQW1DLEtBQUssQ0FBQyxXQUE1QztBQUNFLG1CQUFPLENBQUMsQ0FBQyxVQUFELEVBQWEsQ0FBYixDQUFELEVBQWtCLENBQUMsVUFBRCxFQUFhLE1BQUEsR0FBUyxLQUFLLENBQUMsdUJBQTVCLENBQWxCLENBQVAsQ0FERjtXQUZBO0FBQUEsVUFJQSxNQUFBLElBQVUsS0FBSyxDQUFDLFdBSmhCLENBREY7QUFBQSxTQTlCSjtBQXFCK0I7QUFyQi9CLFdBb0NPLE1BcENQO0FBQUEsV0FvQ2UsTUFwQ2Y7QUF1Q0ksZUFBTyxDQUFDLENBQUMsVUFBRCxFQUFhLFNBQUEsR0FBWSxDQUF6QixDQUFELEVBQThCLENBQUMsVUFBRCxFQUFhLFNBQUEsR0FBWSxDQUF6QixDQUE5QixDQUFQLENBdkNKO0FBQUEsV0F3Q08sTUF4Q1A7QUEwQ0ksUUFBQSxNQUFBLEdBQVMsV0FBVyxDQUFDLElBQVosQ0FBaUIsT0FBakIsQ0FBMEIsQ0FBQSxDQUFBLENBQW5DLENBQUE7QUFDQSxlQUFNLElBQU4sR0FBQTtBQUNFLFVBQUEsTUFBQSxHQUFTLENBQVQsQ0FBQTtBQUFBLFVBQ0EsYUFBQSxHQUFnQixVQUFVLENBQUMseUJBQVgsQ0FBcUMsVUFBckMsQ0FEaEIsQ0FBQTtBQUVBLFVBQUEsSUFBRyxhQUFBLEtBQWlCLE1BQXBCO0FBQ0Usa0JBREY7V0FGQTtBQUlBO0FBQUEsZUFBQSw4Q0FBQTs4QkFBQTtBQUNFLFlBQUEsSUFBRyxLQUFLLENBQUMsS0FBTixLQUFlLE1BQWxCO0FBQ0UscUJBQU8sQ0FBQyxDQUFDLFVBQUQsRUFBYSxNQUFiLENBQUQsRUFBdUIsQ0FBQyxVQUFELEVBQWEsTUFBQSxHQUFTLEtBQUssQ0FBQyxXQUE1QixDQUF2QixDQUFQLENBREY7YUFBQTtBQUFBLFlBRUEsTUFBQSxJQUFVLEtBQUssQ0FBQyxXQUZoQixDQURGO0FBQUEsV0FKQTtBQUFBLFVBUUEsVUFBQSxJQUFjLENBUmQsQ0FERjtRQUFBLENBM0NKO0FBd0NPO0FBeENQLFdBcURPLE1BckRQO0FBQUEsV0FxRGUsTUFyRGY7QUF3REksUUFBQSxNQUFBLEdBQVMsV0FBVyxDQUFDLElBQVosQ0FBaUIsT0FBakIsQ0FBMEIsQ0FBQSxDQUFBLENBQW5DLENBQUE7QUFBQSxRQUNBLGFBQUEsR0FBZ0IsVUFBVSxDQUFDLHlCQUFYLENBQXFDLFVBQXJDLENBRGhCLENBQUE7QUFFQSxRQUFBLElBQUcsYUFBQSxLQUFpQixNQUFwQjtBQUNFLGdCQURGO1NBRkE7QUFBQSxRQUlBLE1BQUEsR0FBUyxDQUpULENBQUE7QUFLQTtBQUFBLGFBQUEsOENBQUE7NEJBQUE7QUFDRSxVQUFBLElBQUcsS0FBSyxDQUFDLEtBQU4sS0FBZSxNQUFsQjtBQUNFLG1CQUFPLENBQUMsQ0FBQyxVQUFELEVBQWEsTUFBYixDQUFELEVBQXVCLENBQUMsVUFBRCxFQUFhLE1BQUEsR0FBUyxLQUFLLENBQUMsV0FBNUIsQ0FBdkIsQ0FBUCxDQURGO1dBQUE7QUFBQSxVQUVBLE1BQUEsSUFBVSxLQUFLLENBQUMsV0FGaEIsQ0FERjtBQUFBLFNBN0RKO0FBcURlO0FBckRmLFdBaUVPLE1BakVQO0FBbUVJLGVBQU8sQ0FBQyxDQUFDLFVBQUQsRUFBYSxTQUFBLEdBQVksQ0FBekIsQ0FBRCxFQUE4QixDQUFDLFVBQUQsRUFBYSxTQUFBLEdBQVksQ0FBekIsQ0FBOUIsQ0FBUCxDQW5FSjtBQUFBLFdBb0VPLE1BcEVQO0FBc0VJLGVBQU8sQ0FBQyxDQUFDLFVBQUQsRUFBYSxTQUFBLEdBQVksQ0FBekIsQ0FBRCxFQUE4QixDQUFDLFVBQUQsRUFBYSxTQUFiLENBQTlCLENBQVAsQ0F0RUo7QUFBQSxXQXVFTyxNQXZFUDtBQXlFSSxlQUFPLENBQUMsQ0FBQyxVQUFELEVBQWEsU0FBQSxHQUFZLENBQXpCLENBQUQsRUFBOEIsQ0FBQyxVQUFELEVBQWEsU0FBQSxHQUFZLENBQXpCLENBQTlCLENBQVAsQ0F6RUo7QUFBQSxXQTBFTyxNQTFFUDtBQTRFSSxlQUFPLENBQUMsQ0FBQyxVQUFELEVBQWEsU0FBQSxHQUFZLENBQXpCLENBQUQsRUFBOEIsQ0FBQyxVQUFELEVBQWEsU0FBQSxHQUFZLENBQXpCLENBQTlCLENBQVAsQ0E1RUo7QUFBQSxXQTZFTyxNQTdFUDtBQStFSSxlQUFPLENBQUMsQ0FBQyxVQUFELEVBQWEsU0FBQSxHQUFZLENBQXpCLENBQUQsRUFBOEIsQ0FBQyxVQUFELEVBQWEsU0FBQSxHQUFZLEVBQXpCLENBQTlCLENBQVAsQ0EvRUo7QUFBQSxXQWdGTyxNQWhGUDtBQWtGSSxlQUFPLENBQUMsQ0FBQyxVQUFELEVBQWEsU0FBQSxHQUFZLENBQXpCLENBQUQsRUFBOEIsQ0FBQyxVQUFELEVBQWEsU0FBQSxHQUFZLENBQXpCLENBQTlCLENBQVAsQ0FsRko7QUFBQSxXQW1GTyxNQW5GUDtBQXFGSSxRQUFBLGFBQUEsR0FBZ0IsVUFBVSxDQUFDLHlCQUFYLENBQXFDLFVBQXJDLENBQWhCLENBQUE7QUFDQSxRQUFBLElBQUcsYUFBQSxLQUFpQixNQUFwQjtBQUNFLGdCQURGO1NBREE7QUFBQSxRQUdBLE1BQUEsR0FBUyxDQUhULENBQUE7QUFJQTtBQUFBLGFBQUEsOENBQUE7NEJBQUE7QUFDRSxVQUFBLElBQUcsZUFBK0IsS0FBSyxDQUFDLE1BQXJDLEVBQUEsMkJBQUEsTUFBSDtBQUNFLFlBQUEsSUFBRyxLQUFLLENBQUMsS0FBTixLQUFlLFFBQWxCO0FBQ0UscUJBQU8sQ0FBQyxDQUFDLFVBQUQsRUFBYSxNQUFiLENBQUQsRUFBdUIsQ0FBQyxVQUFELEVBQWEsTUFBQSxHQUFTLEtBQUssQ0FBQyxXQUE1QixDQUF2QixDQUFQLENBREY7YUFERjtXQUFBO0FBQUEsVUFHQSxNQUFBLElBQVUsS0FBSyxDQUFDLFdBSGhCLENBREY7QUFBQSxTQXpGSjtBQW1GTztBQW5GUCxXQThGTyxNQTlGUDtBQWdHSSxRQUFBLFVBQUEsR0FBYSxVQUFVLENBQUMsb0JBQVgsQ0FBZ0MsVUFBaEMsQ0FBYixDQUFBO0FBQ0EsZUFBTyxDQUFDLENBQUMsVUFBRCxFQUFhLFNBQUEsR0FBWSxDQUF6QixDQUFELEVBQThCLENBQUMsVUFBRCxFQUFhLFVBQVUsQ0FBQyxNQUF4QixDQUE5QixDQUFQLENBakdKO0FBQUEsS0FBQTtBQWtHQSxXQUFPLENBQUMsQ0FBQyxVQUFELEVBQWEsU0FBQSxHQUFZLENBQXpCLENBQUQsRUFBOEIsQ0FBQyxVQUFELEVBQWEsU0FBYixDQUE5QixDQUFQLENBbkdhO0VBQUEsQ0FBZixDQUFBOztBQUFBLEVBcUdBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLE1BQUEsRUFDRTtBQUFBLE1BQUEsY0FBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLFFBRFQ7QUFBQSxRQUVBLFdBQUEsRUFBYSxrREFGYjtPQURGO0FBQUEsTUFJQSxpQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEVBRFQ7QUFBQSxRQUVBLFdBQUEsRUFBYSwwRUFGYjtPQUxGO0FBQUEsTUFRQSxhQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsQ0FEVDtPQVRGO0FBQUEsTUFXQSxnQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sT0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEVBRFQ7QUFBQSxRQUVBLEtBQUEsRUFDRTtBQUFBLFVBQUEsSUFBQSxFQUFNLFFBQU47U0FIRjtPQVpGO0FBQUEsTUFnQkEsYUFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEVBRFQ7T0FqQkY7QUFBQSxNQW1CQSxXQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsS0FEVDtPQXBCRjtBQUFBLE1Bc0JBLFlBQUEsRUFDRTtBQUFBLFFBQUEsV0FBQSxFQUFhLDZDQUFiO0FBQUEsUUFDQSxJQUFBLEVBQU0sT0FETjtBQUFBLFFBRUEsU0FBQSxFQUFTLEVBRlQ7QUFBQSxRQUdBLEtBQUEsRUFDRTtBQUFBLFVBQUEsSUFBQSxFQUFNLFFBQU47U0FKRjtPQXZCRjtLQURGO0FBQUEsSUE4QkEsUUFBQSxFQUFVLFNBQUEsR0FBQTthQUNSLE9BQUEsQ0FBUSxtQkFBUixDQUE0QixDQUFDLE9BQTdCLENBQXFDLGVBQXJDLEVBRFE7SUFBQSxDQTlCVjtBQUFBLElBaUNBLGFBQUEsRUFBZSxTQUFBLEdBQUE7QUFDYixVQUFBLHVCQUFBO0FBQUEsTUFBQSxPQUFBLEdBQVUsT0FBQSxDQUFRLGFBQVIsQ0FBVixDQUFBO0FBQUEsTUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FEUCxDQUFBO2FBR0EsUUFBQSxHQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsYUFBQSxFQUFlLENBQUMsZUFBRCxFQUFrQixzQkFBbEIsQ0FEZjtBQUFBLFFBRUEsS0FBQSxFQUFPLE1BRlA7QUFBQSxRQUdBLFNBQUEsRUFBVyxJQUhYO0FBQUEsUUFJQSxJQUFBLEVBQU0sU0FBQyxVQUFELEdBQUE7QUFDSixjQUFBLDhIQUFBO0FBQUEsVUFBQSxRQUFBLEdBQVcsVUFBVSxDQUFDLE9BQVgsQ0FBQSxDQUFYLENBQUE7QUFBQSxVQUNBLFFBQUEsR0FBVyxVQUFVLENBQUMsT0FBWCxDQUFBLENBRFgsQ0FBQTtBQUFBLFVBRUEsVUFBQSxHQUFhLEVBRmIsQ0FBQTtBQUlBLFVBQUEsSUFBRyxhQUFBLEdBQWdCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw2QkFBaEIsQ0FBbkI7QUFDRSxZQUFBLFVBQVUsQ0FBQyxJQUFYLENBQWdCLG1CQUFoQixFQUFxQyxhQUFyQyxDQUFBLENBREY7V0FKQTtBQU1BLFVBQUEsSUFBRyxDQUFDLGdCQUFBLEdBQW1CLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixnQ0FBaEIsQ0FBcEIsQ0FBc0UsQ0FBQyxNQUExRTtBQUNFLFlBQUEsVUFBVSxDQUFDLElBQVgsQ0FBZ0IsVUFBaEIsRUFBNEIsZ0JBQWdCLENBQUMsSUFBakIsQ0FBc0IsR0FBdEIsQ0FBNUIsQ0FBQSxDQURGO1dBTkE7QUFRQSxVQUFBLElBQUcsYUFBQSxHQUFnQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNkJBQWhCLENBQW5CO0FBQ0UsWUFBQSxVQUFVLENBQUMsSUFBWCxDQUFnQixrQkFBaEIsRUFBb0MsYUFBcEMsQ0FBQSxDQURGO1dBUkE7QUFVQSxVQUFBLElBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDJCQUFoQixDQUFIO0FBQ0UsWUFBQSxVQUFVLENBQUMsSUFBWCxDQUFnQixnQkFBaEIsQ0FBQSxDQURGO1dBVkE7QUFZQSxVQUFBLElBQUcsQ0FBQyxZQUFBLEdBQWUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDRCQUFoQixDQUFoQixDQUE4RCxDQUFDLE1BQWxFO0FBQ0UsWUFBQSxVQUFVLENBQUMsSUFBWCxDQUFnQixVQUFoQixFQUE0QixZQUFZLENBQUMsSUFBYixDQUFrQixHQUFsQixDQUE1QixDQUFBLENBREY7V0FaQTtBQWNBLFVBQUEsSUFBRyxDQUFDLGlCQUFBLEdBQW9CLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixpQ0FBaEIsQ0FBckIsQ0FBSDtBQUNFLFlBQUEsVUFBVSxDQUFDLElBQVgsQ0FBZ0IsVUFBaEIsRUFBNEIsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQUF3QixDQUFBLENBQUEsQ0FBbEMsRUFBc0MsaUJBQXRDLENBQTVCLENBQUEsQ0FERjtXQWRBO0FBQUEsVUFnQkEsVUFBVSxDQUFDLElBQVgsQ0FBZ0IsR0FBaEIsQ0FoQkEsQ0FBQTtBQUFBLFVBa0JBLFFBQUEsR0FBVyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsOEJBQWhCLENBbEJYLENBQUE7QUFBQSxVQW1CQSxHQUFBLEdBQU0sSUFBSSxDQUFDLE9BQUwsQ0FBYSxVQUFVLENBQUMsT0FBWCxDQUFBLENBQWIsQ0FuQk4sQ0FBQTtBQW9CQSxpQkFBTyxPQUFPLENBQUMsSUFBUixDQUFhLFFBQWIsRUFBdUIsVUFBdkIsRUFBbUM7QUFBQSxZQUFDLEtBQUEsRUFBTyxRQUFSO0FBQUEsWUFBa0IsR0FBQSxFQUFLLEdBQXZCO1dBQW5DLENBQStELENBQUMsSUFBaEUsQ0FBcUUsU0FBQyxNQUFELEdBQUE7QUFDMUUsZ0JBQUEsaUNBQUE7QUFBQSxZQUFBLFFBQUEsR0FBVyxFQUFYLENBQUE7QUFBQSxZQUNBLEtBQUEsR0FBUSx3Q0FEUixDQUFBO0FBR0EsbUJBQU0sQ0FBQyxLQUFBLEdBQVEsS0FBSyxDQUFDLElBQU4sQ0FBVyxNQUFYLENBQVQsQ0FBQSxLQUFrQyxJQUF4QyxHQUFBO0FBQ0UsY0FBQSxJQUFBLEdBQU8sUUFBQSxDQUFTLEtBQU0sQ0FBQSxDQUFBLENBQWYsQ0FBQSxJQUFzQixDQUE3QixDQUFBO0FBQUEsY0FDQSxHQUFBLEdBQU0sUUFBQSxDQUFTLEtBQU0sQ0FBQSxDQUFBLENBQWYsQ0FBQSxJQUFzQixDQUQ1QixDQUFBO0FBQUEsY0FFQSxRQUFRLENBQUMsSUFBVCxDQUFjO0FBQUEsZ0JBQ1osSUFBQSxFQUFTLEtBQU0sQ0FBQSxDQUFBLENBQU4sS0FBWSxHQUFmLEdBQXdCLE9BQXhCLEdBQXFDLFNBRC9CO0FBQUEsZ0JBRVosSUFBQSxFQUFNLEtBQU0sQ0FBQSxDQUFBLENBQU4sR0FBVyxLQUFYLEdBQW1CLEtBQU0sQ0FBQSxDQUFBLENBRm5CO0FBQUEsZ0JBR1osVUFBQSxRQUhZO0FBQUEsZ0JBSVosS0FBQSxFQUFPLFlBQUEsQ0FBYTtBQUFBLGtCQUNsQixJQUFBLEVBQU0sS0FBTSxDQUFBLENBQUEsQ0FETTtBQUFBLGtCQUVsQixPQUFBLEVBQVMsS0FBTSxDQUFBLENBQUEsQ0FGRztBQUFBLGtCQUdsQixVQUFBLEVBQVksSUFBQSxHQUFPLENBSEQ7QUFBQSxrQkFJbEIsU0FBQSxFQUFXLEdBSk87QUFBQSxrQkFLbEIsWUFBQSxVQUxrQjtpQkFBYixDQUpLO2VBQWQsQ0FGQSxDQURGO1lBQUEsQ0FIQTtBQWtCQSxtQkFBTyxRQUFQLENBbkIwRTtVQUFBLENBQXJFLENBQVAsQ0FyQkk7UUFBQSxDQUpOO1FBTFc7SUFBQSxDQWpDZjtHQXRHRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/Marvin/.atom/packages/linter-flake8/lib/main.coffee
