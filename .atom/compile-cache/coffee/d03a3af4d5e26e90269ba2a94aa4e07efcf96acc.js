(function() {
  "use strict";
  var Beautifier, JSBeautify,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  module.exports = JSBeautify = (function(_super) {
    __extends(JSBeautify, _super);

    function JSBeautify() {
      return JSBeautify.__super__.constructor.apply(this, arguments);
    }

    JSBeautify.prototype.name = "CSScomb";

    JSBeautify.prototype.link = "https://github.com/csscomb/csscomb.js";

    JSBeautify.prototype.options = {
      _: {
        configPath: true,
        predefinedConfig: true
      },
      CSS: true,
      LESS: true,
      SCSS: true
    };

    JSBeautify.prototype.beautify = function(text, language, options) {
      return new this.Promise(function(resolve, reject) {
        var CSON, Comb, comb, config, expandHomeDir, processedCSS, project, syntax, _ref;
        Comb = require('csscomb');
        expandHomeDir = require('expand-home-dir');
        CSON = require('season');
        config = null;
        try {
          project = (_ref = atom.project.getDirectories()) != null ? _ref[0] : void 0;
          try {
            config = CSON.readFileSync(project != null ? project.resolve('.csscomb.cson') : void 0);
          } catch (_error) {
            config = require(project != null ? project.resolve('.csscomb.json') : void 0);
          }
        } catch (_error) {
          try {
            config = CSON.readFileSync(expandHomeDir(options.configPath));
          } catch (_error) {
            config = Comb.getConfig(options.predefinedConfig);
          }
        }
        comb = new Comb(config);
        syntax = "css";
        switch (language) {
          case "LESS":
            syntax = "less";
            break;
          case "SCSS":
            syntax = "scss";
            break;
          case "Sass":
            syntax = "sass";
        }
        processedCSS = comb.processString(text, {
          syntax: syntax
        });
        return resolve(processedCSS);
      });
    };

    return JSBeautify;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL01hcnZpbi8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9jc3Njb21iLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsRUFBQSxZQUFBLENBQUE7QUFBQSxNQUFBLHNCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFDQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVIsQ0FEYixDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FBdUI7QUFDckIsaUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLHlCQUFBLElBQUEsR0FBTSxTQUFOLENBQUE7O0FBQUEseUJBQ0EsSUFBQSxHQUFNLHVDQUROLENBQUE7O0FBQUEseUJBR0EsT0FBQSxHQUFTO0FBQUEsTUFFUCxDQUFBLEVBQ0U7QUFBQSxRQUFBLFVBQUEsRUFBWSxJQUFaO0FBQUEsUUFDQSxnQkFBQSxFQUFrQixJQURsQjtPQUhLO0FBQUEsTUFLUCxHQUFBLEVBQUssSUFMRTtBQUFBLE1BTVAsSUFBQSxFQUFNLElBTkM7QUFBQSxNQU9QLElBQUEsRUFBTSxJQVBDO0tBSFQsQ0FBQTs7QUFBQSx5QkFhQSxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQixHQUFBO0FBQ1IsYUFBVyxJQUFBLElBQUMsQ0FBQSxPQUFELENBQVMsU0FBQyxPQUFELEVBQVUsTUFBVixHQUFBO0FBSWxCLFlBQUEsNEVBQUE7QUFBQSxRQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsU0FBUixDQUFQLENBQUE7QUFBQSxRQUNBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLGlCQUFSLENBRGhCLENBQUE7QUFBQSxRQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsUUFBUixDQUZQLENBQUE7QUFBQSxRQUlBLE1BQUEsR0FBUyxJQUpULENBQUE7QUFLQTtBQUNFLFVBQUEsT0FBQSx3REFBeUMsQ0FBQSxDQUFBLFVBQXpDLENBQUE7QUFDQTtBQUNFLFlBQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxZQUFMLG1CQUFrQixPQUFPLENBQUUsT0FBVCxDQUFpQixlQUFqQixVQUFsQixDQUFULENBREY7V0FBQSxjQUFBO0FBR0UsWUFBQSxNQUFBLEdBQVMsT0FBQSxtQkFBUSxPQUFPLENBQUUsT0FBVCxDQUFpQixlQUFqQixVQUFSLENBQVQsQ0FIRjtXQUZGO1NBQUEsY0FBQTtBQU9FO0FBQ0UsWUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFlBQUwsQ0FBa0IsYUFBQSxDQUFjLE9BQU8sQ0FBQyxVQUF0QixDQUFsQixDQUFULENBREY7V0FBQSxjQUFBO0FBSUUsWUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQUwsQ0FBZSxPQUFPLENBQUMsZ0JBQXZCLENBQVQsQ0FKRjtXQVBGO1NBTEE7QUFBQSxRQW1CQSxJQUFBLEdBQVcsSUFBQSxJQUFBLENBQUssTUFBTCxDQW5CWCxDQUFBO0FBQUEsUUFzQkEsTUFBQSxHQUFTLEtBdEJULENBQUE7QUF1QkEsZ0JBQU8sUUFBUDtBQUFBLGVBQ08sTUFEUDtBQUVJLFlBQUEsTUFBQSxHQUFTLE1BQVQsQ0FGSjtBQUNPO0FBRFAsZUFHTyxNQUhQO0FBSUksWUFBQSxNQUFBLEdBQVMsTUFBVCxDQUpKO0FBR087QUFIUCxlQUtPLE1BTFA7QUFNSSxZQUFBLE1BQUEsR0FBUyxNQUFULENBTko7QUFBQSxTQXZCQTtBQUFBLFFBK0JBLFlBQUEsR0FBZSxJQUFJLENBQUMsYUFBTCxDQUFtQixJQUFuQixFQUF5QjtBQUFBLFVBQ3RDLE1BQUEsRUFBUSxNQUQ4QjtTQUF6QixDQS9CZixDQUFBO2VBb0NBLE9BQUEsQ0FBUSxZQUFSLEVBeENrQjtNQUFBLENBQVQsQ0FBWCxDQURRO0lBQUEsQ0FiVixDQUFBOztzQkFBQTs7S0FEd0MsV0FIMUMsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/Marvin/.atom/packages/atom-beautify/src/beautifiers/csscomb.coffee
