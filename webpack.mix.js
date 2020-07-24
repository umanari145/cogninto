const mix = require('laravel-mix');

mix.js('js/main.js', 'js/bundle.js')
.sourceMaps(false);
