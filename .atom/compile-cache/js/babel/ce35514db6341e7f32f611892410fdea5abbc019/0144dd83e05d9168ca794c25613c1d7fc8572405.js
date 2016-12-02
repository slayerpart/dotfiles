Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _main = require('./main');

var _main2 = _interopRequireDefault(_main);

var _tinycolor2 = require('tinycolor2');

var _tinycolor22 = _interopRequireDefault(_tinycolor2);

var _colorTemplates = require('./color-templates');

var _colorTemplates2 = _interopRequireDefault(_colorTemplates);

'use babel';
'use strict';

function toCamelCase(str) {
    return str.replace(/\s(.)/g, function ($1) {
        return $1.toUpperCase();
    }).replace(/\s/g, '').replace(/^(.)/, function ($1) {
        return $1.toLowerCase();
    });
}

function apply() {

    atom.config.onDidChange('atom-material-ui.colors.accentColor', function () {
        return _main2['default'].writeConfig();
    });

    atom.config.onDidChange('atom-material-ui.colors.abaseColor', function (value) {
        var baseColor = (0, _tinycolor22['default'])(value.newValue.toRGBAString());

        if (atom.config.get('atom-material-ui.colors.genAccent')) {
            var accentColor = baseColor.complement().saturate(20).lighten(5);
            return atom.config.set('atom-material-ui.colors.accentColor', accentColor.toRgbString());
        }

        _main2['default'].writeConfig();
    });

    atom.config.onDidChange('atom-material-ui.colors.predefinedColor', function (value) {
        var newValue = toCamelCase(value.newValue);

        atom.config.set('atom-material-ui.colors.abaseColor', _colorTemplates2['default'][newValue].base);
        atom.config.set('atom-material-ui.colors.accentColor', _colorTemplates2['default'][newValue].accent);
    });
}

