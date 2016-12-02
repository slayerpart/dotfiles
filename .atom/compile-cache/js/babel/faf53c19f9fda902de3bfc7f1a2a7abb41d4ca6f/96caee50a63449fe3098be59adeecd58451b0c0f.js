'use babel';

describe('The flake8 provider for Linter', function () {
  var lint = require('../lib/main').provideLinter().lint;

  beforeEach(function () {
    waitsForPromise(function () {
      return Promise.all([atom.packages.activatePackage('linter-flake8'), atom.packages.activatePackage('language-python').then(function () {
        return atom.workspace.open(__dirname + '/fixtures/good.py');
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
        return atom.workspace.open(__dirname + '/fixtures/bad.py').then(function (openEditor) {
          editor = openEditor;
        });
      });
    });

    it('finds at least one message', function () {
      return lint(editor).then(function (messages) {
        expect(messages.length).toBeGreaterThan(0);
      });
    });

    it('verifies that message', function () {
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

  it('finds nothing wrong with a valid file', function () {
    waitsForPromise(function () {
      return atom.workspace.open(__dirname + '/fixtures/good.py').then(function (editor) {
        return lint(editor).then(function (messages) {
          expect(messages.length).toEqual(0);
        });
      });
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9NYXJ2aW4vLmF0b20vcGFja2FnZXMvbGludGVyLWZsYWtlOC9zcGVjL2xpbnRlci1mbGFrZTgtc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7O0FBRVosUUFBUSxDQUFDLGdDQUFnQyxFQUFFLFlBQU07QUFDL0MsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFDLElBQUksQ0FBQzs7QUFFekQsWUFBVSxDQUFDLFlBQU07QUFDZixtQkFBZSxDQUFDLFlBQU07QUFDcEIsYUFBTyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQ2pCLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxFQUM5QyxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLElBQUksQ0FBQztlQUNwRCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsbUJBQW1CLENBQUM7T0FBQSxDQUNyRCxDQUNGLENBQUMsQ0FBQztLQUNKLENBQUMsQ0FBQztHQUNKLENBQUMsQ0FBQzs7QUFFSCxJQUFFLENBQUMsZ0NBQWdDLEVBQUUsWUFBTTtBQUN6QyxXQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUMxRSxDQUFDLENBQUM7O0FBRUgsSUFBRSxDQUFDLDZCQUE2QixFQUFFLFlBQU07QUFDdEMsV0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDMUUsQ0FBQyxDQUFDOztBQUVILFVBQVEsQ0FBQyxtQkFBbUIsRUFBRSxZQUFNO0FBQ2xDLFFBQUksTUFBTSxHQUFHLElBQUksQ0FBQztBQUNsQixjQUFVLENBQUMsWUFBTTtBQUNmLHFCQUFlLENBQUMsWUFBTTtBQUNwQixlQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxrQkFBa0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLFVBQVUsRUFBSTtBQUM1RSxnQkFBTSxHQUFHLFVBQVUsQ0FBQztTQUNyQixDQUFDLENBQUM7T0FDSixDQUFDLENBQUM7S0FDSixDQUFDLENBQUM7O0FBRUgsTUFBRSxDQUFDLDRCQUE0QixFQUFFLFlBQU07QUFDckMsYUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsUUFBUSxFQUFJO0FBQ25DLGNBQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO09BQzVDLENBQUMsQ0FBQztLQUNKLENBQUMsQ0FBQzs7QUFFSCxNQUFFLENBQUMsdUJBQXVCLEVBQUUsWUFBTTtBQUNoQyxhQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxRQUFRLEVBQUk7QUFDbkMsY0FBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUN2QyxjQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUM1QyxjQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUMzQyxjQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBQ3ZDLGNBQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7QUFDbkUsY0FBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUMzQyxjQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO0FBQzNFLGNBQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDeEMsY0FBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzVDLGNBQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO09BQ3JELENBQUMsQ0FBQztLQUNKLENBQUMsQ0FBQztHQUNKLENBQUMsQ0FBQzs7QUFFSCxJQUFFLENBQUMsdUNBQXVDLEVBQUUsWUFBTTtBQUNoRCxtQkFBZSxDQUFDLFlBQU07QUFDcEIsYUFBTyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsbUJBQW1CLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxNQUFNLEVBQUk7QUFDekUsZUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsUUFBUSxFQUFJO0FBQ25DLGdCQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNwQyxDQUFDLENBQUM7T0FDSixDQUFDLENBQUM7S0FDSixDQUFDLENBQUM7R0FDSixDQUFDLENBQUM7Q0FDSixDQUFDLENBQUMiLCJmaWxlIjoiL1VzZXJzL01hcnZpbi8uYXRvbS9wYWNrYWdlcy9saW50ZXItZmxha2U4L3NwZWMvbGludGVyLWZsYWtlOC1zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmRlc2NyaWJlKCdUaGUgZmxha2U4IHByb3ZpZGVyIGZvciBMaW50ZXInLCAoKSA9PiB7XG4gIGNvbnN0IGxpbnQgPSByZXF1aXJlKCcuLi9saWIvbWFpbicpLnByb3ZpZGVMaW50ZXIoKS5saW50O1xuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5hbGwoW1xuICAgICAgICBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgnbGludGVyLWZsYWtlOCcpLFxuICAgICAgICBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgnbGFuZ3VhZ2UtcHl0aG9uJykudGhlbigoKSA9PlxuICAgICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oX19kaXJuYW1lICsgJy9maXh0dXJlcy9nb29kLnB5JylcbiAgICAgICAgKVxuICAgICAgXSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgYmUgaW4gdGhlIHBhY2thZ2VzIGxpc3QnLCAoKSA9PiB7XG4gICAgcmV0dXJuIGV4cGVjdChhdG9tLnBhY2thZ2VzLmlzUGFja2FnZUxvYWRlZCgnbGludGVyLWZsYWtlOCcpKS50b0JlKHRydWUpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIGJlIGFuIGFjdGl2ZSBwYWNrYWdlJywgKCkgPT4ge1xuICAgIHJldHVybiBleHBlY3QoYXRvbS5wYWNrYWdlcy5pc1BhY2thZ2VBY3RpdmUoJ2xpbnRlci1mbGFrZTgnKSkudG9CZSh0cnVlKTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2NoZWNrcyBiYWQucHkgYW5kJywgKCkgPT4ge1xuICAgIGxldCBlZGl0b3IgPSBudWxsO1xuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIGF0b20ud29ya3NwYWNlLm9wZW4oX19kaXJuYW1lICsgJy9maXh0dXJlcy9iYWQucHknKS50aGVuKG9wZW5FZGl0b3IgPT4ge1xuICAgICAgICAgIGVkaXRvciA9IG9wZW5FZGl0b3I7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnZmluZHMgYXQgbGVhc3Qgb25lIG1lc3NhZ2UnLCAoKSA9PiB7XG4gICAgICByZXR1cm4gbGludChlZGl0b3IpLnRoZW4obWVzc2FnZXMgPT4ge1xuICAgICAgICBleHBlY3QobWVzc2FnZXMubGVuZ3RoKS50b0JlR3JlYXRlclRoYW4oMCk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCd2ZXJpZmllcyB0aGF0IG1lc3NhZ2UnLCAoKSA9PiB7XG4gICAgICByZXR1cm4gbGludChlZGl0b3IpLnRoZW4obWVzc2FnZXMgPT4ge1xuICAgICAgICBleHBlY3QobWVzc2FnZXNbMF0udHlwZSkudG9CZURlZmluZWQoKTtcbiAgICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLnR5cGUpLnRvRXF1YWwoJ1dhcm5pbmcnKTtcbiAgICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLmh0bWwpLm5vdC50b0JlRGVmaW5lZCgpO1xuICAgICAgICBleHBlY3QobWVzc2FnZXNbMF0udGV4dCkudG9CZURlZmluZWQoKTtcbiAgICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLnRleHQpLnRvRXF1YWwoJ0Y4MjEg4oCUIHVuZGVmaW5lZCBuYW1lIFxcJ2FzZmRcXCcnKTtcbiAgICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLmZpbGVQYXRoKS50b0JlRGVmaW5lZCgpO1xuICAgICAgICBleHBlY3QobWVzc2FnZXNbMF0uZmlsZVBhdGgpLnRvTWF0Y2goLy4rc3BlY1tcXFxcXFwvXWZpeHR1cmVzW1xcXFxcXC9dYmFkXFwucHkkLyk7XG4gICAgICAgIGV4cGVjdChtZXNzYWdlc1swXS5yYW5nZSkudG9CZURlZmluZWQoKTtcbiAgICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLnJhbmdlLmxlbmd0aCkudG9FcXVhbCgyKTtcbiAgICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLnJhbmdlKS50b0VxdWFsKFtbMCwgMF0sIFswLCA0XV0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGl0KCdmaW5kcyBub3RoaW5nIHdyb25nIHdpdGggYSB2YWxpZCBmaWxlJywgKCkgPT4ge1xuICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7XG4gICAgICByZXR1cm4gYXRvbS53b3Jrc3BhY2Uub3BlbihfX2Rpcm5hbWUgKyAnL2ZpeHR1cmVzL2dvb2QucHknKS50aGVuKGVkaXRvciA9PiB7XG4gICAgICAgIHJldHVybiBsaW50KGVkaXRvcikudGhlbihtZXNzYWdlcyA9PiB7XG4gICAgICAgICAgZXhwZWN0KG1lc3NhZ2VzLmxlbmd0aCkudG9FcXVhbCgwKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==
//# sourceURL=/Users/Marvin/.atom/packages/linter-flake8/spec/linter-flake8-spec.js
