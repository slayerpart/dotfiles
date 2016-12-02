function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _path = require('path');

var path = _interopRequireWildcard(_path);

'use babel';

var goodPath = path.join(__dirname, 'fixtures', 'good.py');
var badPath = path.join(__dirname, 'fixtures', 'bad.py');
var errwarnPath = path.join(__dirname, 'fixtures', 'errwarn.py');
var fixturePath = path.join(__dirname, 'fixtures');

describe('The flake8 provider for Linter', function () {
  var lint = require('../lib/main').provideLinter().lint;

  beforeEach(function () {
    waitsForPromise(function () {
      return Promise.all([atom.packages.activatePackage('linter-flake8'), atom.packages.activatePackage('language-python').then(function () {
        return atom.workspace.open(goodPath);
      })]);
    });
  });

  it('should be in the packages list', function () {
    return expect(atom.packages.isPackageLoaded('linter-flake8')).toBe(true);
  });

  it('should be an active package', function () {
    return expect(atom.packages.isPackageActive('linter-flake8')).toBe(true);
  });

  describe('checks bad.py and', function () {
    var editor = null;
    beforeEach(function () {
      waitsForPromise(function () {
        return atom.workspace.open(badPath).then(function (openEditor) {
          editor = openEditor;
        });
      });
    });

    it('finds at least one message', function () {
      return waitsForPromise(function () {
        return lint(editor).then(function (messages) {
          return expect(messages.length).toBeGreaterThan(0);
        });
      });
    });

    it('verifies that message', function () {
      return waitsForPromise(function () {
        return lint(editor).then(function (messages) {
          expect(messages[0].type).toBeDefined();
          expect(messages[0].type).toEqual('Warning');
          expect(messages[0].html).not.toBeDefined();
          expect(messages[0].text).toBeDefined();
          expect(messages[0].text).toEqual('F821 — undefined name \'asfd\'');
          expect(messages[0].filePath).toBeDefined();
          expect(messages[0].filePath).toMatch(/.+spec[\\\/]fixtures[\\\/]bad\.py$/);
          expect(messages[0].range).toBeDefined();
          expect(messages[0].range.length).toEqual(2);
          expect(messages[0].range).toEqual([[0, 0], [0, 4]]);
        });
      });
    });

    it('checks that the message is an error if flakeErrors is set', function () {
      atom.config.set('linter-flake8.flakeErrors', true);
      waitsForPromise(function () {
        return lint(editor).then(function (messages) {
          expect(messages[0].type).toBeDefined();
          expect(messages[0].type).toEqual('Error');
        });
      });
    });
  });

  describe('checks errwarn.py and', function () {
    var editor = null;

    beforeEach(function () {
      waitsForPromise(function () {
        return atom.workspace.open(errwarnPath).then(function (openEditor) {
          editor = openEditor;
        });
      });
    });

    it('finds at least one message', function () {
      return waitsForPromise(function () {
        return lint(editor).then(function (messages) {
          return expect(messages.length).toBeGreaterThan(0);
        });
      });
    });

    it('finds the message is a warning if pep8ErrorsToWarnings is set', function () {
      atom.config.set('linter-flake8.pep8ErrorsToWarnings', true);
      waitsForPromise(function () {
        return lint(editor).then(function (messages) {
          expect(messages[0].type).toBeDefined();
          expect(messages[0].type).toEqual('Warning');
        });
      });
    });

    it('finds the message is an error if pep8ErrorsToWarnings is set', function () {
      atom.config.set('linter-flake8.pep8ErrorsToWarnings', false);
      waitsForPromise(function () {
        return lint(editor).then(function (messages) {
          expect(messages[0].type).toBeDefined();
          expect(messages[0].type).toEqual('Error');
        });
      });
    });
  });

  it('finds nothing wrong with a valid file', function () {
    waitsForPromise(function () {
      return atom.workspace.open(goodPath).then(function (editor) {
        return lint(editor).then(function (messages) {
          return expect(messages.length).toEqual(0);
        });
      });
    });
  });

  describe('executable path', function () {
    var helpers = require('atom-linter');
    var editor = null;
    var execSpy = null;
    function fakeExec() {
      return new Promise(function (resolve) {
        return resolve('');
      });
    }

    beforeEach(function () {
      atom.project.addPath(fixturePath);

      execSpy = spyOn(helpers, 'exec').andCallFake(fakeExec);

      waitsForPromise(function () {
        return atom.workspace.open(badPath).then(function (openEditor) {
          editor = openEditor;
        });
      });
    });

    it('finds executable relative to project', function () {
      waitsForPromise(function () {
        atom.config.set('linter-flake8.executablePath', path.join('$PROJECT', 'flake8'));
        return lint(editor).then(function () {
          expect(execSpy.mostRecentCall.args[0]).toEqual(path.join(fixturePath, 'flake8'));
        });
      });
    });

    it('finds executable using project name', function () {
      waitsForPromise(function () {
        atom.config.set('linter-flake8.executablePath', path.join('$PROJECT_NAME', 'flake8'));
        return lint(editor).then(function () {
          expect(execSpy.mostRecentCall.args[0]).toEqual(path.join('fixtures', 'flake8'));
        });
      });
    });

    it('normalizes executable path', function () {
      waitsForPromise(function () {
        atom.config.set('linter-flake8.executablePath', path.join(fixturePath, '..', 'fixtures', 'flake8'));
        return lint(editor).then(function () {
          expect(execSpy.mostRecentCall.args[0]).toEqual(path.join(fixturePath, 'flake8'));
        });
      });
    });

    it('finds backup executable', function () {
      waitsForPromise(function () {
        var flakeNotFound = path.join('$PROJECT', 'flake8_notfound');
        var flakeBackup = path.join(fixturePath, 'flake8_backup');
        atom.config.set('linter-flake8.executablePath', flakeNotFound + ';' + flakeBackup);
        return lint(editor).then(function () {
          expect(execSpy.mostRecentCall.args[0]).toEqual(path.join(fixturePath, 'flake8_backup'));
        });
      });
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9NYXJ2aW4vLmF0b20vcGFja2FnZXMvbGludGVyLWZsYWtlOC9zcGVjL2xpbnRlci1mbGFrZTgtc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztvQkFFc0IsTUFBTTs7SUFBaEIsSUFBSTs7QUFGaEIsV0FBVyxDQUFDOztBQUlaLElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUM3RCxJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDM0QsSUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQ25FLElBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDOztBQUVyRCxRQUFRLENBQUMsZ0NBQWdDLEVBQUUsWUFBTTtBQUMvQyxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsYUFBYSxFQUFFLENBQUMsSUFBSSxDQUFDOztBQUV6RCxZQUFVLENBQUMsWUFBTTtBQUNmLG1CQUFlLENBQUM7YUFDZCxPQUFPLENBQUMsR0FBRyxDQUFDLENBQ1YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsZUFBZSxDQUFDLEVBQzlDLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLGlCQUFpQixDQUFDLENBQUMsSUFBSSxDQUFDO2VBQ3BELElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztPQUFBLENBQzlCLENBQ0YsQ0FBQztLQUFBLENBQ0gsQ0FBQztHQUNILENBQUMsQ0FBQzs7QUFFSCxJQUFFLENBQUMsZ0NBQWdDLEVBQUU7V0FDbkMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxD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YUFBYSxTQUFJLFdBQVcsQ0FDaEMsQ0FBQztBQUNGLGVBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFNO0FBQzdCLGdCQUFNLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQzVDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLGVBQWUsQ0FBQyxDQUN4QyxDQUFDO1NBQ0gsQ0FBQyxDQUFDO09BQ0osQ0FBQyxDQUFDO0tBQ0osQ0FBQyxDQUFDO0dBQ0osQ0FBQyxDQUFDO0NBQ0osQ0FBQyxDQUFDIiwiZmlsZSI6Ii9Vc2Vycy9NYXJ2aW4vLmF0b20vcGFja2FnZXMvbGludGVyLWZsYWtlOC9zcGVjL2xpbnRlci1mbGFrZTgtc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuXG5jb25zdCBnb29kUGF0aCA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdmaXh0dXJlcycsICdnb29kLnB5Jyk7XG5jb25zdCBiYWRQYXRoID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2ZpeHR1cmVzJywgJ2JhZC5weScpO1xuY29uc3QgZXJyd2FyblBhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZml4dHVyZXMnLCAnZXJyd2Fybi5weScpO1xuY29uc3QgZml4dHVyZVBhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZml4dHVyZXMnKTtcblxuZGVzY3JpYmUoJ1RoZSBmbGFrZTggcHJvdmlkZXIgZm9yIExpbnRlcicsICgpID0+IHtcbiAgY29uc3QgbGludCA9IHJlcXVpcmUoJy4uL2xpYi9tYWluJykucHJvdmlkZUxpbnRlcigpLmxpbnQ7XG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgd2FpdHNGb3JQcm9taXNlKCgpID0+XG4gICAgICBQcm9taXNlLmFsbChbXG4gICAgICAgIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdsaW50ZXItZmxha2U4JyksXG4gICAgICAgIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdsYW5ndWFnZS1weXRob24nKS50aGVuKCgpID0+XG4gICAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3Blbihnb29kUGF0aClcbiAgICAgICAgKVxuICAgICAgXSlcbiAgICApO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIGJlIGluIHRoZSBwYWNrYWdlcyBsaXN0JywgKCkgPT5cbiAgICBleHBlY3QoYXRvbS5wYWNrYWdlcy5pc1BhY2thZ2VMb2FkZWQoJ2xpbnRlci1mbGFrZTgnKSkudG9CZSh0cnVlKVxuICApO1xuXG4gIGl0KCdzaG91bGQgYmUgYW4gYWN0aXZlIHBhY2thZ2UnLCAoKSA9PlxuICAgIGV4cGVjdChhdG9tLnBhY2thZ2VzLmlzUGFja2FnZUFjdGl2ZSgnbGludGVyLWZsYWtlOCcpKS50b0JlKHRydWUpXG4gICk7XG5cbiAgZGVzY3JpYmUoJ2NoZWNrcyBiYWQucHkgYW5kJywgKCkgPT4ge1xuICAgIGxldCBlZGl0b3IgPSBudWxsO1xuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+XG4gICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oYmFkUGF0aCkudGhlbihvcGVuRWRpdG9yID0+IHsgZWRpdG9yID0gb3BlbkVkaXRvcjsgfSlcbiAgICAgICk7XG4gICAgfSk7XG5cbiAgICBpdCgnZmluZHMgYXQgbGVhc3Qgb25lIG1lc3NhZ2UnLCAoKSA9PlxuICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+XG4gICAgICAgIGxpbnQoZWRpdG9yKS50aGVuKG1lc3NhZ2VzID0+XG4gICAgICAgICAgZXhwZWN0KG1lc3NhZ2VzLmxlbmd0aCkudG9CZUdyZWF0ZXJUaGFuKDApXG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuXG4gICAgaXQoJ3ZlcmlmaWVzIHRoYXQgbWVzc2FnZScsICgpID0+XG4gICAgICB3YWl0c0ZvclByb21pc2UoKCkgPT5cbiAgICAgICAgbGludChlZGl0b3IpLnRoZW4obWVzc2FnZXMgPT4ge1xuICAgICAgICAgIGV4cGVjdChtZXNzYWdlc1swXS50eXBlKS50b0JlRGVmaW5lZCgpO1xuICAgICAgICAgIGV4cGVjdChtZXNzYWdlc1swXS50eXBlKS50b0VxdWFsKCdXYXJuaW5nJyk7XG4gICAgICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLmh0bWwpLm5vdC50b0JlRGVmaW5lZCgpO1xuICAgICAgICAgIGV4cGVjdChtZXNzYWdlc1swXS50ZXh0KS50b0JlRGVmaW5lZCgpO1xuICAgICAgICAgIGV4cGVjdChtZXNzYWdlc1swXS50ZXh0KS50b0VxdWFsKCdGODIxIOKAlCB1bmRlZmluZWQgbmFtZSBcXCdhc2ZkXFwnJyk7XG4gICAgICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLmZpbGVQYXRoKS50b0JlRGVmaW5lZCgpO1xuICAgICAgICAgIGV4cGVjdChtZXNzYWdlc1swXS5maWxlUGF0aCkudG9NYXRjaCgvLitzcGVjW1xcXFxcXC9dZml4dHVyZXNbXFxcXFxcL11iYWRcXC5weSQvKTtcbiAgICAgICAgICBleHBlY3QobWVzc2FnZXNbMF0ucmFuZ2UpLnRvQmVEZWZpbmVkKCk7XG4gICAgICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLnJhbmdlLmxlbmd0aCkudG9FcXVhbCgyKTtcbiAgICAgICAgICBleHBlY3QobWVzc2FnZXNbMF0ucmFuZ2UpLnRvRXF1YWwoW1swLCAwXSwgWzAsIDRdXSk7XG4gICAgICAgIH0pXG4gICAgICApXG4gICAgKTtcblxuICAgIGl0KCdjaGVja3MgdGhhdCB0aGUgbWVzc2FnZSBpcyBhbiBlcnJvciBpZiBmbGFrZUVycm9ycyBpcyBzZXQnLCAoKSA9PiB7XG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ2xpbnRlci1mbGFrZTguZmxha2VFcnJvcnMnLCB0cnVlKTtcbiAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PlxuICAgICAgICBsaW50KGVkaXRvcikudGhlbihtZXNzYWdlcyA9PiB7XG4gICAgICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLnR5cGUpLnRvQmVEZWZpbmVkKCk7XG4gICAgICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLnR5cGUpLnRvRXF1YWwoJ0Vycm9yJyk7XG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnY2hlY2tzIGVycndhcm4ucHkgYW5kJywgKCkgPT4ge1xuICAgIGxldCBlZGl0b3IgPSBudWxsO1xuXG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICB3YWl0c0ZvclByb21pc2UoKCkgPT5cbiAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbihlcnJ3YXJuUGF0aCkudGhlbihvcGVuRWRpdG9yID0+IHsgZWRpdG9yID0gb3BlbkVkaXRvcjsgfSlcbiAgICAgICk7XG4gICAgfSk7XG5cbiAgICBpdCgnZmluZHMgYXQgbGVhc3Qgb25lIG1lc3NhZ2UnLCAoKSA9PlxuICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+XG4gICAgICAgIGxpbnQoZWRpdG9yKS50aGVuKG1lc3NhZ2VzID0+XG4gICAgICAgICAgZXhwZWN0KG1lc3NhZ2VzLmxlbmd0aCkudG9CZUdyZWF0ZXJUaGFuKDApXG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuXG4gICAgaXQoJ2ZpbmRzIHRoZSBtZXNzYWdlIGlzIGEgd2FybmluZyBpZiBwZXA4RXJyb3JzVG9XYXJuaW5ncyBpcyBzZXQnLCAoKSA9PiB7XG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ2xpbnRlci1mbGFrZTgucGVwOEVycm9yc1RvV2FybmluZ3MnLCB0cnVlKTtcbiAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PlxuICAgICAgICBsaW50KGVkaXRvcikudGhlbihtZXNzYWdlcyA9PiB7XG4gICAgICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLnR5cGUpLnRvQmVEZWZpbmVkKCk7XG4gICAgICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLnR5cGUpLnRvRXF1YWwoJ1dhcm5pbmcnKTtcbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgfSk7XG5cbiAgICBpdCgnZmluZHMgdGhlIG1lc3NhZ2UgaXMgYW4gZXJyb3IgaWYgcGVwOEVycm9yc1RvV2FybmluZ3MgaXMgc2V0JywgKCkgPT4ge1xuICAgICAgYXRvbS5jb25maWcuc2V0KCdsaW50ZXItZmxha2U4LnBlcDhFcnJvcnNUb1dhcm5pbmdzJywgZmFsc2UpO1xuICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+XG4gICAgICAgIGxpbnQoZWRpdG9yKS50aGVuKG1lc3NhZ2VzID0+IHtcbiAgICAgICAgICBleHBlY3QobWVzc2FnZXNbMF0udHlwZSkudG9CZURlZmluZWQoKTtcbiAgICAgICAgICBleHBlY3QobWVzc2FnZXNbMF0udHlwZSkudG9FcXVhbCgnRXJyb3InKTtcbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGl0KCdmaW5kcyBub3RoaW5nIHdyb25nIHdpdGggYSB2YWxpZCBmaWxlJywgKCkgPT4ge1xuICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PlxuICAgICAgYXRvbS53b3Jrc3BhY2Uub3Blbihnb29kUGF0aCkudGhlbihlZGl0b3IgPT5cbiAgICAgICAgbGludChlZGl0b3IpLnRoZW4obWVzc2FnZXMgPT5cbiAgICAgICAgICBleHBlY3QobWVzc2FnZXMubGVuZ3RoKS50b0VxdWFsKDApXG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuICB9KTtcblxuICBkZXNjcmliZSgnZXhlY3V0YWJsZSBwYXRoJywgKCkgPT4ge1xuICAgIGNvbnN0IGhlbHBlcnMgPSByZXF1aXJlKCdhdG9tLWxpbnRlcicpO1xuICAgIGxldCBlZGl0b3IgPSBudWxsO1xuICAgIGxldCBleGVjU3B5ID0gbnVsbDtcbiAgICBmdW5jdGlvbiBmYWtlRXhlYygpIHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gcmVzb2x2ZSgnJykpO1xuICAgIH1cblxuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgYXRvbS5wcm9qZWN0LmFkZFBhdGgoZml4dHVyZVBhdGgpO1xuXG4gICAgICBleGVjU3B5ID0gc3B5T24oaGVscGVycywgJ2V4ZWMnKS5hbmRDYWxsRmFrZShmYWtlRXhlYyk7XG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PlxuICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKGJhZFBhdGgpLnRoZW4ob3BlbkVkaXRvciA9PiB7IGVkaXRvciA9IG9wZW5FZGl0b3I7IH0pXG4gICAgICApO1xuICAgIH0pO1xuXG4gICAgaXQoJ2ZpbmRzIGV4ZWN1dGFibGUgcmVsYXRpdmUgdG8gcHJvamVjdCcsICgpID0+IHtcbiAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7XG4gICAgICAgIGF0b20uY29uZmlnLnNldCgnbGludGVyLWZsYWtlOC5leGVjdXRhYmxlUGF0aCcsXG4gICAgICAgICAgcGF0aC5qb2luKCckUFJPSkVDVCcsICdmbGFrZTgnKVxuICAgICAgICApO1xuICAgICAgICByZXR1cm4gbGludChlZGl0b3IpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIGV4cGVjdChleGVjU3B5Lm1vc3RSZWNlbnRDYWxsLmFyZ3NbMF0pLnRvRXF1YWwoXG4gICAgICAgICAgICBwYXRoLmpvaW4oZml4dHVyZVBhdGgsICdmbGFrZTgnKVxuICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnZmluZHMgZXhlY3V0YWJsZSB1c2luZyBwcm9qZWN0IG5hbWUnLCAoKSA9PiB7XG4gICAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4ge1xuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ2xpbnRlci1mbGFrZTguZXhlY3V0YWJsZVBhdGgnLFxuICAgICAgICAgIHBhdGguam9pbignJFBST0pFQ1RfTkFNRScsICdmbGFrZTgnKVxuICAgICAgICApO1xuICAgICAgICByZXR1cm4gbGludChlZGl0b3IpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIGV4cGVjdChleGVjU3B5Lm1vc3RSZWNlbnRDYWxsLmFyZ3NbMF0pLnRvRXF1YWwoXG4gICAgICAgICAgICBwYXRoLmpvaW4oJ2ZpeHR1cmVzJywgJ2ZsYWtlOCcpXG4gICAgICAgICAgKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdub3JtYWxpemVzIGV4ZWN1dGFibGUgcGF0aCcsICgpID0+IHtcbiAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7XG4gICAgICAgIGF0b20uY29uZmlnLnNldCgnbGludGVyLWZsYWtlOC5leGVjdXRhYmxlUGF0aCcsXG4gICAgICAgICAgcGF0aC5qb2luKGZpeHR1cmVQYXRoLCAnLi4nLCAnZml4dHVyZXMnLCAnZmxha2U4JylcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIGxpbnQoZWRpdG9yKS50aGVuKCgpID0+IHtcbiAgICAgICAgICBleHBlY3QoZXhlY1NweS5tb3N0UmVjZW50Q2FsbC5hcmdzWzBdKS50b0VxdWFsKFxuICAgICAgICAgICAgcGF0aC5qb2luKGZpeHR1cmVQYXRoLCAnZmxha2U4JylcbiAgICAgICAgICApO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ2ZpbmRzIGJhY2t1cCBleGVjdXRhYmxlJywgKCkgPT4ge1xuICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHtcbiAgICAgICAgY29uc3QgZmxha2VOb3RGb3VuZCA9IHBhdGguam9pbignJFBST0pFQ1QnLCAnZmxha2U4X25vdGZvdW5kJyk7XG4gICAgICAgIGNvbnN0IGZsYWtlQmFja3VwID0gcGF0aC5qb2luKGZpeHR1cmVQYXRoLCAnZmxha2U4X2JhY2t1cCcpO1xuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ2xpbnRlci1mbGFrZTguZXhlY3V0YWJsZVBhdGgnLFxuICAgICAgICAgIGAke2ZsYWtlTm90Rm91bmR9OyR7Zmxha2VCYWNrdXB9YFxuICAgICAgICApO1xuICAgICAgICByZXR1cm4gbGludChlZGl0b3IpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIGV4cGVjdChleGVjU3B5Lm1vc3RSZWNlbnRDYWxsLmFyZ3NbMF0pLnRvRXF1YWwoXG4gICAgICAgICAgICBwYXRoLmpvaW4oZml4dHVyZVBhdGgsICdmbGFrZThfYmFja3VwJylcbiAgICAgICAgICApO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19
//# sourceURL=/Users/Marvin/.atom/packages/linter-flake8/spec/linter-flake8-spec.js
