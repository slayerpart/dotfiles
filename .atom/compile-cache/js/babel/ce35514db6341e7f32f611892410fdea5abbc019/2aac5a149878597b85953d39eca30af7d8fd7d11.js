'use babel';
'use strict';

var rippleClick = function rippleClick(event) {
    var item = event.target;

    if (item) {
        (function () {
            var rect = item.getBoundingClientRect();
            var x = (event.clientX || 80) - rect.left;
            var y = (event.clientY || 24) - rect.top;
            var ink = undefined;

            if (item.querySelectorAll('.ink').length === 0) {
                var _ink = document.createElement('span');

                _ink.classList.add('ink');
                item.appendChild(_ink);
            }

            ink = item.querySelector('.ink');
            ink.style.left = x + 'px';
            ink.style.top = y + 'px';

            setTimeout(function () {
                if (ink && ink.parentElement) {
                    ink.parentElement.removeChild(ink);
                }
            }, 1000);
        })();
    }
};

module.exports = {
    apply: function apply() {
        var tabs = document.querySelectorAll('.tab-bar');

        // Ripple Effect for Tabs
        if (tabs) {
            for (var i = 0; i < tabs.length; i++) {
                tabs[i].removeEventListener('click', rippleClick);
                tabs[i].addEventListener('click', rippleClick);

                atom.workspace.onDidChangeActivePaneItem(function () {
                    var activeTab = document.querySelector('.tab-bar .tab.active');

                    if (activeTab && activeTab.click) {
                        activeTab.click();
                    }
                });
            }
        }
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9NYXJ2aW4vLmF0b20vcGFja2FnZXMvYXRvbS1tYXRlcmlhbC11aS9saWIvYW11LWJpbmRpbmdzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQztBQUNaLFlBQVksQ0FBQzs7QUFFYixJQUFJLFdBQVcsR0FBRyxTQUFkLFdBQVcsQ0FBWSxLQUFLLEVBQUU7QUFDOUIsUUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQzs7QUFFeEIsUUFBSSxJQUFJLEVBQUU7O0FBQ04sZ0JBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO0FBQ3hDLGdCQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFBLEdBQUksSUFBSSxDQUFDLElBQUksQ0FBQztBQUMxQyxnQkFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQSxHQUFJLElBQUksQ0FBQyxHQUFHLENBQUM7QUFDekMsZ0JBQUksR0FBRyxZQUFBLENBQUM7O0FBRVIsZ0JBQUksSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7QUFDNUMsb0JBQUksSUFBRyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRXpDLG9CQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN6QixvQkFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFHLENBQUMsQ0FBQzthQUN6Qjs7QUFFRCxlQUFHLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNqQyxlQUFHLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQzFCLGVBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7O0FBRXpCLHNCQUFVLENBQUMsWUFBTTtBQUNiLG9CQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsYUFBYSxFQUFFO0FBQzFCLHVCQUFHLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztpQkFDdEM7YUFDSixFQUFFLElBQUksQ0FBQyxDQUFDOztLQUNaO0NBQ0osQ0FBQzs7QUFFRixNQUFNLENBQUMsT0FBTyxHQUFHO0FBQ2IsU0FBSyxFQUFBLGlCQUFHO0FBQ0osWUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxDQUFDOzs7QUFHakQsWUFBSSxJQUFJLEVBQUU7QUFDTixpQkFBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDbEMsb0JBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsV0FBVyxDQUFDLENBQUM7QUFDbEQsb0JBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsV0FBVyxDQUFDLENBQUM7O0FBRS9DLG9CQUFJLENBQUMsU0FBUyxDQUFDLHlCQUF5QixDQUFDLFlBQU07QUFDM0Msd0JBQUksU0FBUyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsc0JBQXNCLENBQUMsQ0FBQzs7QUFFL0Qsd0JBQUksU0FBUyxJQUFJLFNBQVMsQ0FBQyxLQUFLLEVBQUU7QUFDOUIsaUNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztxQkFDckI7aUJBQ0osQ0FBQyxDQUFDO2FBQ047U0FDSjtLQUNKO0NBQ0osQ0FBQyIsImZpbGUiOiIvVXNlcnMvTWFydmluLy5hdG9tL3BhY2thZ2VzL2F0b20tbWF0ZXJpYWwtdWkvbGliL2FtdS1iaW5kaW5ncy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgcmlwcGxlQ2xpY2sgPSBmdW5jdGlvbihldmVudCkge1xuICAgIHZhciBpdGVtID0gZXZlbnQudGFyZ2V0O1xuXG4gICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgbGV0IHJlY3QgPSBpdGVtLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBsZXQgeCA9IChldmVudC5jbGllbnRYIHx8IDgwKSAtIHJlY3QubGVmdDtcbiAgICAgICAgbGV0IHkgPSAoZXZlbnQuY2xpZW50WSB8fCAyNCkgLSByZWN0LnRvcDtcbiAgICAgICAgbGV0IGluaztcblxuICAgICAgICBpZiAoaXRlbS5xdWVyeVNlbGVjdG9yQWxsKCcuaW5rJykubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBsZXQgaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuXG4gICAgICAgICAgICBpbmsuY2xhc3NMaXN0LmFkZCgnaW5rJyk7XG4gICAgICAgICAgICBpdGVtLmFwcGVuZENoaWxkKGluayk7XG4gICAgICAgIH1cblxuICAgICAgICBpbmsgPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoJy5pbmsnKTtcbiAgICAgICAgaW5rLnN0eWxlLmxlZnQgPSB4ICsgJ3B4JztcbiAgICAgICAgaW5rLnN0eWxlLnRvcCA9IHkgKyAncHgnO1xuXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgaWYgKGluayAmJiBpbmsucGFyZW50RWxlbWVudCkge1xuICAgICAgICAgICAgICAgIGluay5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKGluayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIDEwMDApO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGFwcGx5KCkge1xuICAgICAgICB2YXIgdGFicyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWItYmFyJyk7XG5cbiAgICAgICAgLy8gUmlwcGxlIEVmZmVjdCBmb3IgVGFic1xuICAgICAgICBpZiAodGFicykge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0YWJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGFic1tpXS5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHJpcHBsZUNsaWNrKTtcbiAgICAgICAgICAgICAgICB0YWJzW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcmlwcGxlQ2xpY2spO1xuXG4gICAgICAgICAgICAgICAgYXRvbS53b3Jrc3BhY2Uub25EaWRDaGFuZ2VBY3RpdmVQYW5lSXRlbSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhY3RpdmVUYWIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudGFiLWJhciAudGFiLmFjdGl2ZScpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChhY3RpdmVUYWIgJiYgYWN0aXZlVGFiLmNsaWNrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmVUYWIuY2xpY2soKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufTtcbiJdfQ==
//# sourceURL=/Users/Marvin/.atom/packages/atom-material-ui/lib/amu-bindings.js
