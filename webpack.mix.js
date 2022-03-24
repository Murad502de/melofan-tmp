const mix = require('laravel-mix');
const LiveReloadPlugin = require('webpack-livereload-plugin');

mix.webpackConfig(webpack => {
    return {plugins: [new LiveReloadPlugin()]}
});

mix.sourceMaps()
    .js("resources/js/index.js", "public/js").react() // основной файл React JS
    .sass('resources/scss/app.scss', 'public/css')
    .copyDirectory('resources/language', 'public/language') // не обязательно, нужно только для локализации
    // .copyDirectory('resources/video', 'public/video')  // не обязательно, нужно только для видео
    .copyDirectory('resources/scss/libs', 'public/css')  // не обязательно, нужно только для сторонних стилей
    // .copy('resources/images/favicon.ico', 'public') // favicon лучше помещать в папку resources и данная строка копирует её в public
    .js('resources/js/RootPanel/index.js', 'public/js/app.js').react() // не обязательно, нужно только для панели администратора
    
