(function() {
  var AutocompleteProvider, CodeManager, CompositeDisposable, Config, Emitter, Hydrogen, HydrogenProvider, Inspector, KernelManager, KernelPicker, ResultView, SignalListView, WSKernelPicker, _, _ref;

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Emitter = _ref.Emitter;

  _ = require('lodash');

  ResultView = require('./result-view');

  SignalListView = require('./signal-list-view');

  KernelPicker = require('./kernel-picker');

  WSKernelPicker = require('./ws-kernel-picker');

  CodeManager = require('./code-manager');

  Config = require('./config');

  KernelManager = require('./kernel-manager');

  Inspector = require('./inspector');

  AutocompleteProvider = require('./autocomplete-provider');

  HydrogenProvider = require('./plugin-api/hydrogen-provider');

  module.exports = Hydrogen = {
    config: Config.schema,
    subscriptions: null,
    kernelManager: null,
    inspector: null,
    editor: null,
    kernel: null,
    markerBubbleMap: null,
    statusBarElement: null,
    statusBarTile: null,
    watchSidebar: null,
    watchSidebarIsVisible: false,
    activate: function(state) {
      this.emitter = new Emitter();
      this.kernelManager = new KernelManager();
      this.codeManager = new CodeManager();
      this.inspector = new Inspector(this.kernelManager, this.codeManager);
      this.markerBubbleMap = {};
      this.statusBarElement = document.createElement('div');
      this.statusBarElement.classList.add('hydrogen');
      this.statusBarElement.classList.add('status-container');
      this.statusBarElement.onclick = this.showKernelCommands.bind(this);
      this.onEditorChanged(atom.workspace.getActiveTextEditor());
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add('atom-text-editor', {
        'hydrogen:run': (function(_this) {
          return function() {
            return _this.run();
          };
        })(this),
        'hydrogen:run-all': (function(_this) {
          return function() {
            return _this.runAll();
          };
        })(this),
        'hydrogen:run-all-above': (function(_this) {
          return function() {
            return _this.runAllAbove();
          };
        })(this),
        'hydrogen:run-and-move-down': (function(_this) {
          return function() {
            return _this.run(true);
          };
        })(this),
        'hydrogen:run-cell': (function(_this) {
          return function() {
            return _this.runCell();
          };
        })(this),
        'hydrogen:run-cell-and-move-down': (function(_this) {
          return function() {
            return _this.runCell(true);
          };
        })(this),
        'hydrogen:toggle-watches': (function(_this) {
          return function() {
            return _this.toggleWatchSidebar();
          };
        })(this),
        'hydrogen:select-kernel': (function(_this) {
          return function() {
            return _this.showKernelPicker();
          };
        })(this),
        'hydrogen:connect-to-remote-kernel': (function(_this) {
          return function() {
            return _this.showWSKernelPicker();
          };
        })(this),
        'hydrogen:add-watch': (function(_this) {
          return function() {
            var _ref1;
            if (!_this.watchSidebarIsVisible) {
              _this.toggleWatchSidebar();
            }
            return (_ref1 = _this.watchSidebar) != null ? _ref1.addWatchFromEditor() : void 0;
          };
        })(this),
        'hydrogen:remove-watch': (function(_this) {
          return function() {
            var _ref1;
            if (!_this.watchSidebarIsVisible) {
              _this.toggleWatchSidebar();
            }
            return (_ref1 = _this.watchSidebar) != null ? _ref1.removeWatch() : void 0;
          };
        })(this),
        'hydrogen:update-kernels': (function(_this) {
          return function() {
            return _this.kernelManager.updateKernelSpecs();
          };
        })(this),
        'hydrogen:toggle-inspector': (function(_this) {
          return function() {
            return _this.inspector.toggle();
          };
        })(this),
        'hydrogen:interrupt-kernel': (function(_this) {
          return function() {
            return _this.handleKernelCommand({
              command: 'interrupt-kernel'
            });
          };
        })(this),
        'hydrogen:restart-kernel': (function(_this) {
          return function() {
            return _this.handleKernelCommand({
              command: 'restart-kernel'
            });
          };
        })(this),
        'hydrogen:shutdown-kernel': (function(_this) {
          return function() {
            return _this.handleKernelCommand({
              command: 'shutdown-kernel'
            });
          };
        })(this),
        'hydrogen:copy-path-to-connection-file': (function(_this) {
          return function() {
            return _this.copyPathToConnectionFile();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'hydrogen:clear-results': (function(_this) {
          return function() {
            return _this.clearResultBubbles();
          };
        })(this)
      }));
      this.subscriptions.add(atom.workspace.observeActivePaneItem((function(_this) {
        return function(item) {
          if (item && item === atom.workspace.getActiveTextEditor()) {
            return _this.onEditorChanged(item);
          }
        };
      })(this)));
      return this.hydrogenProvider = null;
    },
    deactivate: function() {
      this.subscriptions.dispose();
      this.kernelManager.destroy();
      return this.statusBarTile.destroy();
    },
    provideHydrogen: function() {
      if (this.hydrogenProvider == null) {
        this.hydrogenProvider = new HydrogenProvider(this);
      }
      return this.hydrogenProvider;
    },
    consumeStatusBar: function(statusBar) {
      return this.statusBarTile = statusBar.addLeftTile({
        item: this.statusBarElement,
        priority: 100
      });
    },
    provide: function() {
      if (atom.config.get('Hydrogen.autocomplete') === true) {
        return AutocompleteProvider(this.kernelManager);
      }
    },
    onEditorChanged: function(editor) {
      var grammar, kernel, language;
      this.editor = editor;
      if (this.editor) {
        grammar = this.editor.getGrammar();
        language = this.kernelManager.getLanguageFor(grammar);
        kernel = this.kernelManager.getRunningKernelFor(language);
        this.codeManager.editor = this.editor;
      }
      if (this.kernel !== kernel) {
        return this.onKernelChanged(kernel);
      }
    },
    onKernelChanged: function(kernel) {
      this.kernel = kernel;
      this.setStatusBar();
      this.setWatchSidebar(this.kernel);
      return this.emitter.emit('did-change-kernel', this.kernel);
    },
    setStatusBar: function() {
      if (this.statusBarElement == null) {
        console.error('setStatusBar: there is no status bar');
        return;
      }
      this.clearStatusBar();
      if (this.kernel != null) {
        return this.statusBarElement.appendChild(this.kernel.statusView.element);
      }
    },
    clearStatusBar: function() {
      var _results;
      if (this.statusBarElement == null) {
        console.error('clearStatusBar: there is no status bar');
        return;
      }
      _results = [];
      while (this.statusBarElement.hasChildNodes()) {
        _results.push(this.statusBarElement.removeChild(this.statusBarElement.lastChild));
      }
      return _results;
    },
    setWatchSidebar: function(kernel) {
      var sidebar, _ref1, _ref2;
      console.log('setWatchSidebar:', kernel);
      sidebar = kernel != null ? kernel.watchSidebar : void 0;
      if (this.watchSidebar === sidebar) {
        return;
      }
      if ((_ref1 = this.watchSidebar) != null ? _ref1.visible : void 0) {
        this.watchSidebar.hide();
      }
      this.watchSidebar = sidebar;
      if (this.watchSidebarIsVisible) {
        return (_ref2 = this.watchSidebar) != null ? _ref2.show() : void 0;
      }
    },
    toggleWatchSidebar: function() {
      var _ref1, _ref2;
      if (this.watchSidebarIsVisible) {
        console.log('toggleWatchSidebar: hiding sidebar');
        this.watchSidebarIsVisible = false;
        return (_ref1 = this.watchSidebar) != null ? _ref1.hide() : void 0;
      } else {
        console.log('toggleWatchSidebar: showing sidebar');
        this.watchSidebarIsVisible = true;
        return (_ref2 = this.watchSidebar) != null ? _ref2.show() : void 0;
      }
    },
    showKernelCommands: function() {
      if (this.signalListView == null) {
        this.signalListView = new SignalListView(this.kernelManager);
        this.signalListView.onConfirmed = (function(_this) {
          return function(kernelCommand) {
            return _this.handleKernelCommand(kernelCommand);
          };
        })(this);
      }
      return this.signalListView.toggle();
    },
    handleKernelCommand: function(_arg) {
      var command, grammar, kernel, kernelSpec, language, message;
      kernel = _arg.kernel, command = _arg.command, grammar = _arg.grammar, language = _arg.language, kernelSpec = _arg.kernelSpec;
      console.log('handleKernelCommand:', arguments);
      if (!grammar) {
        grammar = this.editor.getGrammar();
      }
      if (!language) {
        language = this.kernelManager.getLanguageFor(grammar);
      }
      if (!kernel) {
        kernel = this.kernelManager.getRunningKernelFor(language);
      }
      if (!kernel) {
        message = "No running kernel for language `" + language + "` found";
        atom.notifications.addError(message);
        return;
      }
      if (command === 'interrupt-kernel') {
        return kernel.interrupt();
      } else if (command === 'restart-kernel') {
        this.clearResultBubbles();
        return this.kernelManager.restartRunningKernelFor(grammar, (function(_this) {
          return function(kernel) {
            return _this.onKernelChanged(kernel);
          };
        })(this));
      } else if (command === 'shutdown-kernel') {
        this.clearResultBubbles();
        kernel.shutdown();
        this.kernelManager.destroyRunningKernelFor(grammar);
        return this.onKernelChanged();
      } else if (command === 'switch-kernel') {
        this.clearResultBubbles();
        this.kernelManager.destroyRunningKernelFor(grammar);
        return this.kernelManager.startKernel(kernelSpec, grammar, (function(_this) {
          return function(kernel) {
            return _this.onKernelChanged(kernel);
          };
        })(this));
      } else if (command === 'rename-kernel') {
        return typeof kernel.promptRename === "function" ? kernel.promptRename() : void 0;
      } else if (command === 'disconnect-kernel') {
        this.clearResultBubbles();
        this.kernelManager.destroyRunningKernelFor(grammar);
        return this.onKernelChanged();
      }
    },
    createResultBubble: function(code, row) {
      if (this.kernel) {
        this._createResultBubble(this.kernel, code, row);
        return;
      }
      return this.kernelManager.startKernelFor(this.editor.getGrammar(), (function(_this) {
        return function(kernel) {
          _this.onKernelChanged(kernel);
          return _this._createResultBubble(kernel, code, row);
        };
      })(this));
    },
    _createResultBubble: function(kernel, code, row) {
      var view;
      if (this.watchSidebar.element.contains(document.activeElement)) {
        this.watchSidebar.run();
        return;
      }
      this.clearBubblesOnRow(row);
      view = this.insertResultBubble(row);
      return kernel.execute(code, function(result) {
        view.spin(false);
        return view.addResult(result);
      });
    },
    insertResultBubble: function(row) {
      var buffer, element, lineHeight, lineLength, marker, view;
      buffer = this.editor.getBuffer();
      lineLength = buffer.lineLengthForRow(row);
      marker = this.editor.markBufferPosition({
        row: row,
        column: lineLength
      }, {
        invalidate: 'touch'
      });
      view = new ResultView(marker);
      view.spin(true);
      element = view.element;
      lineHeight = this.editor.getLineHeightInPixels();
      view.spinner.setAttribute('style', "width: " + (lineHeight + 2) + "px; height: " + (lineHeight - 4) + "px;");
      view.statusContainer.setAttribute('style', "height: " + lineHeight + "px");
      element.setAttribute('style', "margin-left: " + (lineLength + 1) + "ch; margin-top: -" + lineHeight + "px");
      this.editor.decorateMarker(marker, {
        type: 'block',
        item: element,
        position: 'after'
      });
      this.markerBubbleMap[marker.id] = view;
      marker.onDidChange((function(_this) {
        return function(event) {
          console.log('marker.onDidChange:', marker);
          if (!event.isValid) {
            view.destroy();
            marker.destroy();
            return delete _this.markerBubbleMap[marker.id];
          } else {
            if (!element.classList.contains('multiline')) {
              lineLength = marker.getStartBufferPosition()['column'];
              return element.setAttribute('style', "margin-left: " + (lineLength + 1) + "ch; margin-top: -" + lineHeight + "px");
            }
          }
        };
      })(this));
      return view;
    },
    clearResultBubbles: function() {
      _.forEach(this.markerBubbleMap, function(bubble) {
        return bubble.destroy();
      });
      return this.markerBubbleMap = {};
    },
    clearBubblesOnRow: function(row) {
      console.log('clearBubblesOnRow:', row);
      return _.forEach(this.markerBubbleMap, (function(_this) {
        return function(bubble) {
          var marker, range;
          marker = bubble.marker;
          range = marker.getBufferRange();
          if ((range.start.row <= row && row <= range.end.row)) {
            console.log('clearBubblesOnRow:', row, bubble);
            bubble.destroy();
            return delete _this.markerBubbleMap[marker.id];
          }
        };
      })(this));
    },
    run: function(moveDown) {
      var code, codeBlock, row;
      if (moveDown == null) {
        moveDown = false;
      }
      codeBlock = this.codeManager.findCodeBlock();
      if (codeBlock == null) {
        return;
      }
      code = codeBlock[0], row = codeBlock[1];
      if ((code != null) && (row != null)) {
        if (moveDown === true) {
          this.codeManager.moveDown(row);
        }
        return this.createResultBubble(code, row);
      }
    },
    runAll: function() {
      if (this.kernel) {
        this._runAll(this.kernel);
        return;
      }
      return this.kernelManager.startKernelFor(this.editor.getGrammar(), (function(_this) {
        return function(kernel) {
          _this.onKernelChanged(kernel);
          return _this._runAll(kernel);
        };
      })(this));
    },
    _runAll: function(kernel) {
      var breakpoints, code, end, endRow, i, start, _i, _ref1, _results;
      breakpoints = this.codeManager.getBreakpoints();
      _results = [];
      for (i = _i = 1, _ref1 = breakpoints.length; 1 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 1 <= _ref1 ? ++_i : --_i) {
        start = breakpoints[i - 1];
        end = breakpoints[i];
        code = this.codeManager.getTextInRange(start, end);
        endRow = this.codeManager.escapeBlankRows(start.row, end.row);
        _results.push(this._createResultBubble(kernel, code, endRow));
      }
      return _results;
    },
    runAllAbove: function() {
      var code, cursor, row;
      cursor = this.editor.getLastCursor();
      row = this.codeManager.escapeBlankRows(0, cursor.getBufferRow());
      code = this.codeManager.getRows(0, row);
      if ((code != null) && (row != null)) {
        return this.createResultBubble(code, row);
      }
    },
    runCell: function(moveDown) {
      var code, end, endRow, start, _ref1;
      if (moveDown == null) {
        moveDown = false;
      }
      _ref1 = this.codeManager.getCurrentCell(), start = _ref1[0], end = _ref1[1];
      code = this.codeManager.getTextInRange(start, end);
      endRow = this.codeManager.escapeBlankRows(start.row, end.row);
      if (code != null) {
        if (moveDown === true) {
          this.codeManager.moveDown(endRow);
        }
        return this.createResultBubble(code, endRow);
      }
    },
    showKernelPicker: function() {
      if (this.kernelPicker == null) {
        this.kernelPicker = new KernelPicker((function(_this) {
          return function(callback) {
            var grammar, language;
            grammar = _this.editor.getGrammar();
            language = _this.kernelManager.getLanguageFor(grammar);
            return _this.kernelManager.getAllKernelSpecsFor(language, function(kernelSpecs) {
              return callback(kernelSpecs);
            });
          };
        })(this));
        this.kernelPicker.onConfirmed = (function(_this) {
          return function(_arg) {
            var kernelSpec;
            kernelSpec = _arg.kernelSpec;
            return _this.handleKernelCommand({
              command: 'switch-kernel',
              kernelSpec: kernelSpec
            });
          };
        })(this);
      }
      return this.kernelPicker.toggle();
    },
    showWSKernelPicker: function() {
      var grammar, language;
      if (this.wsKernelPicker == null) {
        this.wsKernelPicker = new WSKernelPicker((function(_this) {
          return function(kernel) {
            var grammar;
            _this.clearResultBubbles();
            grammar = kernel.grammar;
            _this.kernelManager.destroyRunningKernelFor(grammar);
            _this.kernelManager.setRunningKernelFor(grammar, kernel);
            return _this.onKernelChanged(kernel);
          };
        })(this));
      }
      grammar = this.editor.getGrammar();
      language = this.kernelManager.getLanguageFor(grammar);
      return this.wsKernelPicker.toggle(grammar, (function(_this) {
        return function(kernelSpec) {
          return _this.kernelManager.kernelSpecProvidesLanguage(kernelSpec, language);
        };
      })(this));
    },
    copyPathToConnectionFile: function() {
      var connectionFile, description, grammar, language, message;
      grammar = this.editor.getGrammar();
      language = this.kernelManager.getLanguageFor(grammar);
      if (this.kernel == null) {
        message = "No running kernel for language `" + language + "` found";
        atom.notifications.addError(message);
        return;
      }
      connectionFile = this.kernel.connectionFile;
      if (connectionFile == null) {
        atom.notifications.addError("No connection file for " + this.kernel.kernelSpec.display_name + " kernel found");
        return;
      }
      atom.clipboard.write(connectionFile);
      message = 'Path to connection file copied to clipboard.';
      description = "Use `jupyter console --existing " + connectionFile + "` to connect to the running kernel.";
      return atom.notifications.addSuccess(message, {
        description: description
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL01hcnZpbi8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvbWFpbi5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFDQTtBQUFBLE1BQUEsZ01BQUE7O0FBQUEsRUFBQSxPQUFpQyxPQUFBLENBQVEsTUFBUixDQUFqQyxFQUFDLDJCQUFBLG1CQUFELEVBQXNCLGVBQUEsT0FBdEIsQ0FBQTs7QUFBQSxFQUVBLENBQUEsR0FBSSxPQUFBLENBQVEsUUFBUixDQUZKLENBQUE7O0FBQUEsRUFJQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGVBQVIsQ0FKYixDQUFBOztBQUFBLEVBS0EsY0FBQSxHQUFpQixPQUFBLENBQVEsb0JBQVIsQ0FMakIsQ0FBQTs7QUFBQSxFQU1BLFlBQUEsR0FBZSxPQUFBLENBQVEsaUJBQVIsQ0FOZixDQUFBOztBQUFBLEVBT0EsY0FBQSxHQUFpQixPQUFBLENBQVEsb0JBQVIsQ0FQakIsQ0FBQTs7QUFBQSxFQVFBLFdBQUEsR0FBYyxPQUFBLENBQVEsZ0JBQVIsQ0FSZCxDQUFBOztBQUFBLEVBVUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSLENBVlQsQ0FBQTs7QUFBQSxFQVdBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLGtCQUFSLENBWGhCLENBQUE7O0FBQUEsRUFZQSxTQUFBLEdBQVksT0FBQSxDQUFRLGFBQVIsQ0FaWixDQUFBOztBQUFBLEVBYUEsb0JBQUEsR0FBdUIsT0FBQSxDQUFRLHlCQUFSLENBYnZCLENBQUE7O0FBQUEsRUFlQSxnQkFBQSxHQUFtQixPQUFBLENBQVEsZ0NBQVIsQ0FmbkIsQ0FBQTs7QUFBQSxFQWlCQSxNQUFNLENBQUMsT0FBUCxHQUFpQixRQUFBLEdBQ2I7QUFBQSxJQUFBLE1BQUEsRUFBUSxNQUFNLENBQUMsTUFBZjtBQUFBLElBQ0EsYUFBQSxFQUFlLElBRGY7QUFBQSxJQUdBLGFB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

//# sourceURL=/Users/Marvin/.atom/packages/Hydrogen/lib/main.coffee
