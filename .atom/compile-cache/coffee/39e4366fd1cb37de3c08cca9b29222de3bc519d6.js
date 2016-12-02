(function() {
  var $;

  $ = require("atom-space-pen-views").$;

  module.exports = {
    activate: function(state) {
      return atom.workspace.observeTextEditors(function(editor) {
        var _editor;
        _editor = editor;
        return editor.onDidChange(function() {
          var shadow, view;
          view = $(atom.views.getView(_editor));
          shadow = $(view[0].shadowRoot);
          shadow.find(".css.color, .rgb-value, .w3c-standard-color-name").each(function(i, el) {
            var type;
            type = $(this).prevAll(".support.function").text();
            if (type === "rgb" || type === "rgba") {
              return $(this)[0].style["border-bottom"] = "1px solid " + type + "(" + el.innerText + ")";
            } else {
              return $(this)[0].style["border-bottom"] = "1px solid " + el.innerText;
            }
          });
          shadow.find(".meta.property-value.css").each(function(i, el) {
            var cache, hslValues, type, values;
            type = $(this).find(".support.function, .misc.css").text();
            cache = $(this).find(".numeric.css");
            if (type === "hsl" || type === "hsla") {
              values = "";
              hslValues = cache.each(function() {
                return values += $(this).text() + ",";
              });
              if (values.length) {
                values = values.slice(0, values.length - 1);
                return cache.each(function() {
                  return $(this)[0].style["border-bottom"] = "1px solid " + type + "(" + values + ")";
                });
              }
            }
          });
          return shadow.find(".less").each(function() {
            var cache, rgbValues, type, values;
            type = $(this).find(".builtin").text();
            cache = $(this).find(".numeric.css");
            if (type === "rgb" || type === "rgba") {
              values = "";
              rgbValues = cache.each(function() {
                return values += $(this).text() + ",";
              });
              if (values.length) {
                values = values.slice(0, values.length - 1);
                return cache.each(function() {
                  return $(this)[0].style["border-bottom"] = "1px solid " + type + "(" + values + ")";
                });
              }
            }
          });
        });
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL01hcnZpbi8uYXRvbS9wYWNrYWdlcy9jc3MtY29sb3ItdW5kZXJsaW5lL2xpYi9tYWluLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxDQUFBOztBQUFBLEVBQUMsSUFBSyxPQUFBLENBQVEsc0JBQVIsRUFBTCxDQUFELENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUFpQjtBQUFBLElBQUEsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBO2FBRXpCLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWYsQ0FBa0MsU0FBQyxNQUFELEdBQUE7QUFDaEMsWUFBQSxPQUFBO0FBQUEsUUFBQSxPQUFBLEdBQVUsTUFBVixDQUFBO2VBQ0EsTUFBTSxDQUFDLFdBQVAsQ0FBbUIsU0FBQSxHQUFBO0FBRWpCLGNBQUEsWUFBQTtBQUFBLFVBQUEsSUFBQSxHQUFPLENBQUEsQ0FBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsT0FBbkIsQ0FBRixDQUFQLENBQUE7QUFBQSxVQUNBLE1BQUEsR0FBUyxDQUFBLENBQUUsSUFBSyxDQUFBLENBQUEsQ0FBRSxDQUFDLFVBQVYsQ0FEVCxDQUFBO0FBQUEsVUFHQSxNQUFNLENBQUMsSUFBUCxDQUFZLGtEQUFaLENBQStELENBQUMsSUFBaEUsQ0FBcUUsU0FBQyxDQUFELEVBQUksRUFBSixHQUFBO0FBQ25FLGdCQUFBLElBQUE7QUFBQSxZQUFBLElBQUEsR0FBTyxDQUFBLENBQUUsSUFBRixDQUFPLENBQUMsT0FBUixDQUFnQixtQkFBaEIsQ0FBb0MsQ0FBQyxJQUFyQyxDQUFBLENBQVAsQ0FBQTtBQUNBLFlBQUEsSUFBRyxJQUFBLEtBQVEsS0FBUixJQUFpQixJQUFBLEtBQVEsTUFBNUI7cUJBQ0UsQ0FBQSxDQUFFLElBQUYsQ0FBUSxDQUFBLENBQUEsQ0FBRSxD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

//# sourceURL=/Users/Marvin/.atom/packages/css-color-underline/lib/main.coffee
