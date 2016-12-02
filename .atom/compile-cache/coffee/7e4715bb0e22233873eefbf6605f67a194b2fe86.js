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
            return _this.shortcut(true, false);
          };
        })(this),
        'dash:shortcut-background': (function(_this) {
          return function() {
            return _this.shortcut(true, true);
          };
        })(this),
        'dash:shortcut-alt': (function(_this) {
          return function() {
            return _this.shortcut(false, false);
          };
        })(this),
        'dash:shortcut-alt-background': (function(_this) {
          return function() {
            return _this.shortcut(false, true);
          };
        })(this),
        'dash:context-menu': (function(_this) {
          return function() {
            return _this.shortcut(true, false);
          };
        })(this)
      });
    },
    shortcut: function(sensitive, background) {
      var callback, editor, selection;
      editor = atom.workspace.getActiveTextEditor();
      if (!editor) {
        return;
      }
      selection = editor.getLastSelection().getText();
      callback = (function(_this) {
        return function(error) {
          if (error) {
            return atom.notifications.addError('Unable to launch Dash', {
              dismissable: true,
              detail: error.message
            });
          }
        };
      })(this);
      if (selection) {
        return plugin.search(selection, sensitive, background, callback);
      }
      return plugin.search(editor.getWordUnderCursor(), sensitive, background, callback);
    },
    search: function(string, sensitive, background, cb) {
      var activeEditor, cmd, language, path;
      activeEditor = atom.workspace.getActiveTextEditor();
      if (sensitive && activeEditor) {
        path = activeEditor.getPath();
        language = activeEditor.getGrammar().name;
      }
      cmd = this.getCommand(string, path, language, background);
      return plugin.exec(cmd, cb);
    },
    getCommand: function(string, path, language, background) {
      var uri;
      uri = this.getDashURI(string, path, language, background);
      if (platform === 'win32') {
        return 'cmd.exe /c start "" "' + uri + '"';
      }
      if (platform === 'linux') {
        return 'xdg-open "' + uri + '"';
      }
      return 'open -g "' + uri + '"';
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
    getDashURI: function(string, path, language, background) {
      var keywords, link;
      link = 'dash-plugin://query=' + encodeURIComponent(string);
      keywords = this.getKeywordString(path, language);
      if (keywords) {
        link += '&keys=' + keywords;
      }
      if (background) {
        link += '&prevent_activation=true';
      }
      return link;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL01hcnZpbi8uYXRvbS9wYWNrYWdlcy9kYXNoL2xpYi9kYXNoLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx5REFBQTs7QUFBQSxFQUFBLFFBQUEsR0FBVyxPQUFBLENBQVEsTUFBUixDQUFlLENBQUMsUUFBM0IsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsZUFBUixDQUF3QixDQUFDLElBRGhDLENBQUE7O0FBQUEsRUFFQSxRQUFBLEdBQVcsT0FBQSxDQUFRLFNBQVIsQ0FBa0IsQ0FBQyxRQUY5QixDQUFBOztBQUFBLEVBR0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxlQUFSLENBSGIsQ0FBQTs7QUFBQSxFQUlBLFdBQUEsR0FBYyxPQUFBLENBQVEsZ0JBQVIsQ0FKZCxDQUFBOztBQUFBLEVBTUEsTUFBQSxHQUFTLE1BQU0sQ0FBQyxPQUFQLEdBR1A7QUFBQSxJQUFBLE1BQUEsRUFDRTtBQUFBLE1BQUEsUUFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsVUFBQSxFQUFZLEVBRFo7T0FERjtBQUFBLE1BR0EsU0FBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsVUFBQSxFQUFZLEVBRFo7T0FKRjtLQURGO0FBQUEsSUFTQSxJQUFBLEVBQU0sSUFUTjtBQUFBLElBV0EsUUFBQSxFQUFVLFNBQUEsR0FBQTthQUNSLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixrQkFBbEIsRUFBc0M7QUFBQSxRQUNwQyxlQUFBLEVBQWlCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUFNLEtBQUMsQ0FBQSxRQUFELENBQVUsSUFBVixFQUFnQixLQUFoQixFQUFOO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFB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

//# sourceURL=/Users/Marvin/.atom/packages/dash/lib/dash.coffee
