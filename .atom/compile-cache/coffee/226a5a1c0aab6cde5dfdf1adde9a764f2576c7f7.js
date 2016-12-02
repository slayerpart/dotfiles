(function() {
  var $$, AnsiFilter, HeaderView, ScriptOptionsView, ScriptView, View, linkPaths, stripAnsi, _, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  HeaderView = require('./header-view');

  ScriptOptionsView = require('./script-options-view');

  _ref = require('atom-space-pen-views'), View = _ref.View, $$ = _ref.$$;

  AnsiFilter = require('ansi-to-html');

  stripAnsi = require('strip-ansi');

  linkPaths = require('./link-paths');

  _ = require('underscore');

  module.exports = ScriptView = (function(_super) {
    __extends(ScriptView, _super);

    function ScriptView() {
      this.setHeaderAndShowExecutionTime = __bind(this.setHeaderAndShowExecutionTime, this);
      return ScriptView.__super__.constructor.apply(this, arguments);
    }

    ScriptView.results = "";

    ScriptView.content = function() {
      return this.div((function(_this) {
        return function() {
          var css;
          _this.subview('headerView', new HeaderView());
          css = 'tool-panel panel panel-bottom padding script-view native-key-bindings';
          return _this.div({
            "class": css,
            outlet: 'script',
            tabindex: -1
          }, function() {
            return _this.div({
              "class": 'panel-body padded output',
              outlet: 'output'
            });
          });
        };
      })(this));
    };

    ScriptView.prototype.initialize = function(serializeState) {
      this.ansiFilter = new AnsiFilter;
      return linkPaths.listen(this);
    };

    ScriptView.prototype.serialize = function() {};

    ScriptView.prototype.setHeaderAndShowExecutionTime = function(returnCode, executionTime) {
      this.display('stdout', '[Finished in ' + executionTime.toString() + 's]');
      if (returnCode === 0) {
        return this.setHeaderStatus('stop');
      } else {
        return this.setHeaderStatus('err');
      }
    };

    ScriptView.prototype.resetView = function(title) {
      if (title == null) {
        title = 'Loading...';
      }
      if (!this.hasParent()) {
        atom.workspace.addBottomPanel({
          item: this
        });
      }
      this.stop();
      this.headerView.title.text(title);
      this.headerView.setStatus('start');
      this.output.empty();
      return this.results = "";
    };

    ScriptView.prototype.close = function() {
      var grandParent;
      this.stop();
      if (this.hasParent()) {
        grandParent = this.script.parent().parent();
        this.detach();
        return grandParent.remove();
      }
    };

    ScriptView.prototype.stop = function() {
      this.display('stdout', '^C');
      return this.headerView.setStatus('kill');
    };

    ScriptView.prototype.createGitHubIssueLink = function(argType, lang) {
      var body, encodedURI, err, title;
      title = "Add " + argType + " support for " + lang;
      body = "##### Platform: `" + process.platform + "`\n---";
      encodedURI = encodeURI("https://github.com/rgbkrk/atom-script/issues/new?title=" + title + "&body=" + body);
      encodedURI = encodedURI.replace(/#/g, '%23');
      err = $$(function() {
        this.p({
          "class": 'block'
        }, "" + argType + " runner not available for " + lang + ".");
        return this.p({
          "class": 'block'
        }, (function(_this) {
          return function() {
            _this.text('If it should exist, add an ');
            _this.a({
              href: encodedURI
            }, 'issue on GitHub');
            return _this.text(', or send your own pull request.');
          };
        })(this));
      });
      return this.handleError(err);
    };

    ScriptView.prototype.showUnableToRunError = function(command) {
      return this.output.append($$(function() {
        this.h1('Unable to run');
        this.pre(_.escape(command));
        this.h2('Did you start Atom from the command line?');
        this.pre('  atom .');
        this.h2('Is it in your PATH?');
        return this.pre("PATH: " + (_.escape(process.env.PATH)));
      }));
    };

    ScriptView.prototype.showNoLanguageSpecified = function() {
      var err;
      err = $$(function() {
        return this.p('You must select a language in the lower right, or save the file with an appropriate extension.');
      });
      return this.handleError(err);
    };

    ScriptView.prototype.showLanguageNotSupported = function(lang) {
      var err;
      err = $$(function() {
        this.p({
          "class": 'block'
        }, "Command not configured for " + lang + "!");
        return this.p({
          "class": 'block'
        }, (function(_this) {
          return function() {
            _this.text('Add an ');
            _this.a({
              href: "https://github.com/rgbkrk/atom-script/issues/new?title=Add%20support%20for%20" + lang
            }, 'issue on GitHub');
            return _this.text(' or send your own Pull Request.');
          };
        })(this));
      });
      return this.handleError(err);
    };

    ScriptView.prototype.handleError = function(err) {
      this.headerView.title.text('Error');
      this.headerView.setStatus('err');
      this.output.append(err);
      return this.stop();
    };

    ScriptView.prototype.setHeaderStatus = function(status) {
      return this.headerView.setStatus(status);
    };

    ScriptView.prototype.setHeaderTitle = function(title) {
      return this.headerView.title.text(title);
    };

    ScriptView.prototype.display = function(css, line) {
      var lessThanFull, padding, scrolledToEnd;
      this.results += line;
      if (atom.config.get('script.escapeConsoleOutput')) {
        line = _.escape(line);
      }
      line = this.ansiFilter.toHtml(line);
      line = linkPaths(line);
      padding = parseInt(this.output.css('padding-bottom'));
      scrolledToEnd = this.script.scrollBottom() === (padding + this.output.trueHeight());
      lessThanFull = this.output.trueHeight() <= this.script.trueHeight();
      this.output.append($$(function() {
        return this.pre({
          "class": "line " + css
        }, (function(_this) {
          return function() {
            return _this.raw(line);
          };
        })(this));
      }));
      if (atom.config.get('script.scrollWithOutput')) {
        if (lessThanFull || scrolledToEnd) {
          return this.checkScrollAgain(5)();
        }
      }
    };

    ScriptView.prototype.scrollTimeout = null;

    ScriptView.prototype.checkScrollAgain = function(times) {
      return (function(_this) {
        return function() {
          _this.script.scrollToBottom();
          clearTimeout(_this.scrollTimeout);
          if (times > 1) {
            return _this.scrollTimeout = setTimeout(_this.checkScrollAgain(times - 1), 50);
          }
        };
      })(this);
    };

    ScriptView.prototype.copyResults = function() {
      if (this.results) {
        return atom.clipboard.write(stripAnsi(this.results));
      }
    };

    return ScriptView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL01hcnZpbi8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL3NjcmlwdC12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw4RkFBQTtJQUFBOzttU0FBQTs7QUFBQSxFQUFBLFVBQUEsR0FBYSxPQUFBLENBQVEsZUFBUixDQUFiLENBQUE7O0FBQUEsRUFDQSxpQkFBQSxHQUFvQixPQUFBLENBQVEsdUJBQVIsQ0FEcEIsQ0FBQTs7QUFBQSxFQUdBLE9BQWEsT0FBQSxDQUFRLHNCQUFSLENBQWIsRUFBQyxZQUFBLElBQUQsRUFBTyxVQUFBLEVBSFAsQ0FBQTs7QUFBQSxFQUtBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUixDQUxiLENBQUE7O0FBQUEsRUFNQSxTQUFBLEdBQVksT0FBQSxDQUFRLFlBQVIsQ0FOWixDQUFBOztBQUFBLEVBT0EsU0FBQSxHQUFZLE9BQUEsQ0FBUSxjQUFSLENBUFosQ0FBQTs7QUFBQSxFQVFBLENBQUEsR0FBSSxPQUFBLENBQVEsWUFBUixDQVJKLENBQUE7O0FBQUEsRUFXQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osaUNBQUEsQ0FBQTs7Ozs7S0FBQTs7QUFBQSxJQUFBLFVBQUMsQ0FBQSxPQUFELEdBQVUsRUFBVixDQUFBOztBQUFBLElBRUEsVUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDSCxjQUFBLEdBQUE7QUFBQSxVQUFBLEtBQUMsQ0FBQSxPQUFELENBQVMsWUFBVCxFQUEyQixJQUFBLFVBQUEsQ0FBQSxDQUEzQixDQUFBLENBQUE7QUFBQSxVQUdBLEdBQUEsR0FBTSx1RUFITixDQUFBO2lCQUtBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZ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

//# sourceURL=/Users/Marvin/.atom/packages/script/lib/script-view.coffee
