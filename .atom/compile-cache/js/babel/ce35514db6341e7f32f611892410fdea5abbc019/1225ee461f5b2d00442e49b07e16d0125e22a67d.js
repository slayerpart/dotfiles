function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _main = require('./main');

var _main2 = _interopRequireDefault(_main);

'use babel';
'use strict';

var init = function init() {
    _main2['default'].toggleClass(atom.config.get('atom-material-ui.tabs.tintedTabBar'), 'tinted-tab-bar');
    _main2['default'].toggleClass(atom.config.get('atom-material-ui.tabs.compactTabs'), 'compact-tab-bar');
    _main2['default'].toggleClass(atom.config.get('atom-material-ui.ui.panelShadows'), 'panel-shadows');
    _main2['default'].toggleClass(atom.config.get('atom-material-ui.ui.panelContrast'), 'panel-contrast');
    _main2['default'].toggleClass(atom.config.get('atom-material-ui.ui.animations'), 'use-animations');
    _main2['default'].toggleClass(atom.config.get('atom-material-ui.treeView.compactList'), 'compact-tree-view');
    _main2['default'].toggleClass(atom.config.get('atom-material-ui.treeView.blendTabs'), 'blend-tree-view');
    _main2['default'].toggleBlendTreeView(atom.config.get('atom-material-ui.treeView.blendTabs'));

    document.querySelector(':root').style.fontSize = atom.config.get('atom-material-ui.fonts.fontSize') + 'px';

    // FIXME: Object.observe is deprecated
    if (Object.observe && typeof Object.observe === 'function') {
        Object.observe(atom.workspace.getPanels('left'), function () {
            _main2['default'].toggleBlendTreeView(atom.config.get('atom-material-ui.treeView.blendTabs'));
        });
    }
};

// Check if there are custom icons packages
var checkPacks = function checkPacks() {
    var root = document.querySelector('atom-workspace');
    var loadedPackages = atom.packages.getActivePackages();
    var iconPacks = ['file-icons', 'file-type-icons', 'seti-icons', 'envygeeks-file-icons'];

    root.classList.remove('has-custom-icons');

    loadedPackages.forEach(function (pack) {
        if (iconPacks.indexOf(pack.name) >= 0) {
            root.classList.add('has-custom-icons');
        }
    });
};

