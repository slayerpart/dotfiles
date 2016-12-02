(function() {
  var coffeescript, css, js, objectiveC, php, ruby, sass, web;

  css = ['css', 'bootstrap', 'foundation', 'awesome', 'cordova', 'phonegap'];

  sass = ['sass', 'compass', 'bourbon', 'neat'].concat(css);

  js = ['javascript', 'jquery', 'jqueryui', 'jquerym', 'react', 'nodejs', 'angularjs', 'backbone', 'marionette', 'meteor', 'moo', 'prototype', 'ember', 'lodash', 'underscore', 'sencha', 'extjs', 'titanium', 'knockout', 'zepto', 'cordova', 'phonegap', 'yui', 'unity3d'];

  web = ['html', 'svg', 'statamic'].concat(js, css);

  coffeescript = ['coffee'].concat(web);

  php = ['php', 'wordpress', 'drupal', 'zend', 'laravel', 'yii', 'joomla', 'ee', 'codeigniter', 'cakephp', 'phpunit', 'symfony', 'typo3', 'twig', 'smarty', 'phpp', 'mysql', 'sqlite', 'mongodb', 'psql', 'redis', 'html', 'statamic', 'svg', 'css', 'bootstrap', 'foundation', 'awesome'];

  ruby = ['ruby', 'rubygems', 'rails'];

  objectiveC = ['iphoneos', 'macosx', 'appledoc', 'cocos2d', 'cocos3d', 'kobold2d', 'sparrow', 'c', 'manpages'];

  module.exports = {
    'ActionScript': ['actionscript'],
    'Boo': ['unity3d'],
    'C': ['c', 'glib', 'gl2', 'gl3', 'gl4', 'manpages'],
    'C++': ['cpp', 'net', 'boost', 'qt', 'cvcpp', 'cocos2dx', 'c', 'manpages'],
    'C#': ['net', 'mono', 'unity3d'],
    'Objective-J': ['cappuccino'],
    'Clojure': ['clojure'],
    'CoffeeScript': coffeescript,
    'CoffeeScript (Literate)': coffeescript,
    'ColdFusion': ['cf'],
    'CSS': css,
    'Dart': ['dartlang', 'polymerdart', 'angulardart'],
    'Elixir': ['elixir'],
    'Erlang': ['erlang'],
    'Go': ['go', 'godoc'],
    'Haskell': ['haskell'],
    'Ruby Haml': ['haml'],
    'Handlebars': web,
    'HTML': web,
    'HTML (Rails)': ['ruby', 'rubygems', 'rails'].concat(web),
    'Jade': ['jade'].concat(web),
    'Java': ['java', 'javafx', 'grails', 'groovy', 'playjava', 'spring', 'cvj', 'processing'],
    'JavaScript': js,
    'LaTeX': ['latex'],
    'LESS': css,
    'Lisp': ['lisp'],
    'Literate Haskell': ['haskell'],
    'Lua': ['lua', 'corona'],
    'GitHub Markdown': ['markdown'],
    'Objective-C': objectiveC,
    'Objective-C++': ['cpp', 'cocos2dx'].concat(objectiveC),
    'OCaml': ['ocaml'],
    'Perl': ['perl', 'manpages'],
    'PHP': php.concat(web),
    'Processing': ['processing'],
    'Puppet': ['puppet'],
    'Python': ['python', 'django', 'twisted', 'sphinx', 'flask', 'tornado', 'sqlalchemy', 'numpy', 'scipy', 'salt', 'cvp'],
    'R': ['r'],
    'Ruby': ruby,
    'Ruby on Rails': ruby,
    'Rust': ['rust'],
    'Sass': sass,
    'SCSS': sass,
    'Scala': ['scala', 'akka', 'playscala'],
    'Shell Scripts': ['bash', 'manpages'],
    'SQL': ['mysql', 'sqlite', 'psql'],
    'SQL (Rails)': ruby,
    'Stylus': css,
    'Tcl': ['tcl'],
    'YAML': ['chef', 'ansible']
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL01hcnZpbi8uYXRvbS9wYWNrYWdlcy9kYXNoL2xpYi9ncmFtbWFyLW1hcC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsdURBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQU0sQ0FDSixLQURJLEVBRUosV0FGSSxFQUdKLFlBSEksRUFJSixTQUpJLEVBS0osU0FMSSxFQU1KLFVBTkksQ0FBTixDQUFBOztBQUFBLEVBU0EsSUFBQSxHQUFPLENBQ0wsTUFESyxFQUVMLFNBRkssRUFHTCxTQUhLLEVBSUwsTUFKSyxDQUtOLENBQUMsTUFMSyxDQUtFLEdBTEYsQ0FUUCxDQUFBOztBQUFBLEVBZ0JBLEVBQUEsR0FBSyxDQUNILFlBREcsRUFFSCxRQUZHLEVBR0gsVUFIRyxFQUlILFNBSkcsRUFLSCxPQUxHLEVBTUgsUUFORyxFQU9ILFdBUEcsRUFRSCxVQVJHLEVBU0gsWUFURyxFQVVILFFBVkcsRUFXSCxLQVhHLEVBWUgsV0FaRyxFQWFILE9BYkcsRUFjSCxRQWRHLEVBZUgsWUFmRyxFQWdCSCxRQWhCRyxFQWlCSCxPQWpCRyxFQWtCSCxVQWxCRyxFQW1CSCxVQW5CRyxFQW9CSCxPQXBCRyxFQXFCSCxTQXJCRyxFQXNCSCxVQXRCRyxFQXVCSCxLQXZCRyxFQXdCSCxTQXhCRyxDQWhCTCxDQUFBOztBQUFBLEVBMkNBLEdBQUEsR0FBTSxDQUNKLE1BREksRUFFSixLQUZJLEVBR0osVUFISSxDQUlMLENBQUMsTUFKSSxDQUlHLEVBSkgsRUFJTyxHQUpQLENBM0NOLENBQUE7O0FBQUEsRUFpREEsWUFBQSxHQUFlLENBQ2IsUUFEYSxDQUVkLENBQUMsTUFGYSxDQUVOLEdBRk0sQ0FqRGYsQ0FBQTs7QUFBQSxFQXFEQSxHQUFBLEdBQU0sQ0FDSixLQURJLEVBRUosV0FGSSxFQUdKLFFBSEksRUFJSixNQUpJLEVBS0osU0FM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

//# sourceURL=/Users/Marvin/.atom/packages/dash/lib/grammar-map.coffee
