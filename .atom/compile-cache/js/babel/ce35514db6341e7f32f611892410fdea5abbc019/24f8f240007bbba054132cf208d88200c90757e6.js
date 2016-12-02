Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

exports.activate = activate;
exports.deactivate = deactivate;
exports.provideLinter = provideLinter;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

/**
 * Note that this can't be loaded lazily as `atom` doesn't export it correctly
 * for that, however as this comes from app.asar it is pre-compiled and is
 * essentially "free" as there is no expensive compilation step.
 */
// eslint-disable-next-line import/extensions

var _atom = require('atom');

'use babel';

var lazyReq = require('lazy-req')(require);

var _lazyReq = lazyReq('path')('dirname');

var dirname = _lazyReq.dirname;

var stylelint = lazyReq('stylelint');

var _lazyReq2 = lazyReq('atom-linter')('rangeFromLineNumber');

var rangeFromLineNumber = _lazyReq2.rangeFromLineNumber;

var assignDeep = lazyReq('assign-deep');
var escapeHTML = lazyReq('escape-html');

// Settings
var useStandard = undefined;
var presetConfig = undefined;
var disableWhenNoConfig = undefined;
var showIgnored = undefined;

// Internal vars
var subscriptions = undefined;
var baseScopes = ['source.css', 'source.scss', 'source.css.scss', 'source.less', 'source.css.less', 'source.css.postcss', 'source.css.postcss.sugarss'];

function startMeasure(baseName) {
  performance.mark(baseName + '-start');
}

function endMeasure(baseName) {
  if (atom.inDevMode()) {
    performance.mark(baseName + '-end');
    performance.measure(baseName, baseName + '-start', baseName + '-end');
    // eslint-disable-next-line no-console
    console.log(baseName + ' took: ', performance.getEntriesByName(baseName)[0].duration);
    performance.clearMarks(baseName + '-end');
    performance.clearMeasures(baseName);
  }
  performance.clearMarks(baseName + '-start');
}

function createRange(editor, data) {
  if (!Object.hasOwnProperty.call(data, 'line') && !Object.hasOwnProperty.call(data, 'column')) {
    // data.line & data.column might be undefined for non-fatal invalid rules,
    // e.g.: "block-no-empty": "foo"
    // Return `false` so Linter will ignore the range
    return false;
  }

  return rangeFromLineNumber(editor, data.line - 1, data.column - 1);
}

function activate() {
  startMeasure('linter-stylelint: Activation');
  require('atom-package-deps').install('linter-stylelint');

  subscriptions = new _atom.CompositeDisposable();

  subscriptions.add(atom.config.observe('linter-stylelint.useStandard', function (value) {
    useStandard = value;
  }));
  subscriptions.add(atom.config.observe('linter-stylelint.disableWhenNoConfig', function (value) {
    disableWhenNoConfig = value;
  }));
  subscriptions.add(atom.config.observe('linter-stylelint.showIgnored', function (value) {
    showIgnored = value;
  }));

  endMeasure('linter-stylelint: Activation');
}

function deactivate() {
  subscriptions.dispose();
}

function generateHTMLMessage(message) {
  if (!message.rule || message.rule === 'CssSyntaxError') {
    return escapeHTML()(message.text);
  }

  var ruleParts = message.rule.split('/');
  var url = undefined;

  if (ruleParts.length === 1) {
    // Core rule
    url = 'http://stylelint.io/user-guide/rules/' + ruleParts[0];
  } else {
    // Plugin rule
    var pluginName = ruleParts[0];
    // const ruleName = ruleParts[1];

    switch (pluginName) {
      case 'plugin':
        url = 'https://github.com/AtomLinter/linter-stylelint/tree/master/docs/noRuleNamespace.md';
        break;
      default:
        url = 'https://github.com/AtomLinter/linter-stylelint/tree/master/docs/linkingNewRule.md';
    }
  }

  // Escape any HTML in the message, and replace the rule ID with a link
  return escapeHTML()(message.text).replace('(' + message.rule + ')', '(<a href="' + url + '">' + message.rule + '</a>)');
}

var parseResults = function parseResults(editor, options, results, filePath) {
  startMeasure('linter-stylelint: Parsing results');
  if (options.code !== editor.getText()) {
    // The editor contents have changed since the lint was requested, tell
    //   Linter not to update the results
    endMeasure('linter-stylelint: Parsing results');
    endMeasure('linter-stylelint: Lint');
    return null;
  }

  if (!results) {
    endMeasure('linter-stylelint: Parsing results');
    endMeasure('linter-stylelint: Lint');
    return [];
  }

  var invalidOptions = results.invalidOptionWarnings.map(function (msg) {
    return {
      type: 'Error',
      severity: 'error',
      text: msg.text,
      filePath: filePath
    };
  });

  var warnings = results.warnings.map(function (warning) {
    // Stylelint only allows 'error' and 'warning' as severity values
    var severity = !warning.severity || warning.severity === 'error' ? 'Error' : 'Warning';
    return {
      type: severity,
      severity: severity.toLowerCase(),
      html: generateHTMLMessage(warning),
      filePath: filePath,
      range: createRange(editor, warning)
    };
  });

  var deprecations = results.deprecations.map(function (deprecation) {
    return {
      type: 'Warning',
      severity: 'warning',
      html: escapeHTML()(deprecation.text) + ' (<a href="' + deprecation.reference + '">reference</a>)',
      filePath: filePath
    };
  });

  var ignored = [];
  if (showIgnored && results.ignored) {
    ignored.push({
      type: 'Warning',
      severity: 'warning',
      text: 'This file is ignored',
      filePath: filePath
    });
  }

  var toReturn = [].concat(invalidOptions).concat(warnings).concat(deprecations).concat(ignored);

  endMeasure('linter-stylelint: Parsing results');
  endMeasure('linter-stylelint: Lint');
  return toReturn;
};