module.exports = {
    apply: function apply() {
        atom.packages.onDidActivatePackage(function () {
            return checkPacks();
        });
        atom.packages.onDidDeactivatePackage(function () {
            return checkPacks();
        });

        init();

        // Font Size Settings

        atom.config.onDidChange('atom-material-ui.fonts.fontSize', function (value) {
            document.querySelector(':root').style.fontSize = value.newValue + 'px';
        });

        // Tab blending

        atom.config.onDidChange('atom-material-ui.treeView.blendTabs', function (value) {
            return _main2['default'].toggleBlendTreeView(value.newValue);
        });

        // className-toggling Settings

        atom.config.onDidChange('atom-material-ui.tabs.tintedTabBar', function (value) {
            return _main2['default'].toggleClass(value.newValue, 'tinted-tab-bar');
        });
        atom.config.onDidChange('atom-material-ui.tabs.compactTabs', function (value) {
            return _main2['default'].toggleClass(value.newValue, 'compact-tab-bar');
        });
        atom.config.onDidChange('atom-material-ui.ui.animations', function (value) {
            return _main2['default'].toggleClass(value.newValue, 'use-animations');
        });
        atom.config.onDidChange('atom-material-ui.ui.panelShadows', function (value) {
            return _main2['default'].toggleClass(value.newValue, 'panel-shadows');
        });
        atom.config.onDidChange('atom-material-ui.ui.panelContrast', function (value) {
            return _main2['default'].toggleClass(value.newValue, 'panel-contrast');
        });
        atom.config.onDidChange('atom-material-ui.treeView.compactList', function (value) {
            return _main2['default'].toggleClass(value.newValue, 'compact-tree-view');
        });
        atom.config.onDidChange('atom-material-ui.treeView.blendTabs', function (value) {
            if (value.newValue && !atom.config.get('atom-material-ui.tabs.tintedTabBar')) {
                atom.config.set('atom-material-ui.tabs.tintedTabBar', true);
            }

            _main2['default'].toggleClass(value.newValue, 'blend-tree-view');
        });
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9NYXJ2aW4vLmF0b20vcGFja2FnZXMvYXRvbS1tYXRlcmlhbC11aS9saWIvYW11LXNldHRpbmdzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O29CQUdnQixRQUFROzs7O0FBSHhCLFdBQVcsQ0FBQztBQUNaLFlBQVksQ0FBQzs7QUFJYixJQUFJLElBQUksR0FBRyxTQUFQLElBQUksR0FBYztBQUNsQixzQkFBSSxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsb0NBQW9DLENBQUMsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ3pGLHNCQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxtQ0FBbUMsQ0FBQyxFQUFFLGlCQUFpQixDQUFDLENBQUM7QUFDekYsc0JBQUksV0FBVyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGtDQUFrQyxDQUFDLEVBQUUsZUFBZSxDQUFDLENBQUM7QUFDdEYsc0JBQUksV0FBVyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLG1DQUFtQyxDQUFDLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztBQUN4RixzQkFBSSxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsZ0NBQWdDLENBQUMsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ3JGLHNCQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx1Q0FBdUMsQ0FBQyxFQUFFLG1CQUFtQixDQUFDLENBQUM7QUFDL0Ysc0JBQUksV0FBVyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHFDQUFxQyxDQUFDLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztBQUMzRixzQkFBSSxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDLENBQUM7O0FBRWhGLFlBQVEsQ0FBQyxhQUFhLENB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QUFFLGVBQWUsQ0FBQztTQUFBLENBQUMsQ0FBQztBQUN6SCxZQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxtQ0FBbUMsRUFBRSxVQUFDLEtBQUs7bUJBQUssa0JBQUksV0FBVyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsZ0JBQWdCLENBQUM7U0FBQSxDQUFDLENBQUM7QUFDM0gsWUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsdUNBQXVDLEVBQUUsVUFBQyxLQUFLO21CQUFLLGtCQUFJLFdBQVcsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLG1CQUFtQixDQUFDO1NBQUEsQ0FBQyxDQUFDO0FBQ2xJLFlBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLHFDQUFxQyxFQUFFLFVBQUMsS0FBSyxFQUFLO0FBQ3RFLGdCQUFJLEtBQUssQ0FBQyxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxvQ0FBb0MsQ0FBQyxFQUFFO0FBQzFFLG9CQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxvQ0FBb0MsRUFBRSxJQUFJLENBQUMsQ0FBQzthQUMvRDs7QUFFRCw4QkFBSSxXQUFXLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO1NBQ3RELENBQUMsQ0FBQztLQUNOO0NBQ0osQ0FBQyIsImZpbGUiOiIvVXNlcnMvTWFydmluLy5hdG9tL3BhY2thZ2VzL2F0b20tbWF0ZXJpYWwtdWkvbGliL2FtdS1zZXR0aW5ncy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgYW11IGZyb20gJy4vbWFpbic7XG5cbnZhciBpbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgYW11LnRvZ2dsZUNsYXNzKGF0b20uY29uZmlnLmdldCgnYXRvbS1tYXRlcmlhbC11aS50YWJzLnRpbnRlZFRhYkJhcicpLCAndGludGVkLXRhYi1iYXInKTtcbiAgICBhbXUudG9nZ2xlQ2xhc3MoYXRvbS5jb25maWcuZ2V0KCdhdG9tLW1hdGVyaWFsLXVpLnRhYnMuY29tcGFjdFRhYnMnKSwgJ2NvbXBhY3QtdGFiLWJhcicpO1xuICAgIGFtdS50b2dnbGVDbGFzcyhhdG9tLmNvbmZpZy5nZXQoJ2F0b20tbWF0ZXJpYWwtdWkudWkucGFuZWxTaGFkb3dzJyksICdwYW5lbC1zaGFkb3dzJyk7XG4gICAgYW11LnRvZ2dsZUNsYXNzKGF0b20uY29uZmlnLmdldCgnYXRvbS1tYXRlcmlhbC11aS51aS5wYW5lbENvbnRyYXN0JyksICdwYW5lbC1jb250cmFzdCcpO1xuICAgIGFtdS50b2dnbGVDbGFzcyhhdG9tLmNvbmZpZy5nZXQoJ2F0b20tbWF0ZXJpYWwtdWkudWkuYW5pbWF0aW9ucycpLCAndXNlLWFuaW1hdGlvbnMnKTtcbiAgICBhbXUudG9nZ2xlQ2xhc3MoYXRvbS5jb25maWcuZ2V0KCdhdG9tLW1hdGVyaWFsLXVpLnRyZWVWaWV3LmNvbXBhY3RMaXN0JyksICdjb21wYWN0LXRyZWUtdmlldycpO1xuICAgIGFtdS50b2dnbGVDbGFzcyhhdG9tLmNvbmZpZy5nZXQoJ2F0b20tbWF0ZXJpYWwtdWkudHJlZVZpZXcuYmxlbmRUYWJzJyksICdibGVuZC10cmVlLXZpZXcnKTtcbiAgICBhbXUudG9nZ2xlQmxlbmRUcmVlVmlldyhhdG9tLmNvbmZpZy5nZXQoJ2F0b20tbWF0ZXJpYWwtdWkudHJlZVZpZXcuYmxlbmRUYWJzJykpO1xuXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignOnJvb3QnKS5zdHlsZS5mb250U2l6ZSA9IGF0b20uY29uZmlnLmdldCgnYXRvbS1tYXRlcmlhbC11aS5mb250cy5mb250U2l6ZScpICsgJ3B4JztcblxuICAgIC8vIEZJWE1FOiBPYmplY3Qub2JzZXJ2ZSBpcyBkZXByZWNhdGVkXG4gICAgaWYgKE9iamVjdC5vYnNlcnZlICYmIHR5cGVvZiBPYmplY3Qub2JzZXJ2ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBPYmplY3Qub2JzZXJ2ZShhdG9tLndvcmtzcGFjZS5nZXRQYW5lbHMoJ2xlZnQnKSwgKCkgPT4ge1xuICAgICAgICAgICAgYW11LnRvZ2dsZUJsZW5kVHJlZVZpZXcoYXRvbS5jb25maWcuZ2V0KCdhdG9tLW1hdGVyaWFsLXVpLnRyZWVWaWV3LmJsZW5kVGFicycpKTtcbiAgICAgICAgfSk7XG4gICAgfVxufTtcblxuLy8gQ2hlY2sgaWYgdGhlcmUgYXJlIGN1c3RvbSBpY29ucyBwYWNrYWdlc1xudmFyIGNoZWNrUGFja3MgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcm9vdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2F0b20td29ya3NwYWNlJyk7XG4gICAgdmFyIGxvYWRlZFBhY2thZ2VzID0gYXRvbS5wYWNrYWdlcy5nZXRBY3RpdmVQYWNrYWdlcygpO1xuICAgIHZhciBpY29uUGFja3MgPSBbJ2ZpbGUtaWNvbnMnLCAnZmlsZS10eXBlLWljb25zJywgJ3NldGktaWNvbnMnLCAnZW52eWdlZWtzLWZpbGUtaWNvbnMnXTtcblxuICAgIHJvb3QuY2xhc3NMaXN0LnJlbW92ZSgnaGFzLWN1c3RvbS1pY29ucycpO1xuXG4gICAgbG9hZGVkUGFja2FnZXMuZm9yRWFjaCgocGFjaykgPT4ge1xuICAgICAgICBpZiAoaWNvblBhY2tzLmluZGV4T2YocGFjay5uYW1lKSA+PSAwKSB7XG4gICAgICAgICAgICByb290LmNsYXNzTGlzdC5hZGQoJ2hhcy1jdXN0b20taWNvbnMnKTtcbiAgICAgICAgfVxuICAgIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgYXBwbHkoKSB7XG4gICAgICAgIGF0b20ucGFja2FnZXMub25EaWRBY3RpdmF0ZVBhY2thZ2UoKCkgPT4gY2hlY2tQYWNrcygpKTtcbiAgICAgICAgYXRvbS5wYWNrYWdlcy5vbkRpZERlYWN0aXZhdGVQYWNrYWdlKCgpID0+IGNoZWNrUGFja3MoKSk7XG5cbiAgICAgICAgaW5pdCgpO1xuXG4gICAgICAgIC8vIEZvbnQgU2l6ZSBTZXR0aW5nc1xuXG4gICAgICAgIGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlKCdhdG9tLW1hdGVyaWFsLXVpLmZvbnRzLmZvbnRTaXplJywgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCc6cm9vdCcpLnN0eWxlLmZvbnRTaXplID0gdmFsdWUubmV3VmFsdWUgKyAncHgnO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBUYWIgYmxlbmRpbmdcblxuICAgICAgICBhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgnYXRvbS1tYXRlcmlhbC11aS50cmVlVmlldy5ibGVuZFRhYnMnLCAodmFsdWUpID0+IGFtdS50b2dnbGVCbGVuZFRyZWVWaWV3KHZhbHVlLm5ld1ZhbHVlKSk7XG5cbiAgICAgICAgLy8gY2xhc3NOYW1lLXRvZ2dsaW5nIFNldHRpbmdzXG5cbiAgICAgICAgYXRvbS5jb25maWcub25EaWRDaGFuZ2UoJ2F0b20tbWF0ZXJpYWwtdWkudGFicy50aW50ZWRUYWJCYXInLCAodmFsdWUpID0+IGFtdS50b2dnbGVDbGFzcyh2YWx1ZS5uZXdWYWx1ZSwgJ3RpbnRlZC10YWItYmFyJykpO1xuICAgICAgICBhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgnYXRvbS1tYXRlcmlhbC11aS50YWJzLmNvbXBhY3RUYWJzJywgKHZhbHVlKSA9PiBhbXUudG9nZ2xlQ2xhc3ModmFsdWUubmV3VmFsdWUsICdjb21wYWN0LXRhYi1iYXInKSk7XG4gICAgICAgIGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlKCdhdG9tLW1hdGVyaWFsLXVpLnVpLmFuaW1hdGlvbnMnLCAodmFsdWUpID0+IGFtdS50b2dnbGVDbGFzcyh2YWx1ZS5uZXdWYWx1ZSwgJ3VzZS1hbmltYXRpb25zJykpO1xuICAgICAgICBhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgnYXRvbS1tYXRlcmlhbC11aS51aS5wYW5lbFNoYWRvd3MnLCAodmFsdWUpID0+IGFtdS50b2dnbGVDbGFzcyh2YWx1ZS5uZXdWYWx1ZSwgJ3BhbmVsLXNoYWRvd3MnKSk7XG4gICAgICAgIGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlKCdhdG9tLW1hdGVyaWFsLXVpLnVpLnBhbmVsQ29udHJhc3QnLCAodmFsdWUpID0+IGFtdS50b2dnbGVDbGFzcyh2YWx1ZS5uZXdWYWx1ZSwgJ3BhbmVsLWNvbnRyYXN0JykpO1xuICAgICAgICBhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgnYXRvbS1tYXRlcmlhbC11aS50cmVlVmlldy5jb21wYWN0TGlzdCcsICh2YWx1ZSkgPT4gYW11LnRvZ2dsZUNsYXNzKHZhbHVlLm5ld1ZhbHVlLCAnY29tcGFjdC10cmVlLXZpZXcnKSk7XG4gICAgICAgIGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlKCdhdG9tLW1hdGVyaWFsLXVpLnRyZWVWaWV3LmJsZW5kVGFicycsICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgaWYgKHZhbHVlLm5ld1ZhbHVlICYmICFhdG9tLmNvbmZpZy5nZXQoJ2F0b20tbWF0ZXJpYWwtdWkudGFicy50aW50ZWRUYWJCYXInKSkge1xuICAgICAgICAgICAgICAgIGF0b20uY29uZmlnLnNldCgnYXRvbS1tYXRlcmlhbC11aS50YWJzLnRpbnRlZFRhYkJhcicsIHRydWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhbXUudG9nZ2xlQ2xhc3ModmFsdWUubmV3VmFsdWUsICdibGVuZC10cmVlLXZpZXcnKTtcbiAgICAgICAgfSk7XG4gICAgfVxufTtcbiJdfQ==
//# sourceURL=/Users/Marvin/.atom/packages/atom-material-ui/lib/amu-settings.js
