(function() {
  describe('BottomPanel', function() {
    var BottomPanel, bottomPanel, getMessage, linter;
    BottomPanel = require('../../lib/ui/bottom-panel').BottomPanel;
    linter = null;
    bottomPanel = null;
    beforeEach(function() {
      if (bottomPanel != null) {
        bottomPanel.dispose();
      }
      bottomPanel = new BottomPanel('File');
      return waitsForPromise(function() {
        return atom.packages.activatePackage('linter').then(function() {
          return linter = atom.packages.getActivePackage('linter').mainModule.instance;
        });
      });
    });
    getMessage = function(type, filePath) {
      return {
        type: type,
        text: 'Some Message',
        filePath: filePath
      };
    };
    it('is not visible when there are no errors', function() {
      return expect(linter.views.panel.getVisibility()).toBe(false);
    });
    it('hides on config change', function() {
      linter.views.panel.scope = 'Project';
      linter.views.panel.setMessages({
        added: [getMessage('Error')],
        removed: []
      });
      expect(linter.views.panel.getVisibility()).toBe(true);
      atom.config.set('linter.showErrorPanel', false);
      expect(linter.views.panel.getVisibility()).toBe(false);
      atom.config.set('linter.showErrorPanel', true);
      return expect(linter.views.panel.getVisibility()).toBe(true);
    });
    return describe('{set, remove}Messages', function() {
      return it('works as expected', function() {
        var messages;
        messages = [getMessage('Error'), getMessage('Warning')];
        bottomPanel.setMessages({
          added: messages,
          removed: []
        });
        expect(bottomPanel.element.childNodes[0].childNodes.length).toBe(2);
        bottomPanel.setMessages({
          added: [],
          removed: messages
        });
        expect(bottomPanel.element.childNodes[0].childNodes.length).toBe(0);
        bottomPanel.setMessages({
          added: messages,
          removed: []
        });
        expect(bottomPanel.element.childNodes[0].childNodes.length).toBe(2);
        bottomPanel.removeMessages(messages);
        return expect(bottomPanel.element.childNodes[0].childNodes.length).toBe(0);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL01hcnZpbi8uYXRvbS9wYWNrYWdlcy9saW50ZXIvc3BlYy91aS9ib3R0b20tcGFuZWwtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLEVBQUEsUUFBQSxDQUFTLGFBQVQsRUFBd0IsU0FBQSxHQUFBO0FBQ3RCLFFBQUEsNENBQUE7QUFBQSxJQUFDLGNBQWUsT0FBQSxDQUFRLDJCQUFSLEVBQWYsV0FBRCxDQUFBO0FBQUEsSUFDQSxNQUFBLEdBQVMsSUFEVCxDQUFBO0FBQUEsSUFFQSxXQUFBLEdBQWMsSUFGZCxDQUFBO0FBQUEsSUFHQSxVQUFBLENBQVcsU0FBQSxHQUFBOztRQUNULFdBQVcsQ0FBRSxPQUFiLENBQUE7T0FBQTtBQUFBLE1BQ0EsV0FBQSxHQUFrQixJQUFBLFdBQUEsQ0FBWSxNQUFaLENBRGxCLENBQUE7YUFFQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixRQUE5QixDQUF1QyxDQUFDLElBQXhDLENBQTZDLFNBQUEsR0FBQTtpQkFDM0MsTUFBQSxHQUFTLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWQsQ0FBK0IsUUFBL0IsQ0FBd0MsQ0FBQyxVQUFVLENBQUMsU0FEbEI7UUFBQSxDQUE3QyxFQURjO01BQUEsQ0FBaEIsRUFIUztJQUFBLENBQVgsQ0FIQSxDQUFBO0FBQUEsSUFVQSxVQUFBLEdBQWEsU0FBQyxJQUFELEVBQU8sUUFBUCxHQUFBO0FBQ1gsYUFBTztBQUFBLFFBQUMsTUFBQSxJQUFEO0FBQUEsUUFBTyxJQUFBLEVBQU0sY0FBYjtBQUFBLFFBQTZCLFVBQUEsUUFBN0I7T0FBUCxDQURXO0lBQUEsQ0FWYixDQUFBO0FBQUEsSUFhQSxFQUFBLENBQUcseUNBQUgsRUFBOEMsU0FBQSxHQUFBO2FBQzVDLE1BQUEsQ0FBTyxN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

//# sourceURL=/Users/Marvin/.atom/packages/linter/spec/ui/bottom-panel-spec.coffee