var runStylelint = _asyncToGenerator(function* (editor, options, filePath) {
  startMeasure('linter-stylelint: Stylelint');
  var data = undefined;
  try {
    data = yield stylelint().lint(options);
  } catch (error) {
    endMeasure('linter-stylelint: Stylelint');
    // Was it a code parsing error?
    if (error.line) {
      endMeasure('linter-stylelint: Lint');
      return [{
        type: 'Error',
        severity: 'error',
        text: error.reason || error.message,
        filePath: filePath,
        range: createRange(editor, error)
      }];
    }

    // If we got here, stylelint found something really wrong with the
    // configuration, such as extending an invalid configuration
    atom.notifications.addError('Unable to run stylelint', {
      detail: error.reason || error.message,
      dismissable: true
    });

    endMeasure('linter-stylelint: Lint');
    return [];
  }
  endMeasure('linter-stylelint: Stylelint');

  var results = data.results.shift();
  return parseResults(editor, options, results, filePath);
});

function provideLinter() {
  return {
    name: 'stylelint',
    grammarScopes: baseScopes,
    scope: 'file',
    lintOnFly: true,
    lint: _asyncToGenerator(function* (editor) {
      startMeasure('linter-stylelint: Lint');
      var scopes = editor.getLastCursor().getScopeDescriptor().getScopesArray();

      var filePath = editor.getPath();
      var text = editor.getText();

      if (!text) {
        endMeasure('linter-stylelint: Lint');
        return [];
      }

      // Require stylelint-config-standard if it hasn't already been loaded
      if (!presetConfig && useStandard) {
        presetConfig = require('stylelint-config-standard');
      }
      // Setup base config if useStandard() is true
      var defaultConfig = {
        rules: {}
      };

      // Base the config in the project directory

      var _atom$project$relativizePath = atom.project.relativizePath(filePath);

      var _atom$project$relativizePath2 = _slicedToArray(_atom$project$relativizePath, 1);

      var configBasedir = _atom$project$relativizePath2[0];

      if (configBasedir === null) {
        // Falling back to the file directory if no project is found
        configBasedir = dirname(filePath);
      }

      var rules = useStandard ? assignDeep()({}, presetConfig) : defaultConfig;

      var options = {
        code: text,
        codeFilename: filePath,
        config: rules,
        configBasedir: configBasedir
      };

      if (scopes.includes('source.css.scss') || scopes.includes('source.scss')) {
        options.syntax = 'scss';
      }
      if (scopes.includes('source.css.less') || scopes.includes('source.less')) {
        options.syntax = 'less';
      }
      if (scopes.includes('source.css.postcss.sugarss')) {
        options.syntax = 'sugarss';
        // `stylelint-config-standard` isn't fully compatible with SugarSS
        // See here for details:
        // https://github.com/stylelint/stylelint-config-standard#using-the-config-with-sugarss-syntax
        options.config.rules['block-closing-brace-empty-line-before'] = null;
        options.config.rules['block-closing-brace-newline-after'] = null;
        options.config.rules['block-closing-brace-newline-before'] = null;
        options.config.rules['block-closing-brace-space-before'] = null;
        options.config.rules['block-opening-brace-newline-after'] = null;
        options.config.rules['block-opening-brace-space-after'] = null;
        options.config.rules['block-opening-brace-space-before'] = null;
        options.config.rules['declaration-block-semicolon-newline-after'] = null;
        options.config.rules['declaration-block-semicolon-space-after'] = null;
        options.config.rules['declaration-block-semicolon-space-before'] = null;
        options.config.rules['declaration-block-trailing-semicolon'] = null;
        options.config.rules['declaration-block-trailing-semicolon'] = null;
      }

      startMeasure('linter-stylelint: Create Linter');
      var stylelintLinter = yield stylelint().createLinter();
      endMeasure('linter-stylelint: Create Linter');

      startMeasure('linter-stylelint: Config');
      var foundConfig = undefined;
      try {
        foundConfig = yield stylelintLinter.getConfigForFile(filePath);
      } catch (error) {
        if (!/No configuration provided for .+/.test(error.message)) {
          endMeasure('linter-stylelint: Config');
          // If we got here, stylelint failed to parse the configuration
          // there's no point of re-linting if useStandard is true, because the
          // user does not have the complete set of desired rules parsed
          atom.notifications.addError('Unable to parse stylelint configuration', {
            detail: error.message,
            dismissable: true
          });
          endMeasure('linter-stylelint: Lint');
          return [];
        }
      }
      endMeasure('linter-stylelint: Config');

      if (foundConfig) {
        options.config = assignDeep()(rules, foundConfig.config);
        options.configBasedir = dirname(foundConfig.filepath);
      }

      if (!foundConfig && disableWhenNoConfig) {
        endMeasure('linter-stylelint: Lint');
        return [];
      }

      startMeasure('linter-stylelint: Check ignored');
      var fileIsIgnored = undefined;
      try {
        fileIsIgnored = yield stylelintLinter.isPathIgnored(filePath);
      } catch (error) {
        // Do nothing, configuration errors should have already been caught and thrown above
      }
      endMeasure('linter-stylelint: Check ignored');

      if (fileIsIgnored) {
        endMeasure('linter-stylelint: Lint');
        if (showIgnored) {
          return [{
            type: 'Warning',
            severity: 'warning',
            text: 'This file is ignored',
            filePath: filePath
          }];
        }
        return [];
      }

      var results = yield runStylelint(editor, options, filePath);
      return results;
    })
  };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9NYXJ2aW4vLmF0b20vcGFja2FnZXMvbGludGVyLXN0eWxlbGludC9saWIvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztvQkFRb0MsTUFBTTs7QUFSMUMsV0FBVyxDQUFDOztBQVVaLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQzs7ZUFFekIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQzs7SUFBdEMsT0FBTyxZQUFQLE9BQU87O0FBQ2YsSUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDOztnQkFDUCxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMscUJBQXFCLENBQUM7O0lBQXJFLG1CQUFtQixhQUFuQixtQkFBbUI7O0FBQzNCLElBQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUMxQyxJQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7OztBQUcxQyxJQUFJLFdBQVcsWUFBQSxDQUFDO0FBQ2hCLElBQUksWUFBWSxZQUFBLENBQUM7QUFDakIsSUFBSSxtQkFBbUIsWUFBQSxDQUFDO0FBQ3hCLElBQUksV0FBVyxZQUFBLENBQUM7OztBQUdoQixJQUFJLGFBQWEsWUFBQSxDQUFDO0FBQ2xCLElBQU0sVUFBVSxHQUFHLENBQ2pCLFlBQVksRUFDWixhQUFhLEVBQ2IsaUJBQWlCLEVBQ2pCLGFBQWEsRUFDYixpQkFBaUIsRUFDakIsb0JBQW9CLEVBQ3BCLDRCQUE0QixDQUM3QixDQUFDOztBQUVGLFNBQVMsWUFBWSxDQUFDLFFBQVEsRUFBRTtBQUM5QixhQUFXLENBQUMsSUFBSSxDQUFJLFFBQVEsWUFBUyxDQUFDO0NBQ3ZDOztBQUVELFNBQVMsVUFBVSxDQUFDLFFBQVEsRUFBRTtBQUM1QixNQUFJLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRTtBQUNwQixlQUFXLENB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QUMsQ0FBQztBQUNyQyxlQUFPLEVBQUUsQ0FBQztPQUNYOztBQUVELGtCQUFZLENBQUMsaUNBQWlDLENBQUMsQ0FBQztBQUNoRCxVQUFJLGFBQWEsWUFBQSxDQUFDO0FBQ2xCLFVBQUk7QUFDRixxQkFBYSxHQUFHLE1BQU0sZUFBZSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztPQUMvRCxDQUFDLE9BQU8sS0FBSyxFQUFFOztPQUVmO0FBQ0QsZ0JBQVUsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDOztBQUU5QyxVQUFJLGFBQWEsRUFBRTtBQUNqQixrQkFBVSxDQUFDLHdCQUF3QixDQUFDLENBQUM7QUFDckMsWUFBSSxXQUFXLEVBQUU7QUFDZixpQkFBTyxDQUFDO0FBQ04sZ0JBQUksRUFBRSxTQUFTO0FBQ2Ysb0JBQVEsRUFBRSxTQUFTO0FBQ25CLGdCQUFJLEVBQUUsc0JBQXNCO0FBQzVCLG9CQUFRLEVBQVIsUUFBUTtXQUNULENBQUMsQ0FBQztTQUNKO0FBQ0QsZUFBTyxFQUFFLENBQUM7T0FDWDs7QUFFRCxVQUFNLE9BQU8sR0FBRyxNQUFNLFlBQVksQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQzlELGFBQU8sT0FBTyxDQUFDO0tBQ2hCLENBQUE7R0FDRixDQUFDO0NBQ0giLCJmaWxlIjoiL1VzZXJzL01hcnZpbi8uYXRvbS9wYWNrYWdlcy9saW50ZXItc3R5bGVsaW50L2xpYi9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG4vKipcbiAqIE5vdGUgdGhhdCB0aGlzIGNhbid0IGJlIGxvYWRlZCBsYXppbHkgYXMgYGF0b21gIGRvZXNuJ3QgZXhwb3J0IGl0IGNvcnJlY3RseVxuICogZm9yIHRoYXQsIGhvd2V2ZXIgYXMgdGhpcyBjb21lcyBmcm9tIGFwcC5hc2FyIGl0IGlzIHByZS1jb21waWxlZCBhbmQgaXNcbiAqIGVzc2VudGlhbGx5IFwiZnJlZVwiIGFzIHRoZXJlIGlzIG5vIGV4cGVuc2l2ZSBjb21waWxhdGlvbiBzdGVwLlxuICovXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L2V4dGVuc2lvbnNcbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJztcblxuY29uc3QgbGF6eVJlcSA9IHJlcXVpcmUoJ2xhenktcmVxJykocmVxdWlyZSk7XG5cbmNvbnN0IHsgZGlybmFtZSB9ID0gbGF6eVJlcSgncGF0aCcpKCdkaXJuYW1lJyk7XG5jb25zdCBzdHlsZWxpbnQgPSBsYXp5UmVxKCdzdHlsZWxpbnQnKTtcbmNvbnN0IHsgcmFuZ2VGcm9tTGluZU51bWJlciB9ID0gbGF6eVJlcSgnYXRvbS1saW50ZXInKSgncmFuZ2VGcm9tTGluZU51bWJlcicpO1xuY29uc3QgYXNzaWduRGVlcCA9IGxhenlSZXEoJ2Fzc2lnbi1kZWVwJyk7XG5jb25zdCBlc2NhcGVIVE1MID0gbGF6eVJlcSgnZXNjYXBlLWh0bWwnKTtcblxuLy8gU2V0dGluZ3NcbmxldCB1c2VTdGFuZGFyZDtcbmxldCBwcmVzZXRDb25maWc7XG5sZXQgZGlzYWJsZVdoZW5Ob0NvbmZpZztcbmxldCBzaG93SWdub3JlZDtcblxuLy8gSW50ZXJuYWwgdmFyc1xubGV0IHN1YnNjcmlwdGlvbnM7XG5jb25zdCBiYXNlU2NvcGVzID0gW1xuICAnc291cmNlLmNzcycsXG4gICdzb3VyY2Uuc2NzcycsXG4gICdzb3VyY2UuY3NzLnNjc3MnLFxuICAnc291cmNlLmxlc3MnLFxuICAnc291cmNlLmNzcy5sZXNzJyxcbiAgJ3NvdXJjZS5jc3MucG9zdGNzcycsXG4gICdzb3VyY2UuY3NzLnBvc3Rjc3Muc3VnYXJzcydcbl07XG5cbmZ1bmN0aW9uIHN0YXJ0TWVhc3VyZShiYXNlTmFtZSkge1xuICBwZXJmb3JtYW5jZS5tYXJrKGAke2Jhc2VOYW1lfS1zdGFydGApO1xufVxuXG5mdW5jdGlvbiBlbmRNZWFzdXJlKGJhc2VOYW1lKSB7XG4gIGlmIChhdG9tLmluRGV2TW9kZSgpKSB7XG4gICAgcGVyZm9ybWFuY2UubWFyayhgJHtiYXNlTmFtZX0tZW5kYCk7XG4gICAgcGVyZm9ybWFuY2UubWVhc3VyZShiYXNlTmFtZSwgYCR7YmFzZU5hbWV9LXN0YXJ0YCwgYCR7YmFzZU5hbWV9LWVuZGApO1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgY29uc29sZS5sb2coYCR7YmFzZU5hbWV9IHRvb2s6IGAsIHBlcmZvcm1hbmNlLmdldEVudHJpZXNCeU5hbWUoYmFzZU5hbWUpWzBdLmR1cmF0aW9uKTtcbiAgICBwZXJmb3JtYW5jZS5jbGVhck1hcmtzKGAke2Jhc2VOYW1lfS1lbmRgKTtcbiAgICBwZXJmb3JtYW5jZS5jbGVhck1lYXN1cmVzKGJhc2VOYW1lKTtcbiAgfVxuICBwZXJmb3JtYW5jZS5jbGVhck1hcmtzKGAke2Jhc2VOYW1lfS1zdGFydGApO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVSYW5nZShlZGl0b3IsIGRhdGEpIHtcbiAgaWYgKCFPYmplY3QuaGFzT3duUHJvcGVydHkuY2FsbChkYXRhLCAnbGluZScpICYmICFPYmplY3QuaGFzT3duUHJvcGVydHkuY2FsbChkYXRhLCAnY29sdW1uJykpIHtcbiAgICAvLyBkYXRhLmxpbmUgJiBkYXRhLmNvbHVtbiBtaWdodCBiZSB1bmRlZmluZWQgZm9yIG5vbi1mYXRhbCBpbnZhbGlkIHJ1bGVzLFxuICAgIC8vIGUuZy46IFwiYmxvY2stbm8tZW1wdHlcIjogXCJmb29cIlxuICAgIC8vIFJldHVybiBgZmFsc2VgIHNvIExpbnRlciB3aWxsIGlnbm9yZSB0aGUgcmFuZ2VcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gcmFuZ2VGcm9tTGluZU51bWJlcihlZGl0b3IsIGRhdGEubGluZSAtIDEsIGRhdGEuY29sdW1uIC0gMSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgc3RhcnRNZWFzdXJlKCdsaW50ZXItc3R5bGVsaW50OiBBY3RpdmF0aW9uJyk7XG4gIHJlcXVpcmUoJ2F0b20tcGFja2FnZS1kZXBzJykuaW5zdGFsbCgnbGludGVyLXN0eWxlbGludCcpO1xuXG4gIHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuXG4gIHN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1zdHlsZWxpbnQudXNlU3RhbmRhcmQnLCAodmFsdWUpID0+IHtcbiAgICB1c2VTdGFuZGFyZCA9IHZhbHVlO1xuICB9KSk7XG4gIHN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1zdHlsZWxpbnQuZGlzYWJsZVdoZW5Ob0NvbmZpZycsICh2YWx1ZSkgPT4ge1xuICAgIGRpc2FibGVXaGVuTm9Db25maWcgPSB2YWx1ZTtcbiAgfSkpO1xuICBzdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItc3R5bGVsaW50LnNob3dJZ25vcmVkJywgKHZhbHVlKSA9PiB7XG4gICAgc2hvd0lnbm9yZWQgPSB2YWx1ZTtcbiAgfSkpO1xuXG4gIGVuZE1lYXN1cmUoJ2xpbnRlci1zdHlsZWxpbnQ6IEFjdGl2YXRpb24nKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlYWN0aXZhdGUoKSB7XG4gIHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpO1xufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZUhUTUxNZXNzYWdlKG1lc3NhZ2UpIHtcbiAgaWYgKCFtZXNzYWdlLnJ1bGUgfHwgbWVzc2FnZS5ydWxlID09PSAnQ3NzU3ludGF4RXJyb3InKSB7XG4gICAgcmV0dXJuIGVzY2FwZUhUTUwoKShtZXNzYWdlLnRleHQpO1xuICB9XG5cbiAgY29uc3QgcnVsZVBhcnRzID0gbWVzc2FnZS5ydWxlLnNwbGl0KCcvJyk7XG4gIGxldCB1cmw7XG5cbiAgaWYgKHJ1bGVQYXJ0cy5sZW5ndGggPT09IDEpIHtcbiAgICAvLyBDb3JlIHJ1bGVcbiAgICB1cmwgPSBgaHR0cDovL3N0eWxlbGludC5pby91c2VyLWd1aWRlL3J1bGVzLyR7cnVsZVBhcnRzWzBdfWA7XG4gIH0gZWxzZSB7XG4gICAgLy8gUGx1Z2luIHJ1bGVcbiAgICBjb25zdCBwbHVnaW5OYW1lID0gcnVsZVBhcnRzWzBdO1xuICAgIC8vIGNvbnN0IHJ1bGVOYW1lID0gcnVsZVBhcnRzWzFdO1xuXG4gICAgc3dpdGNoIChwbHVnaW5OYW1lKSB7XG4gICAgICBjYXNlICdwbHVnaW4nOlxuICAgICAgICB1cmwgPSAnaHR0cHM6Ly9naXRodWIuY29tL0F0b21MaW50ZXIvbGludGVyLXN0eWxlbGludC90cmVlL21hc3Rlci9kb2NzL25vUnVsZU5hbWVzcGFjZS5tZCc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdXJsID0gJ2h0dHBzOi8vZ2l0aHViLmNvbS9BdG9tTGludGVyL2xpbnRlci1zdHlsZWxpbnQvdHJlZS9tYXN0ZXIvZG9jcy9saW5raW5nTmV3UnVsZS5tZCc7XG4gICAgfVxuICB9XG5cbiAgLy8gRXNjYXBlIGFueSBIVE1MIGluIHRoZSBtZXNzYWdlLCBhbmQgcmVwbGFjZSB0aGUgcnVsZSBJRCB3aXRoIGEgbGlua1xuICByZXR1cm4gZXNjYXBlSFRNTCgpKG1lc3NhZ2UudGV4dCkucmVwbGFjZShcbiAgICBgKCR7bWVzc2FnZS5ydWxlfSlgLCBgKDxhIGhyZWY9XCIke3VybH1cIj4ke21lc3NhZ2UucnVsZX08L2E+KWBcbiAgKTtcbn1cblxuY29uc3QgcGFyc2VSZXN1bHRzID0gKGVkaXRvciwgb3B0aW9ucywgcmVzdWx0cywgZmlsZVBhdGgpID0+IHtcbiAgc3RhcnRNZWFzdXJlKCdsaW50ZXItc3R5bGVsaW50OiBQYXJzaW5nIHJlc3VsdHMnKTtcbiAgaWYgKG9wdGlvbnMuY29kZSAhPT0gZWRpdG9yLmdldFRleHQoKSkge1xuICAgIC8vIFRoZSBlZGl0b3IgY29udGVudHMgaGF2ZSBjaGFuZ2VkIHNpbmNlIHRoZSBsaW50IHdhcyByZXF1ZXN0ZWQsIHRlbGxcbiAgICAvLyAgIExpbnRlciBub3QgdG8gdXBkYXRlIHRoZSByZXN1bHRzXG4gICAgZW5kTWVhc3VyZSgnbGludGVyLXN0eWxlbGludDogUGFyc2luZyByZXN1bHRzJyk7XG4gICAgZW5kTWVhc3VyZSgnbGludGVyLXN0eWxlbGludDogTGludCcpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgaWYgKCFyZXN1bHRzKSB7XG4gICAgZW5kTWVhc3VyZSgnbGludGVyLXN0eWxlbGludDogUGFyc2luZyByZXN1bHRzJyk7XG4gICAgZW5kTWVhc3VyZSgnbGludGVyLXN0eWxlbGludDogTGludCcpO1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGNvbnN0IGludmFsaWRPcHRpb25zID0gcmVzdWx0cy5pbnZhbGlkT3B0aW9uV2FybmluZ3MubWFwKG1zZyA9PiAoe1xuICAgIHR5cGU6ICdFcnJvcicsXG4gICAgc2V2ZXJpdHk6ICdlcnJvcicsXG4gICAgdGV4dDogbXNnLnRleHQsXG4gICAgZmlsZVBhdGhcbiAgfSkpO1xuXG4gIGNvbnN0IHdhcm5pbmdzID0gcmVzdWx0cy53YXJuaW5ncy5tYXAoKHdhcm5pbmcpID0+IHtcbiAgICAvLyBTdHlsZWxpbnQgb25seSBhbGxvd3MgJ2Vycm9yJyBhbmQgJ3dhcm5pbmcnIGFzIHNldmVyaXR5IHZhbHVlc1xuICAgIGNvbnN0IHNldmVyaXR5ID0gIXdhcm5pbmcuc2V2ZXJpdHkgfHwgd2FybmluZy5zZXZlcml0eSA9PT0gJ2Vycm9yJyA/ICdFcnJvcicgOiAnV2FybmluZyc7XG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6IHNldmVyaXR5LFxuICAgICAgc2V2ZXJpdHk6IHNldmVyaXR5LnRvTG93ZXJDYXNlKCksXG4gICAgICBodG1sOiBnZW5lcmF0ZUhUTUxNZXNzYWdlKHdhcm5pbmcpLFxuICAgICAgZmlsZVBhdGgsXG4gICAgICByYW5nZTogY3JlYXRlUmFuZ2UoZWRpdG9yLCB3YXJuaW5nKVxuICAgIH07XG4gIH0pO1xuXG4gIGNvbnN0IGRlcHJlY2F0aW9ucyA9IHJlc3VsdHMuZGVwcmVjYXRpb25zLm1hcChkZXByZWNhdGlvbiA9PiAoe1xuICAgIHR5cGU6ICdXYXJuaW5nJyxcbiAgICBzZXZlcml0eTogJ3dhcm5pbmcnLFxuICAgIGh0bWw6IGAke2VzY2FwZUhUTUwoKShkZXByZWNhdGlvbi50ZXh0KX0gKDxhIGhyZWY9XCIke2RlcHJlY2F0aW9uLnJlZmVyZW5jZX1cIj5yZWZlcmVuY2U8L2E+KWAsXG4gICAgZmlsZVBhdGhcbiAgfSkpO1xuXG4gIGNvbnN0IGlnbm9yZWQgPSBbXTtcbiAgaWYgKHNob3dJZ25vcmVkICYmIHJlc3VsdHMuaWdub3JlZCkge1xuICAgIGlnbm9yZWQucHVzaCh7XG4gICAgICB0eXBlOiAnV2FybmluZycsXG4gICAgICBzZXZlcml0eTogJ3dhcm5pbmcnLFxuICAgICAgdGV4dDogJ1RoaXMgZmlsZSBpcyBpZ25vcmVkJyxcbiAgICAgIGZpbGVQYXRoXG4gICAgfSk7XG4gIH1cblxuICBjb25zdCB0b1JldHVybiA9IFtdXG4gICAgLmNvbmNhdChpbnZhbGlkT3B0aW9ucylcbiAgICAuY29uY2F0KHdhcm5pbmdzKVxuICAgIC5jb25jYXQoZGVwcmVjYXRpb25zKVxuICAgIC5jb25jYXQoaWdub3JlZCk7XG5cbiAgZW5kTWVhc3VyZSgnbGludGVyLXN0eWxlbGludDogUGFyc2luZyByZXN1bHRzJyk7XG4gIGVuZE1lYXN1cmUoJ2xpbnRlci1zdHlsZWxpbnQ6IExpbnQnKTtcbiAgcmV0dXJuIHRvUmV0dXJuO1xufTtcblxuY29uc3QgcnVuU3R5bGVsaW50ID0gYXN5bmMgKGVkaXRvciwgb3B0aW9ucywgZmlsZVBhdGgpID0+IHtcbiAgc3RhcnRNZWFzdXJlKCdsaW50ZXItc3R5bGVsaW50OiBTdHlsZWxpbnQnKTtcbiAgbGV0IGRhdGE7XG4gIHRyeSB7XG4gICAgZGF0YSA9IGF3YWl0IHN0eWxlbGludCgpLmxpbnQob3B0aW9ucyk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZW5kTWVhc3VyZSgnbGludGVyLXN0eWxlbGludDogU3R5bGVsaW50Jyk7XG4gICAgLy8gV2FzIGl0IGEgY29kZSBwYXJzaW5nIGVycm9yP1xuICAgIGlmIChlcnJvci5saW5lKSB7XG4gICAgICBlbmRNZWFzdXJlKCdsaW50ZXItc3R5bGVsaW50OiBMaW50Jyk7XG4gICAgICByZXR1cm4gW3tcbiAgICAgICAgdHlwZTogJ0Vycm9yJyxcbiAgICAgICAgc2V2ZXJpdHk6ICdlcnJvcicsXG4gICAgICAgIHRleHQ6IGVycm9yLnJlYXNvbiB8fCBlcnJvci5tZXNzYWdlLFxuICAgICAgICBmaWxlUGF0aCxcbiAgICAgICAgcmFuZ2U6IGNyZWF0ZVJhbmdlKGVkaXRvciwgZXJyb3IpXG4gICAgICB9XTtcbiAgICB9XG5cbiAgICAvLyBJZiB3ZSBnb3QgaGVyZSwgc3R5bGVsaW50IGZvdW5kIHNvbWV0aGluZyByZWFsbHkgd3Jvbmcgd2l0aCB0aGVcbiAgICAvLyBjb25maWd1cmF0aW9uLCBzdWNoIGFzIGV4dGVuZGluZyBhbiBpbnZhbGlkIGNvbmZpZ3VyYXRpb25cbiAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoJ1VuYWJsZSB0byBydW4gc3R5bGVsaW50Jywge1xuICAgICAgZGV0YWlsOiBlcnJvci5yZWFzb24gfHwgZXJyb3IubWVzc2FnZSxcbiAgICAgIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgfSk7XG5cbiAgICBlbmRNZWFzdXJlKCdsaW50ZXItc3R5bGVsaW50OiBMaW50Jyk7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIGVuZE1lYXN1cmUoJ2xpbnRlci1zdHlsZWxpbnQ6IFN0eWxlbGludCcpO1xuXG4gIGNvbnN0IHJlc3VsdHMgPSBkYXRhLnJlc3VsdHMuc2hpZnQoKTtcbiAgcmV0dXJuIHBhcnNlUmVzdWx0cyhlZGl0b3IsIG9wdGlvbnMsIHJlc3VsdHMsIGZpbGVQYXRoKTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBwcm92aWRlTGludGVyKCkge1xuICByZXR1cm4ge1xuICAgIG5hbWU6ICdzdHlsZWxpbnQnLFxuICAgIGdyYW1tYXJTY29wZXM6IGJhc2VTY29wZXMsXG4gICAgc2NvcGU6ICdmaWxlJyxcbiAgICBsaW50T25GbHk6IHRydWUsXG4gICAgbGludDogYXN5bmMgKGVkaXRvcikgPT4ge1xuICAgICAgc3RhcnRNZWFzdXJlKCdsaW50ZXItc3R5bGVsaW50OiBMaW50Jyk7XG4gICAgICBjb25zdCBzY29wZXMgPSBlZGl0b3IuZ2V0TGFzdEN1cnNvcigpLmdldFNjb3BlRGVzY3JpcHRvcigpLmdldFNjb3Blc0FycmF5KCk7XG5cbiAgICAgIGNvbnN0IGZpbGVQYXRoID0gZWRpdG9yLmdldFBhdGgoKTtcbiAgICAgIGNvbnN0IHRleHQgPSBlZGl0b3IuZ2V0VGV4dCgpO1xuXG4gICAgICBpZiAoIXRleHQpIHtcbiAgICAgICAgZW5kTWVhc3VyZSgnbGludGVyLXN0eWxlbGludDogTGludCcpO1xuICAgICAgICByZXR1cm4gW107XG4gICAgICB9XG5cbiAgICAgIC8vIFJlcXVpcmUgc3R5bGVsaW50LWNvbmZpZy1zdGFuZGFyZCBpZiBpdCBoYXNuJ3QgYWxyZWFkeSBiZWVuIGxvYWRlZFxuICAgICAgaWYgKCFwcmVzZXRDb25maWcgJiYgdXNlU3RhbmRhcmQpIHtcbiAgICAgICAgcHJlc2V0Q29uZmlnID0gcmVxdWlyZSgnc3R5bGVsaW50LWNvbmZpZy1zdGFuZGFyZCcpO1xuICAgICAgfVxuICAgICAgLy8gU2V0dXAgYmFzZSBjb25maWcgaWYgdXNlU3RhbmRhcmQoKSBpcyB0cnVlXG4gICAgICBjb25zdCBkZWZhdWx0Q29uZmlnID0ge1xuICAgICAgICBydWxlczoge31cbiAgICAgIH07XG5cbiAgICAgIC8vIEJhc2UgdGhlIGNvbmZpZyBpbiB0aGUgcHJvamVjdCBkaXJlY3RvcnlcbiAgICAgIGxldCBbY29uZmlnQmFzZWRpcl0gPSBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoZmlsZVBhdGgpO1xuICAgICAgaWYgKGNvbmZpZ0Jhc2VkaXIgPT09IG51bGwpIHtcbiAgICAgICAgLy8gRmFsbGluZyBiYWNrIHRvIHRoZSBmaWxlIGRpcmVjdG9yeSBpZiBubyBwcm9qZWN0IGlzIGZvdW5kXG4gICAgICAgIGNvbmZpZ0Jhc2VkaXIgPSBkaXJuYW1lKGZpbGVQYXRoKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgcnVsZXMgPSB1c2VTdGFuZGFyZCA/IGFzc2lnbkRlZXAoKSh7fSwgcHJlc2V0Q29uZmlnKSA6IGRlZmF1bHRDb25maWc7XG5cbiAgICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICAgIGNvZGU6IHRleHQsXG4gICAgICAgIGNvZGVGaWxlbmFtZTogZmlsZVBhdGgsXG4gICAgICAgIGNvbmZpZzogcnVsZXMsXG4gICAgICAgIGNvbmZpZ0Jhc2VkaXJcbiAgICAgIH07XG5cbiAgICAgIGlmIChzY29wZXMuaW5jbHVkZXMoJ3NvdXJjZS5jc3Muc2NzcycpIHx8IHNjb3Blcy5pbmNsdWRlcygnc291cmNlLnNjc3MnKSkge1xuICAgICAgICBvcHRpb25zLnN5bnRheCA9ICdzY3NzJztcbiAgICAgIH1cbiAgICAgIGlmIChzY29wZXMuaW5jbHVkZXMoJ3NvdXJjZS5jc3MubGVzcycpIHx8IHNjb3Blcy5pbmNsdWRlcygnc291cmNlLmxlc3MnKSkge1xuICAgICAgICBvcHRpb25zLnN5bnRheCA9ICdsZXNzJztcbiAgICAgIH1cbiAgICAgIGlmIChzY29wZXMuaW5jbHVkZXMoJ3NvdXJjZS5jc3MucG9zdGNzcy5zdWdhcnNzJykpIHtcbiAgICAgICAgb3B0aW9ucy5zeW50YXggPSAnc3VnYXJzcyc7XG4gICAgICAgIC8vIGBzdHlsZWxpbnQtY29uZmlnLXN0YW5kYXJkYCBpc24ndCBmdWxseSBjb21wYXRpYmxlIHdpdGggU3VnYXJTU1xuICAgICAgICAvLyBTZWUgaGVyZSBmb3IgZGV0YWlsczpcbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3N0eWxlbGludC9zdHlsZWxpbnQtY29uZmlnLXN0YW5kYXJkI3VzaW5nLXRoZS1jb25maWctd2l0aC1zdWdhcnNzLXN5bnRheFxuICAgICAgICBvcHRpb25zLmNvbmZpZy5ydWxlc1snYmxvY2stY2xvc2luZy1icmFjZS1lbXB0eS1saW5lLWJlZm9yZSddID0gbnVsbDtcbiAgICAgICAgb3B0aW9ucy5jb25maWcucnVsZXNbJ2Jsb2NrLWNsb3NpbmctYnJhY2UtbmV3bGluZS1hZnRlciddID0gbnVsbDtcbiAgICAgICAgb3B0aW9ucy5jb25maWcucnVsZXNbJ2Jsb2NrLWNsb3NpbmctYnJhY2UtbmV3bGluZS1iZWZvcmUnXSA9IG51bGw7XG4gICAgICAgIG9wdGlvbnMuY29uZmlnLnJ1bGVzWydibG9jay1jbG9zaW5nLWJyYWNlLXNwYWNlLWJlZm9yZSddID0gbnVsbDtcbiAgICAgICAgb3B0aW9ucy5jb25maWcucnVsZXNbJ2Jsb2NrLW9wZW5pbmctYnJhY2UtbmV3bGluZS1hZnRlciddID0gbnVsbDtcbiAgICAgICAgb3B0aW9ucy5jb25maWcucnVsZXNbJ2Jsb2NrLW9wZW5pbmctYnJhY2Utc3BhY2UtYWZ0ZXInXSA9IG51bGw7XG4gICAgICAgIG9wdGlvbnMuY29uZmlnLnJ1bGVzWydibG9jay1vcGVuaW5nLWJyYWNlLXNwYWNlLWJlZm9yZSddID0gbnVsbDtcbiAgICAgICAgb3B0aW9ucy5jb25maWcucnVsZXNbJ2RlY2xhcmF0aW9uLWJsb2NrLXNlbWljb2xvbi1uZXdsaW5lLWFmdGVyJ10gPSBudWxsO1xuICAgICAgICBvcHRpb25zLmNvbmZpZy5ydWxlc1snZGVjbGFyYXRpb24tYmxvY2stc2VtaWNvbG9uLXNwYWNlLWFmdGVyJ10gPSBudWxsO1xuICAgICAgICBvcHRpb25zLmNvbmZpZy5ydWxlc1snZGVjbGFyYXRpb24tYmxvY2stc2VtaWNvbG9uLXNwYWNlLWJlZm9yZSddID0gbnVsbDtcbiAgICAgICAgb3B0aW9ucy5jb25maWcucnVsZXNbJ2RlY2xhcmF0aW9uLWJsb2NrLXRyYWlsaW5nLXNlbWljb2xvbiddID0gbnVsbDtcbiAgICAgICAgb3B0aW9ucy5jb25maWcucnVsZXNbJ2RlY2xhcmF0aW9uLWJsb2NrLXRyYWlsaW5nLXNlbWljb2xvbiddID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgc3RhcnRNZWFzdXJlKCdsaW50ZXItc3R5bGVsaW50OiBDcmVhdGUgTGludGVyJyk7XG4gICAgICBjb25zdCBzdHlsZWxpbnRMaW50ZXIgPSBhd2FpdCBzdHlsZWxpbnQoKS5jcmVhdGVMaW50ZXIoKTtcbiAgICAgIGVuZE1lYXN1cmUoJ2xpbnRlci1zdHlsZWxpbnQ6IENyZWF0ZSBMaW50ZXInKTtcblxuICAgICAgc3RhcnRNZWFzdXJlKCdsaW50ZXItc3R5bGVsaW50OiBDb25maWcnKTtcbiAgICAgIGxldCBmb3VuZENvbmZpZztcbiAgICAgIHRyeSB7XG4gICAgICAgIGZvdW5kQ29uZmlnID0gYXdhaXQgc3R5bGVsaW50TGludGVyLmdldENvbmZpZ0ZvckZpbGUoZmlsZVBhdGgpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgaWYgKCEvTm8gY29uZmlndXJhdGlvbiBwcm92aWRlZCBmb3IgLisvLnRlc3QoZXJyb3IubWVzc2FnZSkpIHtcbiAgICAgICAgICBlbmRNZWFzdXJlKCdsaW50ZXItc3R5bGVsaW50OiBDb25maWcnKTtcbiAgICAgICAgICAvLyBJZiB3ZSBnb3QgaGVyZSwgc3R5bGVsaW50IGZhaWxlZCB0byBwYXJzZSB0aGUgY29uZmlndXJhdGlvblxuICAgICAgICAgIC8vIHRoZXJlJ3Mgbm8gcG9pbnQgb2YgcmUtbGludGluZyBpZiB1c2VTdGFuZGFyZCBpcyB0cnVlLCBiZWNhdXNlIHRoZVxuICAgICAgICAgIC8vIHVzZXIgZG9lcyBub3QgaGF2ZSB0aGUgY29tcGxldGUgc2V0IG9mIGRlc2lyZWQgcnVsZXMgcGFyc2VkXG4gICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKCdVbmFibGUgdG8gcGFyc2Ugc3R5bGVsaW50IGNvbmZpZ3VyYXRpb24nLCB7XG4gICAgICAgICAgICBkZXRhaWw6IGVycm9yLm1lc3NhZ2UsXG4gICAgICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGVuZE1lYXN1cmUoJ2xpbnRlci1zdHlsZWxpbnQ6IExpbnQnKTtcbiAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVuZE1lYXN1cmUoJ2xpbnRlci1zdHlsZWxpbnQ6IENvbmZpZycpO1xuXG4gICAgICBpZiAoZm91bmRDb25maWcpIHtcbiAgICAgICAgb3B0aW9ucy5jb25maWcgPSBhc3NpZ25EZWVwKCkocnVsZXMsIGZvdW5kQ29uZmlnLmNvbmZpZyk7XG4gICAgICAgIG9wdGlvbnMuY29uZmlnQmFzZWRpciA9IGRpcm5hbWUoZm91bmRDb25maWcuZmlsZXBhdGgpO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWZvdW5kQ29uZmlnICYmIGRpc2FibGVXaGVuTm9Db25maWcpIHtcbiAgICAgICAgZW5kTWVhc3VyZSgnbGludGVyLXN0eWxlbGludDogTGludCcpO1xuICAgICAgICByZXR1cm4gW107XG4gICAgICB9XG5cbiAgICAgIHN0YXJ0TWVhc3VyZSgnbGludGVyLXN0eWxlbGludDogQ2hlY2sgaWdub3JlZCcpO1xuICAgICAgbGV0IGZpbGVJc0lnbm9yZWQ7XG4gICAgICB0cnkge1xuICAgICAgICBmaWxlSXNJZ25vcmVkID0gYXdhaXQgc3R5bGVsaW50TGludGVyLmlzUGF0aElnbm9yZWQoZmlsZVBhdGgpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgLy8gRG8gbm90aGluZywgY29uZmlndXJhdGlvbiBlcnJvcnMgc2hvdWxkIGhhdmUgYWxyZWFkeSBiZWVuIGNhdWdodCBhbmQgdGhyb3duIGFib3ZlXG4gICAgICB9XG4gICAgICBlbmRNZWFzdXJlKCdsaW50ZXItc3R5bGVsaW50OiBDaGVjayBpZ25vcmVkJyk7XG5cbiAgICAgIGlmIChmaWxlSXNJZ25vcmVkKSB7XG4gICAgICAgIGVuZE1lYXN1cmUoJ2xpbnRlci1zdHlsZWxpbnQ6IExpbnQnKTtcbiAgICAgICAgaWYgKHNob3dJZ25vcmVkKSB7XG4gICAgICAgICAgcmV0dXJuIFt7XG4gICAgICAgICAgICB0eXBlOiAnV2FybmluZycsXG4gICAgICAgICAgICBzZXZlcml0eTogJ3dhcm5pbmcnLFxuICAgICAgICAgICAgdGV4dDogJ1RoaXMgZmlsZSBpcyBpZ25vcmVkJyxcbiAgICAgICAgICAgIGZpbGVQYXRoXG4gICAgICAgICAgfV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgfVxuXG4gICAgICBjb25zdCByZXN1bHRzID0gYXdhaXQgcnVuU3R5bGVsaW50KGVkaXRvciwgb3B0aW9ucywgZmlsZVBhdGgpO1xuICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfVxuICB9O1xufVxuIl19