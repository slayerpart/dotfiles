(function() {
  var provider;

  provider = require('./provider');

  module.exports = {
    config: {
      caseInsensitiveCompletion: {
        type: 'boolean',
        "default": true,
        title: 'Case Insensitive Completion',
        description: 'The completion is by default case insensitive.'
      },
      showDescriptions: {
        type: 'boolean',
        "default": true,
        title: 'Show descriptions',
        description: 'Show doc strings from functions, classes, etc.'
      },
      outputProviderErrors: {
        type: 'boolean',
        "default": false,
        title: 'Output Provider Errors',
        description: 'Select if you would like to see the provider errors when they happen. By default they are hidden. Note that critical errors are always shown.'
      },
      addDotAfterModule: {
        type: 'boolean',
        "default": false,
        title: 'Add Dot After Module',
        description: 'Adds a dot after a module, because a module that is not accessed this way is definitely not the normal case.'
      },
      addBracketAfterFunction: {
        type: 'boolean',
        "default": false,
        title: 'Add Bracket After Function',
        description: 'Adds an opening bracket after a function, because that’s normal behaviour.'
      },
      useSnippets: {
        type: 'string',
        "default": 'none',
        "enum": ['none', 'all', 'required'],
        title: 'Autocomplete Function Parameters',
        description: 'Allows to complete functions with their arguments. Use completion key to jump between arguments. Will ignore some settings if used.'
      },
      pythonPath: {
        type: 'string',
        "default": '',
        title: 'Path to python directory',
        description: 'Optional. Set it if default values are not working for you or you want to use specific python version. For example: `/usr/local/Cellar/python/2.7.3/bin` or `E:\\Python2.7`'
      },
      pythonExecutable: {
        type: 'string',
        "default": '',
        title: 'Python executable name',
        description: 'Optional. Set it if default values are not working for you or you want to use specific python version. For example: `python3`'
      },
      extraPaths: {
        type: 'string',
        "default": '',
        title: 'Extra PATH',
        description: 'Semicolon separated list of modules to additionally include for autocomplete.\nYou can use $PROJECT variable here to include project specific folders like virtual environment.\nNote that it still should be valid python package.\nFor example: $PROJECT/env/lib/python2.7/site-packages.'
      }
    },
    activate: function(state) {
      return provider.constructor();
    },
    deactivate: function() {
      return provider.dispose();
    },
    getProvider: function() {
      return provider;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL01hcnZpbi8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtcHl0aG9uL2xpYi9tYWluLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxRQUFBOztBQUFBLEVBQUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxZQUFSLENBQVgsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLE1BQUEsRUFDRTtBQUFBLE1BQUEseUJBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxJQURUO0FBQUEsUUFFQSxLQUFBLEVBQU8sNkJBRlA7QUFBQSxRQUdBLFdBQUEsRUFBYSxnREFIYjtPQURGO0FBQUEsTUFLQSxnQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLElBRFQ7QUFBQSxRQUVBLEtBQUEsRUFBTyxtQkFGUDtBQUFBLFFBR0EsV0FBQSxFQUFhLGdEQUhiO09BTkY7QUFBQSxNQVVBLG9CQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsS0FEVDtBQUFBLFFBRUEsS0FBQSxFQUFPLHdCQUZQO0FBQUEsUUFHQSxXQUFBLEVBQWEsK0lBSGI7T0FYRjtBQUFBLE1BZUEsaUJBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxLQURUO0FBQUEsUUFFQSxLQUFBLEVBQU8sc0JBRlA7QUFBQSxRQUdBLFdBQUEsRUFBYSw4R0FIYjtPQWhCRjtBQUFBLE1Bb0JBLHVCQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsS0FEVDtBQUFBLFFBRUEsS0FBQSxFQUFPLDRCQUZQO0FBQUEsUUFHQSxXQUFBLEVBQWEsNEVBSGI7T0FyQkY7QUFBQSxNQXlCQSxXQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsTUFEVDtBQUFBLFFBRUEsTUFBQSxFQUFNLENBQUMsTUFBRCxFQUFTLEtBQVQsRUFBZ0IsVUFBaEIsQ0FGTjtBQUFBLFFBR0EsS0FBQSxFQUFPLGtDQUhQO0FBQUEsUUFJQSxXQUFBLEVBQWEscUlBSmI7T0ExQkY7QUFBQSxNQStCQSxVQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsRUFEVDtBQUFBLFFBRUEsS0FBQSxFQUFPLDBCQUZQO0FBQUEsUUFHQSxXQUFBLEVBQWEsNktBSGI7T0FoQ0Y7QUFBQSxNQW9DQSxnQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEVBRFQ7QUFBQSxRQUVBLEtBQUEsRUFBTyx3QkFGUDtBQUFBLFFBR0EsV0FBQSxFQUFhLCtIQUhiO09BckNGO0FBQUEsTUF5Q0EsVUFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEVBRFQ7QUFBQSxRQUVBLEtBQUEsRUFBTyxZQUZQO0FBQUEsUUFHQSxXQUFBLEVBQWEsNlJBSGI7T0ExQ0Y7S0FERjtBQUFBLElBb0RBLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQTthQUFXLFFBQVEsQ0FBQyxXQUFULENBQUEsRUFBWDtJQUFBLENBcERWO0FBQUEsSUFzREEsVUFBQSxFQUFZLFNBQUEsR0FBQTthQUFHLFFBQVEsQ0FBQyxPQUFULENBQUEsRUFBSDtJQUFBLENBdERaO0FBQUEsSUF3REEsV0FBQSxFQUFhLFNBQUEsR0FBQTthQUFHLFNBQUg7SUFBQSxDQXhEYjtHQUhGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/Marvin/.atom/packages/autocomplete-python/lib/main.coffee
