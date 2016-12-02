
/*
Global Logger
 */

(function() {
  module.exports = (function() {
    var Emitter, emitter, levels, stream, winston, writable;
    Emitter = require('event-kit').Emitter;
    emitter = new Emitter();
    winston = require('winston');
    stream = require('stream');
    writable = new stream.Writable();
    writable._write = function(chunk, encoding, next) {
      var msg;
      msg = chunk.toString();
      emitter.emit('logging', msg);
      return next();
    };
    levels = {
      silly: 0,
      input: 1,
      verbose: 2,
      prompt: 3,
      debug: 4,
      info: 5,
      data: 6,
      help: 7,
      warn: 8,
      error: 9
    };
    return function(label) {
      var logger, loggerMethods, method, transport, wlogger, _i, _len;
      transport = new winston.transports.File({
        label: label,
        level: 'debug',
        timestamp: true,
        stream: writable,
        json: false
      });
      wlogger = new winston.Logger({
        transports: [transport]
      });
      wlogger.on('logging', function(transport, level, msg, meta) {
        var d, levelNum, loggerLevel, loggerLevelNum, path, _ref;
        loggerLevel = (_ref = typeof atom !== "undefined" && atom !== null ? atom.config.get('atom-beautify.general.loggerLevel') : void 0) != null ? _ref : "warn";
        loggerLevelNum = levels[loggerLevel];
        levelNum = levels[level];
        if (loggerLevelNum <= levelNum) {
          path = require('path');
          label = "" + (path.dirname(transport.label).split(path.sep).reverse()[0]) + "" + path.sep + (path.basename(transport.label));
          d = new Date();
          return console.log("" + (d.toLocaleDateString()) + " " + (d.toLocaleTimeString()) + " - " + label + " [" + level + "]: " + msg, meta);
        }
      });
      loggerMethods = ['silly', 'debug', 'verbose', 'info', 'warn', 'error'];
      logger = {};
      for (_i = 0, _len = loggerMethods.length; _i < _len; _i++) {
        method = loggerMethods[_i];
        logger[method] = wlogger[method];
      }
      logger.onLogging = function(handler) {
        var subscription;
        subscription = emitter.on('logging', handler);
        return subscription;
      };
      return logger;
    };
  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL01hcnZpbi8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9sb2dnZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQTs7R0FBQTtBQUFBO0FBQUE7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQW9CLENBQUEsU0FBQSxHQUFBO0FBRWxCLFFBQUEsbURBQUE7QUFBQSxJQUFDLFVBQVcsT0FBQSxDQUFRLFdBQVIsRUFBWCxPQUFELENBQUE7QUFBQSxJQUNBLE9BQUEsR0FBYyxJQUFBLE9BQUEsQ0FBQSxDQURkLENBQUE7QUFBQSxJQUlBLE9BQUEsR0FBVSxPQUFBLENBQVEsU0FBUixDQUpWLENBQUE7QUFBQSxJQUtBLE1BQUEsR0FBUyxPQUFBLENBQVEsUUFBUixDQUxULENBQUE7QUFBQSxJQU1BLFFBQUEsR0FBZSxJQUFBLE1BQU0sQ0FBQyxRQUFQLENBQUEsQ0FOZixDQUFBO0FBQUEsSUFPQSxRQUFRLENBQUMsTUFBVCxHQUFrQixTQUFDLEtBQUQsRUFBUSxRQUFSLEVBQWtCLElBQWxCLEdBQUE7QUFDaEIsVUFBQSxHQUFBO0FBQUEsTUFBQSxHQUFBLEdBQU0sS0FBSyxDQUFDLFFBQU4sQ0FBQSxDQUFOLENBQUE7QUFBQSxNQUVBLE9BQU8sQ0FBQyxJQUFSLENBQWEsU0FBYixFQUF3QixHQUF4QixDQUZBLENBQUE7YUFHQSxJQUFBLENBQUEsRUFKZ0I7SUFBQSxDQVBsQixDQUFBO0FBQUEsSUFhQSxNQUFBLEdBQVM7QUFBQSxNQUNQLEtBQUEsRUFBTyxDQURBO0FBQUEsTUFFUCxLQUFBLEVBQU8sQ0FGQTtBQUFBLE1BR1AsT0FBQSxFQUFTLENBSEY7QUFBQSxNQUlQLE1BQUEsRUFBUSxDQUpEO0FBQUEsTUFLUCxLQUFBLEVBQU8sQ0FMQTtBQUFBLE1BTVAsSUFBQSxFQUFNLENBTkM7QUFBQSxNQU9Q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

//# sourceURL=/Users/Marvin/.atom/packages/atom-beautify/src/logger.coffee
