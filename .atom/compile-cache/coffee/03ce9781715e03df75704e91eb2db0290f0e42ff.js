(function() {
  module.exports = {
    config: {
      accentColor: {
        title: 'Accent color',
        description: 'Sets the accent color for the UI theme.',
        type: 'string',
        "default": 'Teal',
        "enum": ['Blue', 'Cyan', 'Green', 'Orange', 'Pink', 'Purple', 'Red', 'Teal', 'White', 'Yellow']
      },
      tabSize: {
        title: 'Tab bar size',
        description: 'Sets the height for the tab bar',
        type: 'string',
        "default": 'Normal',
        "enum": ['Small', 'Normal', 'Big']
      },
      useRoboto: {
        title: 'Use Roboto Mono font in text editors',
        type: 'boolean',
        "default": false
      },
      slimScrollbar: {
        title: 'Slim scrollbars',
        type: 'boolean',
        "default": false
      },
      disableAnimations: {
        title: 'Disable animations',
        description: 'Reduces visual distractions when switching tabs or giving focus to text fields.',
        type: 'boolean',
        "default": false
      },
      panelContrast: {
        title: 'Contrasting panels',
        description: 'Makes panels\' background darker. Applies to tabs, search & replace, tree-view, etc.',
        type: 'boolean',
        "default": false
      },
      depth: {
        title: 'Add depth',
        description: 'Adds a few shadows here and there to add depth to the UI.',
        type: 'boolean',
        "default": false
      },
      altCmdPalette: {
        title: 'Alternative command palette background',
        description: 'Use a syntax\' background color for the command palette and fuzzy finder.',
        type: 'boolean',
        "default": true
      },
      compactTreeView: {
        title: 'Compact Tree View',
        description: 'Reduces line-height in the tree view component.',
        type: 'boolean',
        "default": false
      },
      fontSize: {
        title: 'UI font size',
        description: 'Set the font size used through the user interface. It doesn\'t override the text editor font size setting.',
        type: 'string',
        "default": 'Regular',
        "enum": ['Small', 'Regular', 'Big', 'Huge']
      },
      showTabIcons: {
        title: 'Icons in tabs',
        description: 'Shows the file-type icon for focused tabs.',
        type: 'string',
        "default": 'Hide',
        "enum": ['Hide', 'Show on active tab', 'Show on all tabs']
      },
      rippleAccentColor: {
        title: 'Use accent color in tabs\' ripple effect',
        type: 'boolean',
        "default": false
      },
      useRobotoInUI: {
        title: 'Use Roboto font for UI',
        type: 'boolean',
        "default": false
      }
    },
    activate: function(state) {
      return atom.themes.onDidChangeActiveThemes(function() {
        var Config;
        Config = require('./config');
        return Config.apply();
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL01hcnZpbi8uYXRvbS9wYWNrYWdlcy9hdG9tLW1hdGVyaWFsLXVpL2xpYi9zZXR0aW5ncy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FDSTtBQUFBLElBQUEsTUFBQSxFQUNJO0FBQUEsTUFBQSxXQUFBLEVBQ0k7QUFBQSxRQUFBLEtBQUEsRUFBTyxjQUFQO0FBQUEsUUFDQSxXQUFBLEVBQWEseUNBRGI7QUFBQSxRQUVBLElBQUEsRUFBTSxRQUZOO0FBQUEsUUFHQSxTQUFBLEVBQVMsTUFIVDtBQUFBLFFBSUEsTUFBQSxFQUFNLENBQUMsTUFBRCxFQUFTLE1BQVQsRUFBaUIsT0FBakIsRUFBMEIsUUFBMUIsRUFBb0MsTUFBcEMsRUFBNEMsUUFBNUMsRUFBc0QsS0FBdEQsRUFBNkQsTUFBN0QsRUFBcUUsT0FBckUsRUFBOEUsUUFBOUUsQ0FKTjtPQURKO0FBQUEsTUFNQSxPQUFBLEVBQ0k7QUFBQSxRQUFBLEtBQUEsRUFBTyxjQUFQO0FBQUEsUUFDQSxXQUFBLEVBQWEsaUNBRGI7QUFBQSxRQUVBLElBQUEsRUFBTSxRQUZOO0FBQUEsUUFHQSxTQUFBLEVBQVMsUUFIVDtBQUFBLFFBSUEsTUFBQSxFQUFNLENBQUMsT0FBRCxFQUFVLFFBQVYsRUFBb0IsS0FBcEIsQ0FKTjtPQVBKO0FBQUEsTUFZQSxTQUFBLEVBQ0k7QUFBQSxRQUFBLEtBQUEsRUFBTyxzQ0FBUDtBQUFBLFFBQ0EsSUFBQSxFQUFNLFNBRE47QUFBQSxRQUVBLFNBQUEsRUFBUyxLQUZUO09BYko7QUFBQSxNQWdCQSxhQUFBLEVBQ0k7QUFBQSxRQUFBLEtBQUEsRUFBTyxpQkFBUDtBQUFBLFFBQ0EsSUFBQSxFQUFNLFNBRE47QUFBQSxRQUVBLFNBQUEsRUFBUyxLQUZUO09BakJKO0FBQUEsTUFvQkEsaUJBQUEsRUFDSTtBQUFBLFFBQUEsS0FBQSxFQUFPLG9CQUFQO0FBQUEsUUFDQSxXQUFBLEVBQWEsaUZBRGI7QUFBQSxRQUVBLElBQUEsRUFBTSxTQUZOO0FBQUEsUUFHQSxTQUFBLEVBQVMsS0FIVDtPQXJCSjtBQUFBLE1BeUJBLGFBQUEsRUFDSTtBQUFBLFFBQUEsS0FBQSxFQUFPLG9CQUFQO0FBQUEsUUFDQSxXQUFBLEVBQWEsc0ZBRGI7QUFBQSxRQUVBLElBQUEsRUFBTSxTQUZOO0FBQUEsUUFHQSxTQUFBLEVBQVMsS0FIVDtPQTFCSjtBQUFBLE1BOEJBLEtBQUEsRUFDSTtBQUFBLFFBQUEsS0FBQSxFQUFPLFdBQVA7QUFBQSxRQUNBLFdBQUEsRUFBYSwyREFEYjtBQUFBLFFBRUEsSUFBQSxFQUFNLFNBRk47QUFBQSxRQUdBLFNBQUEsRUFBUyxLQUhUO09BL0JKO0FBQUEsTUFtQ0EsYUFBQSxFQUNJO0FBQUEsUUFBQSxLQUFBLEVBQU8sd0NBQVA7QUFBQSxRQUNBLFdBQUEsRUFBYSwyRUFEYjtBQUFBLFFBRUEsSUFBQSxFQUFNLFNBRk47QUFBQSxRQUdBLFNBQUEsRUFBUyxJQUhUO09BcENKO0FBQUEsTUF3Q0EsZUFBQSxFQUNJO0FBQUEsUUFBQSxLQUFBLEVBQU8sbUJBQVA7QUFBQSxRQUNBLFdBQUEsRUFBYSxpREFEYjtBQUFBLFFBRUEsSUFBQSxFQUFNLFNBRk47QUFBQSxRQUdBLFNBQUEsRUFBUyxLQUhUO09BekNKO0FBQUEsTUE2Q0EsUUFBQSxFQUNJO0FBQUEsUUFBQSxLQUFBLEVBQU8sY0FBUDtBQUFBLFFBQ0EsV0FBQSxFQUFhLDRHQURiO0FBQUEsUUFFQSxJQUFBLEVBQU0sUUFGTjtBQUFBLFFBR0EsU0FBQSxFQUFTLFNBSFQ7QUFBQSxRQUlBLE1BQUEsRUFBTSxDQUFDLE9BQUQsRUFBVSxTQUFWLEVBQXFCLEtBQXJCLEVBQTRCLE1BQTVCLENBSk47T0E5Q0o7QUFBQSxNQW1EQSxZQUFBLEVBQ0k7QUFBQSxRQUFBLEtBQUEsRUFBTyxlQUFQO0FBQUEsUUFDQSxXQUFBLEVBQWEsNENBRGI7QUFBQSxRQUVBLElBQUEsRUFBTSxRQUZOO0FBQUEsUUFHQSxTQUFBLEVBQVMsTUFIVDtBQUFBLFFBSUEsTUFBQSxFQUFNLENBQUMsTUFBRCxFQUFTLG9CQUFULEVBQStCLGtCQUEvQixDQUpOO09BcERKO0FBQUEsTUF5REEsaUJBQUEsRUFDSTtBQUFBLFFBQUEsS0FBQSxFQUFPLDBDQUFQO0FBQUEsUUFDQSxJQUFBLEVBQU0sU0FETjtBQUFBLFFBRUEsU0FBQSxFQUFTLEtBRlQ7T0ExREo7QUFBQSxNQTZEQSxhQUFBLEVBQ0k7QUFBQSxRQUFBLEtBQUEsRUFBTyx3QkFBUDtBQUFBLFFBQ0EsSUFBQSxFQUFNLFNBRE47QUFBQSxRQUVBLFNBQUEsRUFBUyxLQUZUO09BOURKO0tBREo7QUFBQSxJQW1FQSxRQUFBLEVBQVUsU0FBQyxLQUFELEdBQUE7YUFDTixJQUFJLENBQUMsTUFBTSxDQUFDLHVCQUFaLENBQW9DLFNBQUEsR0FBQTtBQUNoQyxZQUFBLE1BQUE7QUFBQSxRQUFBLE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUixDQUFULENBQUE7ZUFDQSxNQUFNLENBQUMsS0FBUCxDQUFBLEVBRmdDO01BQUEsQ0FBcEMsRUFETTtJQUFBLENBbkVWO0dBREosQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/Marvin/.atom/packages/atom-material-ui/lib/settings.coffee
