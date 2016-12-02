Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.install = install;
exports.installPackage = installPackage;

var _helper = require('./helper');

'use babel';
var FS = require('fs');
var Path = require('path');
var View = require('./view');

window.__sb_package_deps = window.__sb_package_deps || [];

function install(packageName) {
  var enablePackages = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

  if (!packageName) throw new Error('packageName is required');

  var packageDeps = atom.packages.getLoadedPackage(packageName).metadata['package-deps'] || [];
  var packagesToInstall = [];
  packageDeps.forEach(function (name) {
    if (__sb_package_deps.indexOf(name) === -1) {
      __sb_package_deps.push(name);
      if (!atom.packages.resolvePackagePath(name)) {
        packagesToInstall.push(name);
      } else if (!atom.packages.getActivePackage(name) && enablePackages) {
        atom.packages.enablePackage(name);
        atom.packages.activatePackage(name);
      }
    }
  });
  if (packagesToInstall.length) {
    return installPackage(packageName, packagesToInstall);
  } else return Promise.resolve();
}

function installPackage(packageName, packageNames) {
  var view = new View(packageName, packageNames);
  return view.createNotification().then(function () {
    return (0, _helper.installPackages)(packageNames, function (name) {
      view.markFinished();
      atom.packages.enablePackage(name);
      atom.packages.activatePackage(name);
    }, function (detail) {
      view.notification.dismiss();
      atom.notifications.addError('Error installing ' + packageName + ' dependencies', { detail: detail });
    });
  });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9NYXJ2aW4vLmF0b20vcGFja2FnZXMvbGludGVyLWZsYWtlOC9ub2RlX21vZHVsZXMvYXRvbS1wYWNrYWdlLWRlcHMvbGliL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O3NCQUk4QixVQUFVOztBQUp4QyxXQUFXLENBQUE7QUFDWCxJQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDeEIsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQzVCLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQTs7QUFHOUIsTUFBTSxDQUFDLGlCQUFpQixHQUFHLE1BQU0sQ0FBQyxpQkFBaUIsSUFBSSxFQUFFLENBQUE7O0FBRWxELFNBQVMsT0FBTyxDQUFDLFdBQVcsRUFBMEI7TUFBeEIsY0FBYyx5REFBRyxLQUFLOztBQUN6RCxNQUFJLENBQUMsV0FBVyxFQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMseUJBQXlCLENBQUMsQ0FBQTs7QUFFNUQsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxDQUFBO0FBQzlGLE1BQU0saUJBQWlCLEdBQUcsRUFBRSxDQUFBO0FBQzVCLGFBQVcsQ0FBQyxPQUFPLENBQUMsVUFBUyxJQUFJLEVBQUU7QUFDakMsUUFBSSxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFDMUMsdUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQzVCLFVBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxFQUFFO0FBQzNDLHlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtPQUM3QixNQUFNLElBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLGNBQWMsRUFBRTtBQUNqRSxZQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUNqQyxZQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQTtPQUNwQztLQUNGO0dBQ0YsQ0FBQyxDQUFBO0FBQ0YsTUFBSSxpQkFBaUIsQ0FBQyxNQUFNLEVBQUU7QUFDNUIsV0FBTyxjQUFjLENBQUMsV0FBVyxFQUFFLGlCQUFpQixDQUFDLENBQUE7R0FDdEQsTUFBTSxPQUFPLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQTtDQUNoQzs7QUFFTSxTQUFTLGNBQWMsQ0FBQyxXQUFXLEVBQUUsWUFBWSxFQUFFO0FBQ3hELE1BQU0sSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRSxZQUFZLENBQUMsQ0FBQTtBQUNoRCxTQUFPLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLElBQUksQ0FBQztXQUNwQyw2QkFBZ0IsWUFBWSxFQUFFLFVBQVMsSUFBSSxFQUFFO0FBQzNDLFVBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQTtBQUNuQixVQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUNqQyxVQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQTtLQUNwQyxFQUFFLFVBQVMsTUFBTSxFQUFFO0FBQ2xCLFVBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDM0IsVUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLHVCQUFxQixXQUFXLG9CQUFpQixFQUFDLE1BQU0sRUFBTixNQUFNLEVBQUMsQ0FBQyxDQUFBO0tBQ3RGLENBQUM7R0FBQSxDQUNILENBQUE7Q0FDRiIsImZpbGUiOiIvVXNlcnMvTWFydmluLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1mbGFrZTgvbm9kZV9tb2R1bGVzL2F0b20tcGFja2FnZS1kZXBzL2xpYi9tYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcbmNvbnN0IEZTID0gcmVxdWlyZSgnZnMnKVxuY29uc3QgUGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuY29uc3QgVmlldyA9IHJlcXVpcmUoJy4vdmlldycpXG5pbXBvcnQge2luc3RhbGxQYWNrYWdlc30gZnJvbSAnLi9oZWxwZXInXG5cbndpbmRvdy5fX3NiX3BhY2thZ2VfZGVwcyA9IHdpbmRvdy5fX3NiX3BhY2thZ2VfZGVwcyB8fCBbXVxuXG5leHBvcnQgZnVuY3Rpb24gaW5zdGFsbChwYWNrYWdlTmFtZSwgZW5hYmxlUGFja2FnZXMgPSBmYWxzZSkge1xuICBpZiAoIXBhY2thZ2VOYW1lKSB0aHJvdyBuZXcgRXJyb3IoJ3BhY2thZ2VOYW1lIGlzIHJlcXVpcmVkJylcblxuICBjb25zdCBwYWNrYWdlRGVwcyA9IGF0b20ucGFja2FnZXMuZ2V0TG9hZGVkUGFja2FnZShwYWNrYWdlTmFtZSkubWV0YWRhdGFbJ3BhY2thZ2UtZGVwcyddIHx8IFtdXG4gIGNvbnN0IHBhY2thZ2VzVG9JbnN0YWxsID0gW11cbiAgcGFja2FnZURlcHMuZm9yRWFjaChmdW5jdGlvbihuYW1lKSB7XG4gICAgaWYgKF9fc2JfcGFja2FnZV9kZXBzLmluZGV4T2YobmFtZSkgPT09IC0xKSB7XG4gICAgICBfX3NiX3BhY2thZ2VfZGVwcy5wdXNoKG5hbWUpXG4gICAgICBpZiAoIWF0b20ucGFja2FnZXMucmVzb2x2ZVBhY2thZ2VQYXRoKG5hbWUpKSB7XG4gICAgICAgIHBhY2thZ2VzVG9JbnN0YWxsLnB1c2gobmFtZSlcbiAgICAgIH0gZWxzZSBpZighYXRvbS5wYWNrYWdlcy5nZXRBY3RpdmVQYWNrYWdlKG5hbWUpICYmIGVuYWJsZVBhY2thZ2VzKSB7XG4gICAgICAgIGF0b20ucGFja2FnZXMuZW5hYmxlUGFja2FnZShuYW1lKVxuICAgICAgICBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZShuYW1lKVxuICAgICAgfVxuICAgIH1cbiAgfSlcbiAgaWYgKHBhY2thZ2VzVG9JbnN0YWxsLmxlbmd0aCkge1xuICAgIHJldHVybiBpbnN0YWxsUGFja2FnZShwYWNrYWdlTmFtZSwgcGFja2FnZXNUb0luc3RhbGwpXG4gIH0gZWxzZSByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGluc3RhbGxQYWNrYWdlKHBhY2thZ2VOYW1lLCBwYWNrYWdlTmFtZXMpIHtcbiAgY29uc3QgdmlldyA9IG5ldyBWaWV3KHBhY2thZ2VOYW1lLCBwYWNrYWdlTmFtZXMpXG4gIHJldHVybiB2aWV3LmNyZWF0ZU5vdGlmaWNhdGlvbigpLnRoZW4oKCkgPT5cbiAgICBpbnN0YWxsUGFja2FnZXMocGFja2FnZU5hbWVzLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgICB2aWV3Lm1hcmtGaW5pc2hlZCgpXG4gICAgICBhdG9tLnBhY2thZ2VzLmVuYWJsZVBhY2thZ2UobmFtZSlcbiAgICAgIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKG5hbWUpXG4gICAgfSwgZnVuY3Rpb24oZGV0YWlsKSB7XG4gICAgICB2aWV3Lm5vdGlmaWNhdGlvbi5kaXNtaXNzKClcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihgRXJyb3IgaW5zdGFsbGluZyAke3BhY2thZ2VOYW1lfSBkZXBlbmRlbmNpZXNgLCB7ZGV0YWlsfSlcbiAgICB9KVxuICApXG59XG4iXX0=
//# sourceURL=/Users/Marvin/.atom/packages/linter-flake8/node_modules/atom-package-deps/lib/main.js
