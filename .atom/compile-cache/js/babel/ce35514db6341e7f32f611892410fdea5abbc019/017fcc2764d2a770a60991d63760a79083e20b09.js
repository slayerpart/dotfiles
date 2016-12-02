'use babel';
'use strict';

var _this = this;

describe('AMU color options', function () {
    beforeEach(function () {
        _this.workspace = atom.views.getView(atom.workspace);
        jasmine.attachToDOM(_this.workspace);

        waitsForPromise('Theme Activation', function () {
            return atom.packages.activatePackage('atom-material-ui');
        });
    });

    it('should be able to change UI base color', function () {
        atom.config.set('atom-material-ui.colors.abaseColor', '#3F51B5');
        expect(atom.config.get('atom-material-ui.colors.abaseColor').toHexString().toUpperCase()).toBe('#3F51B5');

        atom.config.set('atom-material-ui.colors.abaseColor', '#673AB7');
        expect(atom.config.get('atom-material-ui.colors.abaseColor').toHexString().toUpperCase()).toBe('#673AB7');
    });

    it('should be able to change UI accent color', function () {
        atom.config.set('atom-material-ui.colors.accentColor', '#FFFFFF');
        expect(atom.config.get('atom-material-ui.colors.accentColor').toHexString().toUpperCase()).toBe('#FFFFFF');

        atom.config.set('atom-material-ui.colors.accentColor', '#B0E457');
        expect(atom.config.get('atom-material-ui.colors.accentColor').toHexString().toUpperCase()).toBe('#B0E457');
    });

    it('should be able to paint the cursor', function () {
        atom.config.set('atom-material-ui.colors.paintCursor', false);
        expect(_this.workspace.classList.contains('paint-cursor')).toBe(false);

        atom.config.set('atom-material-ui.colors.paintCursor', true);
        expect(_this.workspace.classList.contains('paint-cursor')).toBe(true);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9NYXJ2aW4vLmF0b20vcGFja2FnZXMvYXRvbS1tYXRlcmlhbC11aS9zcGVjL3NldHRpbmdzLWNvbG9yLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFDO0FBQ1osWUFBWSxDQUFDOzs7O0FBRWIsUUFBUSxDQUFDLG1CQUFtQixFQUFFLFlBQU07QUFDaEMsY0FBVSxDQUFDLFlBQU07QUFDYixjQUFLLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDcEQsZUFBTyxDQUFDLFdBQVcsQ0FBQyxNQUFLLFNBQVMsQ0FBQyxDQUFDOztBQUVwQyx1QkFBZSxDQUFDLGtCQUFrQixFQUFFLFlBQU07QUFDdEMsbUJBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsa0JBQWtCLENBQUMsQ0FBQztTQUM1RCxDQUFDLENBQUM7S0FDTixDQUFDLENBQUM7O0FBRUgsTUFBRSxDQUFDLHdDQUF3QyxFQUFFLFlBQU07QUFDL0MsWUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsb0NBQW9DLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDakUsY0FBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLG9DQUFvQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7O0FBRTFHLFlBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLG9DQUFvQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQ2pFLGNBQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQzdHLENBQUMsQ0FBQzs7QUFFSCxNQUFFLENBQUMsMENBQTBDLEVBQUUsWUFBTTtBQUNqRCxZQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxxQ0FBcUMsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUNsRSxjQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMscUNBQXFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQzs7QUFFM0csWUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMscUNBQXFDLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDbEUsY0FBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHFDQUFxQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDOUcsQ0FBQyxDQUFDOztBQUVILE1BQUUsQ0FBQyxvQ0FBb0MsRUFBRSxZQUFNO0FBQzNDLFlBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHFDQUFxQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzlELGNBQU0sQ0FBQyxNQUFLLFNBQVMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUV0RSxZQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxxQ0FBcUMsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUM3RCxjQUFNLENBQUMsTUFBSyxTQUFTLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUN4RSxDQUFDLENBQUM7Q0FDTixDQUFDLENBQUMiLCJmaWxlIjoiL1VzZXJzL01hcnZpbi8uYXRvbS9wYWNrYWdlcy9hdG9tLW1hdGVyaWFsLXVpL3NwZWMvc2V0dGluZ3MtY29sb3Itc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuJ3VzZSBzdHJpY3QnO1xuXG5kZXNjcmliZSgnQU1VIGNvbG9yIG9wdGlvbnMnLCAoKSA9PiB7XG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgIHRoaXMud29ya3NwYWNlID0gYXRvbS52aWV3cy5nZXRWaWV3KGF0b20ud29ya3NwYWNlKTtcbiAgICAgICAgamFzbWluZS5hdHRhY2hUb0RPTSh0aGlzLndvcmtzcGFjZSk7XG5cbiAgICAgICAgd2FpdHNGb3JQcm9taXNlKCdUaGVtZSBBY3RpdmF0aW9uJywgKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdhdG9tLW1hdGVyaWFsLXVpJyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBiZSBhYmxlIHRvIGNoYW5nZSBVSSBiYXNlIGNvbG9yJywgKCkgPT4ge1xuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ2F0b20tbWF0ZXJpYWwtdWkuY29sb3JzLmFiYXNlQ29sb3InLCAnIzNGNTFCNScpO1xuICAgICAgICBleHBlY3QoYXRvbS5jb25maWcuZ2V0KCdhdG9tLW1hdGVyaWFsLXVpLmNvbG9ycy5hYmFzZUNvbG9yJykudG9IZXhTdHJpbmcoKS50b1VwcGVyQ2FzZSgpKS50b0JlKCcjM0Y1MUI1Jyk7XG5cbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCdhdG9tLW1hdGVyaWFsLXVpLmNvbG9ycy5hYmFzZUNvbG9yJywgJyM2NzNBQjcnKTtcbiAgICAgICAgZXhwZWN0KGF0b20uY29uZmlnLmdldCgnYXRvbS1tYXRlcmlhbC11aS5jb2xvcnMuYWJhc2VDb2xvcicpLnRvSGV4U3RyaW5nKCkudG9VcHBlckNhc2UoKSkudG9CZSgnIzY3M0FCNycpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBiZSBhYmxlIHRvIGNoYW5nZSBVSSBhY2NlbnQgY29sb3InLCAoKSA9PiB7XG4gICAgICAgIGF0b20uY29uZmlnLnNldCgnYXRvbS1tYXRlcmlhbC11aS5jb2xvcnMuYWNjZW50Q29sb3InLCAnI0ZGRkZGRicpO1xuICAgICAgICBleHBlY3QoYXRvbS5jb25maWcuZ2V0KCdhdG9tLW1hdGVyaWFsLXVpLmNvbG9ycy5hY2NlbnRDb2xvcicpLnRvSGV4U3RyaW5nKCkudG9VcHBlckNhc2UoKSkudG9CZSgnI0ZGRkZGRicpO1xuXG4gICAgICAgIGF0b20uY29uZmlnLnNldCgnYXRvbS1tYXRlcmlhbC11aS5jb2xvcnMuYWNjZW50Q29sb3InLCAnI0IwRTQ1NycpO1xuICAgICAgICBleHBlY3QoYXRvbS5jb25maWcuZ2V0KCdhdG9tLW1hdGVyaWFsLXVpLmNvbG9ycy5hY2NlbnRDb2xvcicpLnRvSGV4U3RyaW5nKCkudG9VcHBlckNhc2UoKSkudG9CZSgnI0IwRTQ1NycpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBiZSBhYmxlIHRvIHBhaW50IHRoZSBjdXJzb3InLCAoKSA9PiB7XG4gICAgICAgIGF0b20uY29uZmlnLnNldCgnYXRvbS1tYXRlcmlhbC11aS5jb2xvcnMucGFpbnRDdXJzb3InLCBmYWxzZSk7XG4gICAgICAgIGV4cGVjdCh0aGlzLndvcmtzcGFjZS5jbGFzc0xpc3QuY29udGFpbnMoJ3BhaW50LWN1cnNvcicpKS50b0JlKGZhbHNlKTtcblxuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ2F0b20tbWF0ZXJpYWwtdWkuY29sb3JzLnBhaW50Q3Vyc29yJywgdHJ1ZSk7XG4gICAgICAgIGV4cGVjdCh0aGlzLndvcmtzcGFjZS5jbGFzc0xpc3QuY29udGFpbnMoJ3BhaW50LWN1cnNvcicpKS50b0JlKHRydWUpO1xuICAgIH0pO1xufSk7XG4iXX0=
//# sourceURL=/Users/Marvin/.atom/packages/atom-material-ui/spec/settings-color-spec.js
