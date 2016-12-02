(function() {
  module.exports = {
    config: {
      executablePath: {
        type: 'string',
        "default": 'flake8',
        description: 'Full path to binary (e.g. /usr/local/bin/flake8)'
      },
      projectConfigFile: {
        type: 'string',
        "default": '',
        description: 'flake config file relative path from project (e.g. tox.ini or .flake8rc)'
      },
      maxLineLength: {
        type: 'integer',
        "default": 0
      },
      ignoreErrorCodes: {
        type: 'array',
        "default": [],
        items: {
          type: 'string'
        }
      },
      maxComplexity: {
        type: 'integer',
        "default": 10
      },
      hangClosing: {
        type: 'boolean',
        "default": false
      },
      selectErrors: {
        description: 'input "E, W" to include all errors/warnings',
        type: 'array',
        "default": [],
        items: {
          type: 'string'
        }
      }
    },
    activate: function() {
      return require('atom-package-deps').install('linter-flake8');
    },
    provideLinter: function() {
      var helpers, path, provider;
      helpers = require('atom-linter');
      path = require('path');
      return provider = {
        name: 'Flake8',
        grammarScopes: ['source.python', 'source.python.django'],
        scope: 'file',
        lintOnFly: true,
        lint: function(textEditor) {
          var filePath, fileText, ignoreErrorCodes, maxComplexity, maxLineLength, parameters, projectConfigFile, selectErrors;
          filePath = textEditor.getPath();
          fileText = textEditor.getText();
          parameters = [];
          if (maxLineLength = atom.config.get('linter-flake8.maxLineLength')) {
            parameters.push('--max-line-length', maxLineLength);
          }
          if ((ignoreErrorCodes = atom.config.get('linter-flake8.ignoreErrorCodes')).length) {
            parameters.push('--ignore', ignoreErrorCodes.join(','));
          }
          if (maxComplexity = atom.config.get('linter-flake8.maxComplexity')) {
            parameters.push('--max-complexity', maxComplexity);
          }
          if (atom.config.get('linter-flake8.hangClosing')) {
            parameters.push('--hang-closing');
          }
          if ((selectErrors = atom.config.get('linter-flake8.selectErrors')).length) {
            parameters.push('--select', selectErrors.join(','));
          }
          if ((projectConfigFile = atom.config.get('linter-flake8.projectConfigFile'))) {
            parameters.push('--config', path.join(atom.project.getPaths()[0], projectConfigFile));
          }
          parameters.push('-');
          return helpers.exec(atom.config.get('linter-flake8.executablePath'), parameters, {
            stdin: fileText
          }).then(function(result) {
            var col, line, match, regex, toReturn;
            toReturn = [];
            regex = /(\d+):(\d+):\s((E|W|F|C|N|H|D)\d{2,3})\s+(.*)/g;
            while ((match = regex.exec(result)) !== null) {
              line = parseInt(match[1]) || 0;
              col = parseInt(match[2]) || 0;
              toReturn.push({
                type: match[4] === 'E' ? 'Error' : 'Warning',
                text: match[3] + '- ' + match[5],
                filePath: filePath,
                range: [[line - 1, col - 1], [line - 1, col]]
              });
            }
            return toReturn;
          });
        }
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL01hcnZpbi8uYXRvbS9wYWNrYWdlcy9saW50ZXItZmxha2U4L2xpYi9tYWluLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLGNBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxRQURUO0FBQUEsUUFFQSxXQUFBLEVBQWEsa0RBRmI7T0FERjtBQUFBLE1BSUEsaUJBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxFQURUO0FBQUEsUUFFQSxXQUFBLEVBQWEsMEVBRmI7T0FMRjtBQUFBLE1BUUEsYUFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLENBRFQ7T0FURjtBQUFBLE1BV0EsZ0JBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLE9BQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxFQURUO0FBQUEsUUFFQSxLQUFBLEVBQ0U7QUFBQSxVQUFBLElBQUEsRUFBTSxRQUFOO1NBSEY7T0FaRjtBQUFBLE1BZ0JBLGFBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxFQURUO09BakJGO0FBQUEsTUFtQkEsV0FBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEtBRFQ7T0FwQkY7QUFBQSxNQXNCQSxZQUFBLEVBQ0U7QUFBQSxRQUFBLFdBQUEsRUFBYSw2Q0FBYjtBQUFBLFFBQ0EsSUFBQSxFQUFNLE9BRE47QUFBQSxRQUVBLFNBQUEsRUFBUyxFQUZUO0FBQUEsUUFHQSxLQUFBLEVBQ0U7QUFB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

//# sourceURL=/Users/Marvin/.atom/packages/linter-flake8/lib/main.coffee
