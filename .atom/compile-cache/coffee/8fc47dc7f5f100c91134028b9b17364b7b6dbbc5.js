(function() {
  var basename, exec, filenameMap, grammarMap, platform, plugin;

  basename = require('path').basename;

  exec = require('child_process').exec;

  platform = require('process').platform;

  grammarMap = require('./grammar-map');

  filenameMap = require('./filename-map');

  plugin = module.exports = {
    config: {
      grammars: {
        type: 'object',
        properties: {}
      },
      filenames: {
        type: 'object',
        properties: {}
      }
    },
    exec: exec,
    activate: function() {
      return atom.commands.add('atom-text-editor', {
        'dash:shortcut': (function(_this) {
          return function() {
            return _this.shortcut(true);
          };
        })(this),
        'dash:shortcut-alt': (function(_this) {
          return function() {
            return _this.shortcut(false);
          };
        })(this),
        'dash:context-menu': (function(_this) {
          return function() {
            return _this.shortcut(true);
          };
        })(this)
      });
    },
    shortcut: function(sensitive) {
      var currentScope, cursor, displayBufferRange, editor, range, scopes, selection, text;
      editor = atom.workspace.getActiveTextEditor();
      if (!editor) {
        return;
      }
      selection = editor.getLastSelection().getText();
      if (selection) {
        return plugin.search(selection, sensitive);
      }
      cursor = editor.getLastCursor();
      scopes = cursor.getScopeDescriptor().getScopesArray();
      currentScope = scopes[scopes.length - 1];
      if (scopes.length < 2 || /^(?:comment|string|meta|markup)(?:\.|$)/.test(currentScope)) {
        return plugin.search(editor.getWordUnderCursor(), sensitive);
      }
      displayBufferRange = editor.displayBuffer.bufferRangeForScopeAtPosition(currentScope, cursor.getScreenPosition());
      if (displayBufferRange) {
        range = editor.displayBuffer.bufferRangeForScreenRange(displayBufferRange);
        text = editor.getTextInBufferRange(range);
      } else {
        text = editor.getWordUnderCursor();
      }
      return plugin.search(text, sensitive);
    },
    search: function(string, sensitive, cb) {
      var activeEditor, cmd, language, path;
      activeEditor = atom.workspace.getActiveTextEditor();
      if (sensitive && activeEditor) {
        path = activeEditor.getPath();
        language = activeEditor.getGrammar().name;
      }
      cmd = this.getCommand(string, path, language);
      return plugin.exec(cmd, cb);
    },
    getCommand: function(string, path, language) {
      if (platform === 'win32') {
        return 'cmd.exe /c start "" "' + this.getDashURI(string, path, language) + '"';
      }
      if (platform === 'linux') {
        return this.getZealCommand(string, path, language);
      }
      return 'open -g "' + this.getDashURI(string, path, language) + '"';
    },
    getKeywordString: function(path, language) {
      var filename, filenameConfig, grammarConfig, keys;
      keys = [];
      if (path) {
        filename = basename(path).toLowerCase();
        filenameConfig = atom.config.get('dash.filenames') || {};
        keys = keys.concat(filenameConfig[filename] || filenameMap[filename] || []);
      }
      if (language) {
        grammarConfig = atom.config.get('dash.grammars') || {};
        keys = keys.concat(grammarConfig[language] || grammarMap[language] || []);
      }
      if (keys.length) {
        return keys.map(encodeURIComponent).join(',');
      }
    },
    getDashURI: function(string, path, language) {
      var keywords, link;
      link = 'dash-plugin://query=' + encodeURIComponent(string);
      keywords = this.getKeywordString(path, language);
      if (keywords) {
        link += '&keys=' + keywords;
      }
      return link;
    },
    getZealCommand: function(string, path, language) {
      var keywords, query;
      query = string;
      keywords = this.getKeywordString(path, language);
      if (keywords) {
        query = keywords + ':' + query;
      }
      return 'zeal --query "' + query + '"';
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL01hcnZpbi8uYXRvbS9wYWNrYWdlcy9kYXNoL2xpYi9kYXNoLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx5REFBQTs7QUFBQSxFQUFBLFFBQUEsR0FBVyxPQUFBLENBQVEsTUFBUixDQUFlLENBQUMsUUFBM0IsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsZUFBUixDQUF3QixDQUFDLElBRGhDLENBQUE7O0FBQUEsRUFFQSxRQUFBLEdBQVcsT0FBQSxDQUFRLFNBQVIsQ0FBa0IsQ0FBQyxRQUY5QixDQUFBOztBQUFBLEVBR0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxlQUFSLENBSGIsQ0FBQTs7QUFBQSxFQUlBLFdBQUEsR0FBYyxPQUFBLENBQVEsZ0JBQVIsQ0FKZCxDQUFBOztBQUFBLEVBTUEsTUFBQSxHQUFTLE1BQU0sQ0FBQyxPQUFQLEdBR1A7QUFBQSxJQUFBLE1BQUEsRUFDRTtBQUFBLE1BQUEsUUFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsVUFBQSxFQUFZLEVBRFo7T0FERjtBQUFBLE1BR0EsU0FBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsVUFBQSxFQUFZLEVBRFo7T0FKRjtLQURGO0FBQUEsSUFTQSxJQUFBLEVBQU0sSUFUTjtBQUFBLElBV0EsUUFBQSxFQUFVLFNBQUEsR0FBQTthQUNSLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixrQkFBbEIsRUFBc0M7QUFBQSxRQUNwQyxlQUFBLEVBQWlCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUFNLEtBQUMsQ0FBQSxRQUFELENBQVUsSUFBVixFQUFOO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEbUI7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

//# sourceURL=/Users/Marvin/.atom/packages/dash/lib/dash.coffee
