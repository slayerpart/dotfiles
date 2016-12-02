(function() {
  module.exports = {
    apply: function() {
      var checkPacks, root, setAccentColor, setAltCmdPalette, setAnimationStatus, setCompactTreeView, setDepth, setFontSize, setPanelContrast, setRippleAccentColor, setRobotoFont, setRobotoUIFont, setShowTabIcons, setSlimScrollbars, setTabSize;
      root = document.documentElement;
      checkPacks = function() {
        var iconPacks, loadedPackages;
        root.classList.remove('dont-change-icons');
        loadedPackages = atom.packages.getActivePackages();
        iconPacks = ['file-icons', 'file-type-icons', 'seti-icons', 'envygeeks-file-icons'];
        return loadedPackages.forEach(function(pack, i) {
          if (iconPacks.indexOf(pack.name) >= 0) {
            return root.classList.add('dont-change-icons');
          }
        });
      };
      atom.packages.onDidActivatePackage(function() {
        return checkPacks();
      });
      atom.packages.onDidDeactivatePackage(function() {
        return checkPacks();
      });
      setAccentColor = function(currentAccentColor) {
        root.classList.remove('blue');
        root.classList.remove('cyan');
        root.classList.remove('green');
        root.classList.remove('orange');
        root.classList.remove('pink');
        root.classList.remove('purple');
        root.classList.remove('red');
        root.classList.remove('teal');
        root.classList.remove('white');
        root.classList.remove('yellow');
        return root.classList.add(currentAccentColor.toLowerCase());
      };
      atom.config.onDidChange('atom-material-ui.accentColor', function() {
        return setAccentColor(atom.config.get('atom-material-ui.accentColor'));
      });
      setAccentColor(atom.config.get('atom-material-ui.accentColor'));
      setRobotoFont = function(boolean) {
        if (boolean) {
          return root.classList.add('roboto-mono');
        } else {
          return root.classList.remove('roboto-mono');
        }
      };
      atom.config.onDidChange('atom-material-ui.useRoboto', function() {
        return setRobotoFont(atom.config.get('atom-material-ui.useRoboto'));
      });
      setRobotoFont(atom.config.get('atom-material-ui.useRoboto'));
      setRobotoUIFont = function(boolean) {
        if (boolean) {
          return root.classList.add('roboto');
        } else {
          return root.classList.remove('roboto');
        }
      };
      atom.config.onDidChange('atom-material-ui.useRobotoInUI', function() {
        return setRobotoUIFont(atom.config.get('atom-material-ui.useRobotoInUI'));
      });
      setRobotoUIFont(atom.config.get('atom-material-ui.useRobotoInUI'));
      setSlimScrollbars = function(boolean) {
        if (boolean) {
          return root.classList.add('slim-scrollbar');
        } else {
          return root.classList.remove('slim-scrollbar');
        }
      };
      atom.config.onDidChange('atom-material-ui.slimScrollbar', function() {
        return setSlimScrollbars(atom.config.get('atom-material-ui.slimScrollbar'));
      });
      setSlimScrollbars(atom.config.get('atom-material-ui.slimScrollbar'));
      setAnimationStatus = function(boolean) {
        if (boolean) {
          return root.classList.add('no-animations');
        } else {
          return root.classList.remove('no-animations');
        }
      };
      atom.config.onDidChange('atom-material-ui.disableAnimations', function() {
        return setAnimationStatus(atom.config.get('atom-material-ui.disableAnimations'));
      });
      setAnimationStatus(atom.config.get('atom-material-ui.disableAnimations'));
      setPanelContrast = function(boolean) {
        if (boolean) {
          return root.classList.add('panel-contrast');
        } else {
          return root.classList.remove('panel-contrast');
        }
      };
      atom.config.onDidChange('atom-material-ui.panelContrast', function() {
        return setPanelContrast(atom.config.get('atom-material-ui.panelContrast'));
      });
      setPanelContrast(atom.config.get('atom-material-ui.panelContrast'));
      setDepth = function(boolean) {
        if (boolean) {
          return root.classList.add('panel-depth');
        } else {
          return root.classList.remove('panel-depth');
        }
      };
      atom.config.onDidChange('atom-material-ui.depth', function() {
        return setDepth(atom.config.get('atom-material-ui.depth'));
      });
      setDepth(atom.config.get('atom-material-ui.depth'));
      setAltCmdPalette = function(boolean) {
        if (boolean) {
          return root.classList.add('alt-cmd-palette');
        } else {
          return root.classList.remove('alt-cmd-palette');
        }
      };
      atom.config.onDidChange('atom-material-ui.altCmdPalette', function() {
        return setAltCmdPalette(atom.config.get('atom-material-ui.altCmdPalette'));
      });
      setAltCmdPalette(atom.config.get('atom-material-ui.altCmdPalette'));
      setTabSize = function(currentTabSize) {
        root.classList.remove('tab-size-small');
        root.classList.remove('tab-size-normal');
        root.classList.remove('tab-size-big');
        return root.classList.add('tab-size-' + currentTabSize.toLowerCase());
      };
      atom.config.onDidChange('atom-material-ui.tabSize', function() {
        return setTabSize(atom.config.get('atom-material-ui.tabSize'));
      });
      setTabSize(atom.config.get('atom-material-ui.tabSize'));
      setCompactTreeView = function(boolean) {
        if (boolean) {
          return root.classList.add('compact-tree-view');
        } else {
          return root.classList.remove('compact-tree-view');
        }
      };
      atom.config.onDidChange('atom-material-ui.compactTreeView', function() {
        return setCompactTreeView(atom.config.get('atom-material-ui.compactTreeView'));
      });
      setCompactTreeView(atom.config.get('atom-material-ui.compactTreeView'));
      setFontSize = function(currentFontSize) {
        root.classList.remove('font-size-small');
        root.classList.remove('font-size-regular');
        root.classList.remove('font-size-big');
        root.classList.remove('font-size-huge');
        return root.classList.add('font-size-' + currentFontSize.toLowerCase());
      };
      atom.config.onDidChange('atom-material-ui.fontSize', function() {
        return setFontSize(atom.config.get('atom-material-ui.fontSize'));
      });
      setFontSize(atom.config.get('atom-material-ui.fontSize'));
      setShowTabIcons = function(option) {
        root.classList.remove('tab-icons');
        root.classList.remove('tab-icons-all');
        if (option === 'Show on active tab') {
          return root.classList.add('tab-icons');
        } else if (option === 'Show on all tabs') {
          return root.classList.add('tab-icons-all');
        }
      };
      atom.config.onDidChange('atom-material-ui.showTabIcons', function() {
        return setShowTabIcons(atom.config.get('atom-material-ui.showTabIcons'));
      });
      setShowTabIcons(atom.config.get('atom-material-ui.showTabIcons'));
      setRippleAccentColor = function(boolean) {
        if (boolean) {
          return root.classList.add('ripple-accent-color');
        } else {
          return root.classList.remove('ripple-accent-color');
        }
      };
      atom.config.onDidChange('atom-material-ui.rippleAccentColor', function() {
        return setRippleAccentColor(atom.config.get('atom-material-ui.rippleAccentColor'));
      });
      return setRippleAccentColor(atom.config.get('atom-material-ui.rippleAccentColor'));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL01hcnZpbi8uYXRvbS9wYWNrYWdlcy9hdG9tLW1hdGVyaWFsLXVpL2xpYi9jb25maWcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0k7QUFBQSxJQUFBLEtBQUEsRUFBTyxTQUFBLEdBQUE7QUFDSCxVQUFBLHlPQUFBO0FBQUEsTUFBQSxJQUFBLEdBQU8sUUFBUSxDQUFDLGVBQWhCLENBQUE7QUFBQSxNQUlBLFVBQUEsR0FBYSxTQUFBLEdBQUE7QUFDVCxZQUFBLHlCQUFBO0FBQUEsUUFBQSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQWYsQ0FBc0IsbUJBQXRCLENBQUEsQ0FBQTtBQUFBLFFBRUEsY0FBQSxHQUFrQixJQUFJLENBQUMsUUFBUSxDQUFDLGlCQUFkLENBQUEsQ0FGbEIsQ0FBQTtBQUFBLFFBR0EsU0FBQSxHQUFZLENBQUMsWUFBRCxFQUFlLGlCQUFmLEVBQWtDLFlBQWxDLEVBQWdELHNCQUFoRCxDQUhaLENBQUE7ZUFLQSxjQUFjLENBQUMsT0FBZixDQUF1QixTQUFDLElBQUQsRUFBTyxDQUFQLEdBQUE7QUFDbkIsVUFBQSxJQUFJLFNBQVMsQ0FBQyxPQUFWLENBQWtCLElBQUksQ0FBQyxJQUF2QixDQUFBLElBQWdDLENBQXBDO21CQUNJLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBZixDQUFtQixtQkFBbkIsRUFESjtXQURtQjtRQUFBLENBQXZCLEVBTlM7TUFBQSxDQUpiLENBQUE7QUFBQSxNQWNBLElBQUksQ0FBQyxRQUFRLENBQUMsb0JBQWQsQ0FBbUMsU0FBQSxHQUFBO2VBQU0sVUFBQSxDQUFBLEVBQU47TUFBQSxDQUFuQyxDQWRBLENBQUE7QUFBQSxNQWVBLElBQUksQ0FBQyxRQUFRLENBQUMsc0JBQWQsQ0FBcUMsU0FBQSxHQUFBO2VBQU0sVUFBQSxD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

//# sourceURL=/Users/Marvin/.atom/packages/atom-material-ui/lib/config.coffee