exports['default'] = {
    apply: apply
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9NYXJ2aW4vLmF0b20vcGFja2FnZXMvYXRvbS1tYXRlcmlhbC11aS9saWIvYW11LWNvbG9yLXNldHRpbmdzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztvQkFHZ0IsUUFBUTs7OzswQkFDRixZQUFZOzs7OzhCQUNQLG1CQUFtQjs7OztBQUw5QyxXQUFXLENBQUM7QUFDWixZQUFZLENBQUM7O0FBTWIsU0FBUyxXQUFXLENBQUMsR0FBRyxFQUFFO0FBQ3RCLFdBQU8sR0FBRyxDQUNMLE9BQU8sQ0FBQyxRQUFRLEVBQUUsVUFBUyxFQUFFLEVBQUU7QUFBRSxlQUFPLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQztLQUFFLENBQUMsQ0FDNUQsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FDbEIsT0FBTyxDQUFDLE1BQU0sRUFBRSxVQUFTLEVBQUUsRUFBRTtBQUFFLGVBQU8sRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDO0tBQUUsQ0FBQyxDQUFDO0NBQ25FOztBQUVELFNBQVMsS0FBSyxHQUFHOztBQUViLFFBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLHFDQUFxQyxFQUFFO2VBQU0sa0JBQUksV0FBVyxFQUFFO0tBQUEsQ0FBQyxDQUFDOztBQUV4RixRQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxvQ0FBb0MsRUFBRSxVQUFDLEtBQUssRUFBSztBQUNyRSxZQUFJLFNBQVMsR0FBRyw2QkFBVSxLQUFLLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUM7O0FBRXpELFlBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsbUNBQW1DLENBQUMsRUFBRTtBQUN0RCxnQkFBSSxXQUFXLEdBQUcsU0FBUyxDQUFDLFVBQVUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakUsbUJBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMscUNBQXFDLEVBQUUsV0FBVyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7U0FDNUY7O0FBRUQsMEJBQUksV0FBVyxFQUFFLENBQUM7S0FDckIsQ0FBQyxDQUFDOztBQUVILFFBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLHlDQUF5QyxFQUFFLFVBQUMsS0FBSyxFQUFLO0FBQzFFLFlBQUksUUFBUSxHQUFHLFdBQVcsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRTNDLFlBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLG9DQUFvQyxFQUFFLDRCQUFlLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3JGLFlBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHFDQUFxQyxFQUFFLDRCQUFlLFFBQVEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQzNGLENBQUMsQ0FBQztDQUNOOztxQkFFYztBQUNYLFNBQUssRUFBTCxLQUFLO0NBQ1IiLCJmaWxlIjoiL1VzZXJzL01hcnZpbi8uYXRvbS9wYWNrYWdlcy9hdG9tLW1hdGVyaWFsLXVpL2xpYi9hbXUtY29sb3Itc2V0dGluZ3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IGFtdSBmcm9tICcuL21haW4nO1xuaW1wb3J0IHRpbnljb2xvciBmcm9tICd0aW55Y29sb3IyJztcbmltcG9ydCBjb2xvclRlbXBsYXRlcyBmcm9tICcuL2NvbG9yLXRlbXBsYXRlcyc7XG5cbmZ1bmN0aW9uIHRvQ2FtZWxDYXNlKHN0cikge1xuICAgIHJldHVybiBzdHJcbiAgICAgICAgLnJlcGxhY2UoL1xccyguKS9nLCBmdW5jdGlvbigkMSkgeyByZXR1cm4gJDEudG9VcHBlckNhc2UoKTsgfSlcbiAgICAgICAgLnJlcGxhY2UoL1xccy9nLCAnJylcbiAgICAgICAgLnJlcGxhY2UoL14oLikvLCBmdW5jdGlvbigkMSkgeyByZXR1cm4gJDEudG9Mb3dlckNhc2UoKTsgfSk7XG59XG5cbmZ1bmN0aW9uIGFwcGx5KCkge1xuXG4gICAgYXRvbS5jb25maWcub25EaWRDaGFuZ2UoJ2F0b20tbWF0ZXJpYWwtdWkuY29sb3JzLmFjY2VudENvbG9yJywgKCkgPT4gYW11LndyaXRlQ29uZmlnKCkpO1xuXG4gICAgYXRvbS5jb25maWcub25EaWRDaGFuZ2UoJ2F0b20tbWF0ZXJpYWwtdWkuY29sb3JzLmFiYXNlQ29sb3InLCAodmFsdWUpID0+IHtcbiAgICAgICAgdmFyIGJhc2VDb2xvciA9IHRpbnljb2xvcih2YWx1ZS5uZXdWYWx1ZS50b1JHQkFTdHJpbmcoKSk7XG5cbiAgICAgICAgaWYgKGF0b20uY29uZmlnLmdldCgnYXRvbS1tYXRlcmlhbC11aS5jb2xvcnMuZ2VuQWNjZW50JykpIHtcbiAgICAgICAgICAgIGxldCBhY2NlbnRDb2xvciA9IGJhc2VDb2xvci5jb21wbGVtZW50KCkuc2F0dXJhdGUoMjApLmxpZ2h0ZW4oNSk7XG4gICAgICAgICAgICByZXR1cm4gYXRvbS5jb25maWcuc2V0KCdhdG9tLW1hdGVyaWFsLXVpLmNvbG9ycy5hY2NlbnRDb2xvcicsIGFjY2VudENvbG9yLnRvUmdiU3RyaW5nKCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgYW11LndyaXRlQ29uZmlnKCk7XG4gICAgfSk7XG5cbiAgICBhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgnYXRvbS1tYXRlcmlhbC11aS5jb2xvcnMucHJlZGVmaW5lZENvbG9yJywgKHZhbHVlKSA9PiB7XG4gICAgICAgIHZhciBuZXdWYWx1ZSA9IHRvQ2FtZWxDYXNlKHZhbHVlLm5ld1ZhbHVlKTtcblxuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ2F0b20tbWF0ZXJpYWwtdWkuY29sb3JzLmFiYXNlQ29sb3InLCBjb2xvclRlbXBsYXRlc1tuZXdWYWx1ZV0uYmFzZSk7XG4gICAgICAgIGF0b20uY29uZmlnLnNldCgnYXRvbS1tYXRlcmlhbC11aS5jb2xvcnMuYWNjZW50Q29sb3InLCBjb2xvclRlbXBsYXRlc1tuZXdWYWx1ZV0uYWNjZW50KTtcbiAgICB9KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIGFwcGx5XG59O1xuIl19
//# sourceURL=/Users/Marvin/.atom/packages/atom-material-ui/lib/amu-color-settings.js
