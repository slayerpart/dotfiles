(function() {
  var Emitter, HydrogenKernel, Kernel, StatusView, WatchSidebar, child_process, jmp, path, uuid, zmq, _;

  Emitter = require('atom').Emitter;

  child_process = require('child_process');

  path = require('path');

  _ = require('lodash');

  jmp = require('jmp');

  uuid = require('uuid');

  zmq = jmp.zmq;

  StatusView = require('./status-view');

  WatchSidebar = require('./watch-sidebar');

  HydrogenKernel = require('./plugin-api/hydrogen-kernel');

  module.exports = Kernel = (function() {
    function Kernel(kernelSpec, grammar) {
      this.kernelSpec = kernelSpec;
      this.grammar = grammar;
      this.watchCallbacks = [];
      this.watchSidebar = new WatchSidebar(this);
      this.statusView = new StatusView(this.kernelSpec.display_name);
      this.emitter = new Emitter();
      this.pluginWrapper = null;
    }

    Kernel.prototype.getPluginWrapper = function() {
      if (this.pluginWrapper == null) {
        this.pluginWrapper = new HydrogenKernel(this);
      }
      return this.pluginWrapper;
    };

    Kernel.prototype.addWatchCallback = function(watchCallback) {
      return this.watchCallbacks.push(watchCallback);
    };

    Kernel.prototype._callWatchCallbacks = function() {
      return this.watchCallbacks.forEach(function(watchCallback) {
        return watchCallback();
      });
    };

    Kernel.prototype.interrupt = function() {
      throw new Error('Kernel: interrupt method not implemented');
    };

    Kernel.prototype.shutdown = function() {
      throw new Error('Kernel: shutdown method not implemented');
    };

    Kernel.prototype.execute = function(code, onResults) {
      throw new Error('Kernel: execute method not implemented');
    };

    Kernel.prototype.executeWatch = function(code, onResults) {
      throw new Error('Kernel: executeWatch method not implemented');
    };

    Kernel.prototype.complete = function(code, onResults) {
      throw new Error('Kernel: complete method not implemented');
    };

    Kernel.prototype.inspect = function(code, cursor_pos, onResults) {
      throw new Error('Kernel: inspect method not implemented');
    };

    Kernel.prototype._parseIOMessage = function(message) {
      var result;
      result = this._parseDisplayIOMessage(message);
      if (result == null) {
        result = this._parseResultIOMessage(message);
      }
      if (result == null) {
        result = this._parseErrorIOMessage(message);
      }
      if (result == null) {
        result = this._parseStreamIOMessage(message);
      }
      return result;
    };

    Kernel.prototype._parseDisplayIOMessage = function(message) {
      var result;
      if (message.header.msg_type === 'display_data') {
        result = this._parseDataMime(message.content.data);
      }
      return result;
    };

    Kernel.prototype._parseResultIOMessage = function(message) {
      var msg_type, result;
      msg_type = message.header.msg_type;
      if (msg_type === 'execute_result' || msg_type === 'pyout') {
        result = this._parseDataMime(message.content.data);
      }
      return result;
    };

    Kernel.prototype._parseDataMime = function(data) {
      var mime, result;
      if (data == null) {
        return null;
      }
      mime = this._getMimeType(data);
      if (mime == null) {
        return null;
      }
      if (mime === 'text/plain') {
        result = {
          data: {
            'text/plain': data[mime]
          },
          type: 'text',
          stream: 'pyout'
        };
        result.data['text/plain'] = result.data['text/plain'].trim();
      } else {
        result = {
          data: {},
          type: mime,
          stream: 'pyout'
        };
        result.data[mime] = data[mime];
      }
      return result;
    };

    Kernel.prototype._getMimeType = function(data) {
      var imageMimes, mime;
      imageMimes = Object.getOwnPropertyNames(data).filter(function(mime) {
        return mime.startsWith('image/');
      });
      if (data.hasOwnProperty('text/html')) {
        mime = 'text/html';
      } else if (data.hasOwnProperty('image/svg+xml')) {
        mime = 'image/svg+xml';
      } else if (!(imageMimes.length === 0)) {
        mime = imageMimes[0];
      } else if (data.hasOwnProperty('text/markdown')) {
        mime = 'text/markdown';
      } else if (data.hasOwnProperty('application/pdf')) {
        mime = 'application/pdf';
      } else if (data.hasOwnProperty('text/latex')) {
        mime = 'text/latex';
      } else if (data.hasOwnProperty('text/plain')) {
        mime = 'text/plain';
      }
      return mime;
    };

    Kernel.prototype._parseErrorIOMessage = function(message) {
      var msg_type, result;
      msg_type = message.header.msg_type;
      if (msg_type === 'error' || msg_type === 'pyerr') {
        result = this._parseErrorMessage(message);
      }
      return result;
    };

    Kernel.prototype._parseErrorMessage = function(message) {
      var ename, err, errorString, evalue, result, _ref, _ref1;
      try {
        errorString = message.content.traceback.join('\n');
      } catch (_error) {
        err = _error;
        ename = (_ref = message.content.ename) != null ? _ref : '';
        evalue = (_ref1 = message.content.evalue) != null ? _ref1 : '';
        errorString = ename + ': ' + evalue;
      }
      result = {
        data: {
          'text/plain': errorString
        },
        type: 'text',
        stream: 'error'
      };
      return result;
    };

    Kernel.prototype._parseStreamIOMessage = function(message) {
      var result, _ref, _ref1, _ref2;
      if (message.header.msg_type === 'stream') {
        result = {
          data: {
            'text/plain': (_ref = message.content.text) != null ? _ref : message.content.data
          },
          type: 'text',
          stream: message.content.name
        };
      } else if (message.idents === 'stdout' || message.idents === 'stream.stdout' || message.content.name === 'stdout') {
        result = {
          data: {
            'text/plain': (_ref1 = message.content.text) != null ? _ref1 : message.content.data
          },
          type: 'text',
          stream: 'stdout'
        };
      } else if (message.idents === 'stderr' || message.idents === 'stream.stderr' || message.content.name === 'stderr') {
        result = {
          data: {
            'text/plain': (_ref2 = message.content.text) != null ? _ref2 : message.content.data
          },
          type: 'text',
          stream: 'stderr'
        };
      }
      if ((result != null ? result.data['text/plain'] : void 0) != null) {
        result.data['text/plain'] = result.data['text/plain'].trim();
      }
      return result;
    };

    Kernel.prototype.destroy = function() {
      console.log('Kernel: Destroying base kernel');
      if (this.pluginWrapper) {
        this.pluginWrapper.destroyed = true;
      }
      this.emitter.emit('did-destroy');
      return this.emitter.dispose();
    };

    return Kernel;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL01hcnZpbi8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIva2VybmVsLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxpR0FBQTs7QUFBQSxFQUFDLFVBQVcsT0FBQSxDQUFRLE1BQVIsRUFBWCxPQUFELENBQUE7O0FBQUEsRUFFQSxhQUFBLEdBQWdCLE9BQUEsQ0FBUSxlQUFSLENBRmhCLENBQUE7O0FBQUEsRUFHQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FIUCxDQUFBOztBQUFBLEVBS0EsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSLENBTEosQ0FBQTs7QUFBQSxFQU1BLEdBQUEsR0FBTSxPQUFBLENBQVEsS0FBUixDQU5OLENBQUE7O0FBQUEsRUFPQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FQUCxDQUFBOztBQUFBLEVBUUEsR0FBQSxHQUFNLEdBQUcsQ0FBQyxHQVJWLENBQUE7O0FBQUEsRUFVQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGVBQVIsQ0FWYixDQUFBOztBQUFBLEVBV0EsWUFBQSxHQUFlLE9BQUEsQ0FBUSxpQkFBUixDQVhmLENBQUE7O0FBQUEsRUFZQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSw4QkFBUixDQVpqQixDQUFBOztBQUFBLEVBY0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNXLElBQUEsZ0JBQUUsVUFBRixFQUFlLE9BQWYsR0FBQTtBQUNULE1BRFUsSUFBQyxDQUFBLGFBQUEsVUFDWCxDQUFBO0FBQUEsTUFEdUIsSUFBQyxDQUFBLFVBQUEsT0FDeEIsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLGNBQUQsR0FBa0IsRUFBbEIsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFlBQUQsR0FBb0IsSUFBQSxZQUFBLENBQWEsSUFBYixDQUZwQixDQUFBO0FBQUEsTUFHQSxJ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

//# sourceURL=/Users/Marvin/.atom/packages/Hydrogen/lib/kernel.coffee
