(function() {
  var basename, filenameMap, grammarMap, openExternal, platform, plugin;

  basename = require('path').basename;

  openExternal = require('shell').openExternal;

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
    openExternal: openExternal,
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
      var activeEditor, language, path;
      activeEditor = atom.workspace.getActiveTextEditor();
      if (sensitive && activeEditor) {
        path = activeEditor.getPath();
        language = activeEditor.getGrammar().name;
      }
      return this.openExternal(this.getDashURI(string, path, language, background), {
        activate: false
      });
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
    getDashScheme: function() {
      if (platform === 'linux') {
        return 'dash-plugin:';
      }
      return 'dash-plugin://';
    },
    getDashURI: function(string, path, language, background) {
      var keywords, link, scheme;
      scheme = this.getDashScheme();
      keywords = this.getKeywordString(path, language);
      link = scheme + 'query=' + encodeURIComponent(string);
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL01hcnZpbi8uYXRvbS9wYWNrYWdlcy9kYXNoL2xpYi9kYXNoLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxpRUFBQTs7QUFBQSxFQUFBLFFBQUEsR0FBVyxPQUFBLENBQVEsTUFBUixDQUFlLENBQUMsUUFBM0IsQ0FBQTs7QUFBQSxFQUNBLFlBQUEsR0FBZSxPQUFBLENBQVEsT0FBUixDQUFnQixDQUFDLFlBRGhDLENBQUE7O0FBQUEsRUFFQSxRQUFBLEdBQVcsT0FBQSxDQUFRLFNBQVIsQ0FBa0IsQ0FBQyxRQUY5QixDQUFBOztBQUFBLEVBR0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxlQUFSLENBSGIsQ0FBQTs7QUFBQSxFQUlBLFdBQUEsR0FBYyxPQUFBLENBQVEsZ0JBQVIsQ0FKZCxDQUFBOztBQUFBLEVBTUEsTUFBQSxHQUFTLE1BQU0sQ0FBQyxPQUFQLEdBR1A7QUFBQSxJQUFBLE1BQUEsRUFDRTtBQUFBLE1BQUEsUUFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsVUFBQSxFQUFZLEVBRFo7T0FERjtBQUFBLE1BR0EsU0FBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsVUFBQSxFQUFZLEVBRFo7T0FKRjtLQURGO0FBQUEsSUFTQSxZQUFBLEVBQWMsWUFUZDtBQUFBLElBV0EsUUFBQSxFQUFVLFNBQUEsR0FBQTthQUNSLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixrQkFBbEIsRUFBc0M7QUFBQSxRQUNwQyxlQUFBLEVBQWlCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUFNLEtBQUMsQ0FBQSxRQUFELENBQVUsSUFBVixFQUFnQixLQUFoQixFQUFOO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFB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

//# sourceURL=/Users/Marvin/.atom/packages/dash/lib/dash.coffee
