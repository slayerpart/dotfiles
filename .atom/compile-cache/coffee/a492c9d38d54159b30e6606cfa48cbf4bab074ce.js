(function() {
  var COMPLETIONS, JSXATTRIBUTE, JSXENDTAGSTART, JSXREGEXP, JSXSTARTTAGEND, JSXTAG, Point, REACTURL, Range, TAGREGEXP, filter, score, _ref, _ref1,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ref = require("atom"), Range = _ref.Range, Point = _ref.Point;

  _ref1 = require("fuzzaldrin"), filter = _ref1.filter, score = _ref1.score;

  JSXSTARTTAGEND = 0;

  JSXENDTAGSTART = 1;

  JSXTAG = 2;

  JSXATTRIBUTE = 3;

  JSXREGEXP = /(?:(<)|(<\/))([$_A-Za-z](?:[$._:\-a-zA-Z0-9])*)|(?:(\/>)|(>))/g;

  TAGREGEXP = /<([$_a-zA-Z][$._:\-a-zA-Z0-9]*)($|\s|\/>|>)/g;

  COMPLETIONS = require("./completions-jsx");

  REACTURL = "http://facebook.github.io/react/docs/tags-and-attributes.html";

  module.exports = {
    selector: ".meta.tag.jsx",
    inclusionPriority: 10000,
    excludeLowerPriority: false,
    getSuggestions: function(opts) {
      var attribute, bufferPosition, editor, elementObj, filteredAttributes, htmlElement, htmlElements, jsxRange, jsxTag, prefix, scopeDescriptor, startOfJSX, suggestions, tagName, tagNameStack, _i, _j, _k, _len, _len1, _len2, _ref2;
      editor = opts.editor, bufferPosition = opts.bufferPosition, scopeDescriptor = opts.scopeDescriptor, prefix = opts.prefix;
      if (editor.getGrammar().packageName !== "language-babel") {
        return;
      }
      jsxTag = this.getTriggerTag(editor, bufferPosition);
      if (jsxTag == null) {
        return;
      }
      suggestions = [];
      if (jsxTag === JSXSTARTTAGEND) {
        startOfJSX = this.getStartOfJSX(editor, bufferPosition);
        jsxRange = new Range(startOfJSX, bufferPosition);
        tagNameStack = this.buildTagStack(editor, jsxRange);
        while ((tagName = tagNameStack.pop()) != null) {
          suggestions.push({
            snippet: "$1</" + tagName + ">",
            type: "tag",
            description: "language-babel tag closer"
          });
        }
      } else if (jsxTag === JSXENDTAGSTART) {
        startOfJSX = this.getStartOfJSX(editor, bufferPosition);
        jsxRange = new Range(startOfJSX, bufferPosition);
        tagNameStack = this.buildTagStack(editor, jsxRange);
        while ((tagName = tagNameStack.pop()) != null) {
          suggestions.push({
            snippet: "" + tagName + ">",
            type: "tag",
            description: "language-babel tag closer"
          });
        }
      } else if (jsxTag === JSXTAG) {
        if (!/^[a-z]/g.exec(prefix)) {
          return;
        }
        htmlElements = filter(COMPLETIONS.htmlElements, prefix, {
          key: "name"
        });
        for (_i = 0, _len = htmlElements.length; _i < _len; _i++) {
          htmlElement = htmlElements[_i];
          if (score(htmlElement.name, prefix) < 0.07) {
            continue;
          }
          suggestions.push({
            snippet: htmlElement.name,
            type: "tag",
            description: "language-babel JSX supported elements",
            descriptionMoreURL: REACTURL
          });
        }
      } else if (jsxTag === JSXATTRIBUTE) {
        tagName = this.getThisTagName(editor, bufferPosition);
        if (tagName == null) {
          return;
        }
        _ref2 = COMPLETIONS.htmlElements;
        for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
          elementObj = _ref2[_j];
          if (elementObj.name === tagName) {
            break;
          }
        }
        elementObj.attributes = elementObj.attributes.concat(COMPLETIONS.globalAttributes);
        elementObj.attributes = elementObj.attributes.concat(COMPLETIONS.events);
        filteredAttributes = filter(elementObj.attributes, prefix, {
          key: "name"
        });
        for (_k = 0, _len2 = filteredAttributes.length; _k < _len2; _k++) {
          attribute = filteredAttributes[_k];
          if (score(attribute.name, prefix) < 0.07) {
            continue;
          }
          suggestions.push({
            snippet: attribute.name,
            type: "attribute",
            rightLabel: "<" + tagName + ">",
            description: "language-babel JSXsupported attributes/events",
            descriptionMoreURL: REACTURL
          });
        }
      } else {
        return;
      }
      return suggestions;
    },
    getThisTagName: function(editor, bufferPosition) {
      var column, match, matches, row, rowText, scopes;
      row = bufferPosition.row;
      column = null;
      while (row >= 0) {
        rowText = editor.lineTextForBufferRow(row);
        if (column == null) {
          rowText = rowText.substr(0, column = bufferPosition.column);
        }
        matches = [];
        while ((match = TAGREGEXP.exec(rowText)) !== null) {
          scopes = editor.scopeDescriptorForBufferPosition([row, match.index + 1]).getScopesArray();
          if (__indexOf.call(scopes, "entity.name.tag.open.jsx") >= 0) {
            matches.push(match[1]);
          }
        }
        if (matches.length) {
          return matches.pop();
        } else {
          row--;
        }
      }
    },
    getTriggerTag: function(editor, bufferPosition) {
      var column, scopes;
      column = bufferPosition.column - 1;
      if (column >= 0) {
        scopes = editor.scopeDescriptorForBufferPosition([bufferPosition.row, column]).getScopesArray();
        if (__indexOf.call(scopes, "entity.other.attribute-name.jsx") >= 0) {
          return JSXATTRIBUTE;
        }
        if (__indexOf.call(scopes, "entity.name.tag.open.jsx") >= 0) {
          return JSXTAG;
        }
        if (__indexOf.call(scopes, "JSXStartTagEnd") >= 0) {
          return JSXSTARTTAGEND;
        }
        if (__indexOf.call(scopes, "JSXEndTagStart") >= 0) {
          return JSXENDTAGSTART;
        }
      }
    },
    getStartOfJSX: function(editor, bufferPosition) {
      var column, columnLen, row;
      row = bufferPosition.row;
      while (row >= 0) {
        if (__indexOf.call(editor.scopeDescriptorForBufferPosition([row, 0]).getScopesArray(), "meta.tag.jsx") < 0) {
          break;
        }
        row--;
      }
      if (row < 0) {
        row = 0;
      }
      columnLen = editor.lineTextForBufferRow(row).length;
      column = 0;
      while (column < columnLen) {
        if (__indexOf.call(editor.scopeDescriptorForBufferPosition([row, column]).getScopesArray(), "meta.tag.jsx") >= 0) {
          break;
        }
        column++;
      }
      if (column === columnLen) {
        row++;
        column = 0;
      }
      return new Point(row, column);
    },
    buildTagStack: function(editor, range) {
      var closedtag, line, match, matchColumn, matchPointEnd, matchPointStart, matchRange, row, scopes, tagNameStack;
      tagNameStack = [];
      row = range.start.row;
      while (row <= range.end.row) {
        line = editor.lineTextForBufferRow(row);
        if (row === range.end.row) {
          line = line.substr(0, range.end.column);
        }
        while ((match = JSXREGEXP.exec(line)) !== null) {
          matchColumn = match.index;
          matchPointStart = new Point(row, matchColumn);
          matchPointEnd = new Point(row, matchColumn + match[0].length - 1);
          matchRange = new Range(matchPointStart, matchPointEnd);
          if (range.intersectsWith(matchRange)) {
            scopes = editor.scopeDescriptorForBufferPosition([row, match.index]).getScopesArray();
            if (__indexOf.call(scopes, "punctuation.definition.tag.jsx") < 0) {
              continue;
            }
            if (match[1] != null) {
              tagNameStack.push(match[3]);
            } else if (match[2] != null) {
              closedtag = tagNameStack.pop();
              if (closedtag !== match[3]) {
                tagNameStack.push(closedtag);
              }
            } else if (match[4] != null) {
              tagNameStack.pop();
            }
          }
        }
        row++;
      }
      return tagNameStack;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL01hcnZpbi8uYXRvbS9wYWNrYWdlcy9sYW5ndWFnZS1iYWJlbC9saWIvYXV0by1jb21wbGV0ZS1qc3guY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDJJQUFBO0lBQUEscUpBQUE7O0FBQUEsRUFBQSxPQUFpQixPQUFBLENBQVEsTUFBUixDQUFqQixFQUFDLGFBQUEsS0FBRCxFQUFRLGFBQUEsS0FBUixDQUFBOztBQUFBLEVBQ0EsUUFBa0IsT0FBQSxDQUFRLFlBQVIsQ0FBbEIsRUFBQyxlQUFBLE1BQUQsRUFBUyxjQUFBLEtBRFQsQ0FBQTs7QUFBQSxFQUlBLGNBQUEsR0FBaUIsQ0FKakIsQ0FBQTs7QUFBQSxFQUtBLGNBQUEsR0FBaUIsQ0FMakIsQ0FBQTs7QUFBQSxFQU1BLE1BQUEsR0FBUyxDQU5ULENBQUE7O0FBQUEsRUFPQSxZQUFBLEdBQWUsQ0FQZixDQUFBOztBQUFBLEVBU0EsU0FBQSxHQUFZLGdFQVRaLENBQUE7O0FBQUEsRUFVQSxTQUFBLEdBQWEsOENBVmIsQ0FBQTs7QUFBQSxFQVdBLFdBQUEsR0FBYyxPQUFBLENBQVEsbUJBQVIsQ0FYZCxDQUFBOztBQUFBLEVBWUEsUUFBQSxHQUFXLCtEQVpYLENBQUE7O0FBQUEsRUFjQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxRQUFBLEVBQVUsZUFBVjtBQUFBLElBQ0EsaUJBQUEsRUFBbUIsS0FEbkI7QUFBQSxJQUVBLG9CQUFBLEVBQXNCLEtBRnRCO0FBQUEsSUFLQSxjQUFBLEVBQWdCLFNBQUMsSUFBRCxHQUFBO0FBQ2QsVUFBQSw4TkFBQTtBQUFBLE1BQUMsY0FBQSxNQUFELEVBQVMsc0JBQUEsY0FBVCxFQUF5Qix1QkFBQSxlQUF6QixFQUEwQyxjQUFBLE1BQTFDLENBQUE7QUFDQSxNQUFBLElBQVUsTUFBTSxDQUFDLFVBQVAs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

//# sourceURL=/Users/Marvin/.atom/packages/language-babel/lib/auto-complete-jsx.coffee
